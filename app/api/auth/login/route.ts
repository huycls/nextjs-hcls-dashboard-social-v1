import { NextResponse } from "next/server";
import { parseApiError } from "@/lib/automations/automations-api";
import {
  AUTH_COOKIE_NAME,
  extractAccessToken,
  getAuthLoginUrl,
  type LoginResponsePayload,
} from "@/lib/auth/auth-server";

type LoginBody = {
  email?: string;
  password?: string;
  rememberMe?: boolean;
};

const ONE_DAY_SECONDS = 60 * 60 * 24;
const THIRTY_DAYS_SECONDS = ONE_DAY_SECONDS * 30;

export async function POST(request: Request) {
  let body: LoginBody;

  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  const email = body.email?.trim();
  const password = body.password;

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, message: "Email and password are required." },
      { status: 400 },
    );
  }

  const url = getAuthLoginUrl();

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, message: await parseApiError(response) },
        { status: response.status },
      );
    }

    const data = (await response.json()) as LoginResponsePayload;
    const token = extractAccessToken(data);

    if (!token) {
      return NextResponse.json(
        { ok: false, message: "Login succeeded but no access token returned." },
        { status: 502 },
      );
    }

    const result = NextResponse.json({
      ok: true,
      user: data.user ?? null,
    });

    result.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: body.rememberMe ? THIRTY_DAYS_SECONDS : ONE_DAY_SECONDS,
    });

    return result;
  } catch (error) {
    const hint =
      error instanceof Error ? error.message : "Unknown connection error";

    return NextResponse.json(
      { ok: false, message: `Could not reach backend at ${url}. ${hint}` },
      { status: 502 },
    );
  }
}
