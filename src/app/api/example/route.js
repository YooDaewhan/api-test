"use server";
import { NextResponse } from "next/server";
import mariadb from "mariadb";

const pool = mariadb.createPool({
  host: "13.125.249.103",
  port: 3306,
  user: "ydh960823",
  password: "dbtmddyd2!",
  database: "my_pokemon_go",
  connectionLimit: 5,
});

export async function GET() {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM email"); // 여기 네 실제 테이블명으로 꼭 바꿔줘.
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
