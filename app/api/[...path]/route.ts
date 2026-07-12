import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { BACKEND_BASE_URL } from "@/lib/api/backend-config";
import {
  AUTH_COOKIE_NAME,
  AUTH_REFRESH_COOKIE_NAME,
} from "@/lib/auth/constants";
import {
  applyAuthCookies,
  applyClearAuthCookies,
  normalizeAccessToken,
} from "@/lib/auth/auth-cookie";
import { refreshAuthTokens } from "@/lib/auth/refresh-auth";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function forwardToBackend(options: {
  request: NextRequest;
  path: string[];
  accessToken: string;
  body: ArrayBuffer | null;
}) {
  const { request, path, accessToken, body } = options;

  const targetUrl = new URL(
    `${BACKEND_BASE_URL}/api/${path.map(encodeURIComponent).join("/")}`,
  );
  targetUrl.search = request.nextUrl.search;

  const headers = new Headers();
  headers.set("Authorization", `Bearer ${accessToken}`);

  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    cache: "no-store",
  };

  if (body) {
    init.body = body;
  }

  return fetch(targetUrl, init);
}

function passThroughBackendResponse(backendResponse: Response) {
  const responseHeaders = new Headers();
  const responseContentType = backendResponse.headers.get("content-type");
  if (responseContentType) {
    responseHeaders.set("Content-Type", responseContentType);
  }

  return new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    headers: responseHeaders,
  });
}

async function proxyRequest(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  if (!path?.length) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  // Handled by dedicated routes under /api/auth/*
  if (path[0] === "auth") {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  const rawAccess = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  let accessToken = rawAccess ? normalizeAccessToken(rawAccess) : null;

  const rawRefresh = request.cookies.get(AUTH_REFRESH_COOKIE_NAME)?.value;
  const refreshToken = rawRefresh ? normalizeAccessToken(rawRefresh) : null;

  if (!accessToken && !refreshToken) {
    return NextResponse.json(
      { message: "Unauthorized. Please sign in again." },
      { status: 401 },
    );
  }

  const body =
    request.method !== "GET" && request.method !== "HEAD"
      ? await request.arrayBuffer()
      : null;

  const run = (token: string) =>
    forwardToBackend({ request, path, accessToken: token, body });

  if (!accessToken && refreshToken) {
    const refreshed = await refreshAuthTokens(refreshToken);
    if (!refreshed) {
      return applyClearAuthCookies(
        NextResponse.json(
          { message: "Session expired. Please sign in again." },
          { status: 401 },
        ),
      );
    }

    try {
      const backendResponse = await run(refreshed.accessToken);
      return applyAuthCookies(
        passThroughBackendResponse(backendResponse),
        refreshed,
      );
    } catch {
      return NextResponse.json(
        { message: `Could not reach backend at ${BACKEND_BASE_URL}.` },
        { status: 502 },
      );
    }
  }

  let backendResponse: Response;

  try {
    backendResponse = await run(accessToken!);
  } catch {
    return NextResponse.json(
      { message: `Could not reach backend at ${BACKEND_BASE_URL}.` },
      { status: 502 },
    );
  }

  if (backendResponse.status === 401 && refreshToken) {
    const refreshed = await refreshAuthTokens(refreshToken);
    if (!refreshed) {
      return applyClearAuthCookies(
        NextResponse.json(
          { message: "Session expired. Please sign in again." },
          { status: 401 },
        ),
      );
    }

    try {
      backendResponse = await run(refreshed.accessToken);
    } catch {
      return NextResponse.json(
        { message: `Could not reach backend at ${BACKEND_BASE_URL}.` },
        { status: 502 },
      );
    }

    return applyAuthCookies(
      passThroughBackendResponse(backendResponse),
      refreshed,
    );
  }

  return passThroughBackendResponse(backendResponse);
}

export async function GET(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}
