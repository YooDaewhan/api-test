"use server";
import { NextResponse } from "next/server";
import mariadb from "mariadb";
import bcrypt from "bcrypt";

// DB 연결 풀 설정
const pool = mariadb.createPool({
  host: "13.125.249.103",
  port: 3306,
  user: "ydh960823",
  password: "dbtmddyd2!",
  database: "MAW",
  connectionLimit: 5,
});

// POST 요청 처리
export async function POST(req) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { success: false, error: "이메일과 비밀번호를 모두 입력해주세요." },
      { status: 400 }
    );
  }

  let conn;
  try {
    conn = await pool.getConnection();

    // 이메일로 사용자 검색
    const result = await conn.query(
      "SELECT * FROM user_accounts WHERE email = ? LIMIT 1",
      [email]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "존재하지 않는 계정입니다." },
        { status: 401 }
      );
    }

    const user = result[0];

    // 비밀번호 비교
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { success: false, error: "비밀번호가 틀렸습니다." },
        { status: 401 }
      );
    }

    // 로그인 성공
    return NextResponse.json({
      success: true,
      message: "로그인 성공",
      userId: user.id || user.email, // ID 컬럼 이름이 다를 경우에 맞게 조정
    });
  } catch (error) {
    console.error("로그인 오류:", error);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}
