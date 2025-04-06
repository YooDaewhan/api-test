// src/app/api/example/route.js (Next.js App Router 방식)

import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET() {
  let conn;
  try {
    conn = await getConnection();
    const rows = await conn.query("SELECT * FROM 네_테이블_이름"); // 너의 DB 테이블명 입력
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "데이터베이스 조회 실패" },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}
