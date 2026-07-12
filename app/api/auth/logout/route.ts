import { NextResponse } from "next/server";
import { applyClearAuthCookies } from "@/lib/auth/auth-cookie";

export async function POST() {
  const response = new NextResponse(null, { status: 204 });
  return applyClearAuthCookies(response);
}
