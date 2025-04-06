// app/api/update/route.js
"use server";

import { NextResponse } from "next/server";
import mariadb from "mariadb";

// DB 연결 풀 설정
const pool = mariadb.createPool({
  host: "13.125.249.103",
  port: 3306,
  user: "ydh960823",
  password: "dbtmddyd2!",
  database: "MAW",
  connectionLimit: 5,
});

// GET 요청 처리
export async function GET() {
  let conn;

  try {
    conn = await pool.getConnection();

    // versioninfo 테이블의 모든 데이터를 조회
    const result = await conn.query("SELECT * FROM itemEXV");

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("버전 정보 조회 오류:", error);
    return NextResponse.json(
      { success: false, error: "버전 정보를 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}
