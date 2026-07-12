import type { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ACCESS_TOKEN_MAX_AGE,
  AUTH_COOKIE_NAME,
  AUTH_REFRESH_COOKIE_NAME,
  REFRESH_TOKEN_MAX_AGE_REMEMBER,
  REFRESH_TOKEN_MAX_AGE_SESSION,
} from "@/lib/auth/constants";

function baseCookieOptions() {
  return {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}

/** Strip accidental `Bearer ` prefix from stored/extracted tokens. */
export function normalizeAccessToken(token: string) {
  const trimmed = token.trim();
  return trimmed.replace(/^Bearer\s+/i, "");
}

export function applyAuthCookies(
  response: NextResponse,
  tokens: { accessToken: string; refreshToken?: string | null },
  rememberMe = false,
) {
  response.cookies.set(
    AUTH_COOKIE_NAME,
    normalizeAccessToken(tokens.accessToken),
    {
      ...baseCookieOptions(),
      maxAge: ACCESS_TOKEN_MAX_AGE,
    },
  );

  if (tokens.refreshToken) {
    response.cookies.set(
      AUTH_REFRESH_COOKIE_NAME,
      normalizeAccessToken(tokens.refreshToken),
      {
        ...baseCookieOptions(),
        maxAge: rememberMe
          ? REFRESH_TOKEN_MAX_AGE_REMEMBER
          : REFRESH_TOKEN_MAX_AGE_SESSION,
      },
    );
  }

  return response;
}

export function applyClearAuthCookies(response: NextResponse) {
  const cleared = { ...baseCookieOptions(), maxAge: 0 };
  response.cookies.set(AUTH_COOKIE_NAME, "", cleared);
  response.cookies.set(AUTH_REFRESH_COOKIE_NAME, "", cleared);
  return response;
}

/** @deprecated use applyAuthCookies */
export function applyAuthTokenCookie(
  response: NextResponse,
  token: string,
  rememberMe = false,
) {
  return applyAuthCookies(response, { accessToken: token }, rememberMe);
}

/** @deprecated use applyClearAuthCookies */
export function applyClearAuthTokenCookie(response: NextResponse) {
  return applyClearAuthCookies(response);
}

export async function getAuthTokenFromCookie() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null;
  return raw ? normalizeAccessToken(raw) : null;
}

export async function getRefreshTokenFromCookie() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(AUTH_REFRESH_COOKIE_NAME)?.value ?? null;
  return raw ? normalizeAccessToken(raw) : null;
}
