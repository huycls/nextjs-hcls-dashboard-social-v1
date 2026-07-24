import { NextResponse } from "next/server";
import { BACKEND_BASE_URL } from "@/lib/api/backend-config";
import { applyAuthCookies } from "@/lib/auth/auth-cookie";
import { extractAuthTokens } from "@/lib/auth/refresh-auth";
import { parseApiError } from "@/lib/automations/automations-api";

type LoginBody = {
  email?: string;
  password?: string;
  rememberMe?: boolean;
};

export async function POST(request: Request) {
  let body: LoginBody;

  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json(
      { message: "Nội dung JSON không hợp lệ." },
      { status: 400 },
    );
  }

  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";
  const rememberMe = Boolean(body.rememberMe);

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email và mật khẩu là bắt buộc." },
      { status: 400 },
    );
  }

  let backendResponse: Response;

  try {
    backendResponse = await fetch(`${BACKEND_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      {
        message: `Không thể kết nối backend tại ${BACKEND_BASE_URL}/api/auth/login.`,
      },
      { status: 502 },
    );
  }

  if (!backendResponse.ok) {
    return NextResponse.json(
      { message: await parseApiError(backendResponse) },
      { status: backendResponse.status },
    );
  }

  const payload = await backendResponse.json();
  const tokens = extractAuthTokens(payload);

  if (!tokens) {
    return NextResponse.json(
      { message: "Đăng nhập thành công nhưng không nhận được access token." },
      { status: 502 },
    );
  }

  const response = NextResponse.json({
    user: tokens.user ?? null,
  });

  return applyAuthCookies(response, tokens, rememberMe);
}
