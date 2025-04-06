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
      { error: "이메일과 비밀번호를 모두 입력해주세요." },
      { status: 400 }
    );
  }

  let conn;
  try {
    conn = await pool.getConnection();

    // 1. 이메일 중복 검사
    const existingUser = await conn.query(
      "SELECT * FROM user_accounts WHERE email = ? LIMIT 1",
      [email]
    );

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "이미 존재하는 이메일입니다." },
        { status: 409 } // 409 Conflict
      );
    }

    // 2. 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. INSERT 쿼리 실행
    const result = await conn.query(
      "INSERT INTO user_accounts (email, password) VALUES (?, ?)",
      [email, hashedPassword]
    );

    return NextResponse.json({
      message: "회원가입 성공",
      insertId: Number(result.insertId),
    });
  } catch (error) {
    console.error("DB INSERT 에러:", error);
    return NextResponse.json({ error: "회원가입 실패" }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}
