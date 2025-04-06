// src/app/api/Signup/route.js
"use server";

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getConnection } from "@/lib/db"; // lib에서 getConnection 가져오기

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
    conn = await getConnection(); // 변경된 부분

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await conn.query(
      "INSERT INTO email (email, password) VALUES (?, ?)",
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
