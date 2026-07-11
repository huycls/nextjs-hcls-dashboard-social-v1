import { BACKEND_BASE_URL } from "@/lib/api/backend-config";
import { parseApiError } from "@/lib/automations/automations-api";
import { getClientAuthHeaders } from "@/lib/auth/auth-client";

const GOOGLE_INTEGRATION_BASE = `${BACKEND_BASE_URL}/api/integrations/google`;

export type GoogleIntegrationStatus = {
  connected: boolean;
  email?: string | null;
  spreadsheetId?: string | null;
  status?: "connected" | "revoked" | "expired" | string;
};

export type GoogleAuthUrlResult = {
  ok: boolean;
  authUrl?: string;
  message?: string;
};

export type GoogleMutationResult = {
  ok: boolean;
  message?: string;
  status?: GoogleIntegrationStatus | null;
};

function extractAuthUrl(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const data = payload as Record<string, unknown>;
  const candidates = [data.authUrl, data.url, data.authorizationUrl];
  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function normalizeStatus(payload: unknown): GoogleIntegrationStatus {
  if (!payload || typeof payload !== "object") {
    return { connected: false };
  }

  const data = payload as Record<string, unknown>;
  const email =
    typeof data.email === "string"
      ? data.email
      : typeof data.googleEmail === "string"
        ? data.googleEmail
        : null;
  const spreadsheetId =
    typeof data.spreadsheetId === "string" ? data.spreadsheetId : null;
  const status =
    typeof data.status === "string" ? data.status : undefined;
  const connected =
    typeof data.connected === "boolean"
      ? data.connected
      : status === "connected";

  return {
    connected,
    email,
    spreadsheetId,
    status,
  };
}

export async function fetchGoogleIntegrationStatus(): Promise<GoogleIntegrationStatus> {
  const response = await fetch(`${GOOGLE_INTEGRATION_BASE}/status`, {
    cache: "no-store",
    headers: getClientAuthHeaders(),
  });

  if (response.status === 404) {
    return { connected: false };
  }

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return normalizeStatus(await response.json());
}

export async function fetchGoogleAuthUrl(
  returnUrl: string,
): Promise<GoogleAuthUrlResult> {
  try {
    const url = new URL(`${GOOGLE_INTEGRATION_BASE}/auth-url`);
    url.searchParams.set("returnUrl", returnUrl);

    const response = await fetch(url.toString(), {
      cache: "no-store",
      headers: getClientAuthHeaders(),
    });

    if (!response.ok) {
      return {
        ok: false,
        message: await parseApiError(response),
      };
    }

    const authUrl = extractAuthUrl(await response.json());
    if (!authUrl) {
      return {
        ok: false,
        message: "Backend did not return a Google auth URL.",
      };
    }

    return { ok: true, authUrl };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Could not start Google OAuth.",
    };
  }
}

export async function disconnectGoogleIntegration(): Promise<GoogleMutationResult> {
  try {
    const response = await fetch(GOOGLE_INTEGRATION_BASE, {
      method: "DELETE",
      headers: getClientAuthHeaders(),
    });

    if (!response.ok) {
      return { ok: false, message: await parseApiError(response) };
    }

    return { ok: true, status: { connected: false } };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Could not disconnect Google.",
    };
  }
}

export async function updateGoogleSpreadsheetId(
  spreadsheetId: string,
): Promise<GoogleMutationResult> {
  try {
    const response = await fetch(GOOGLE_INTEGRATION_BASE, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getClientAuthHeaders(),
      },
      body: JSON.stringify({ spreadsheetId: spreadsheetId.trim() }),
    });

    if (!response.ok) {
      return { ok: false, message: await parseApiError(response) };
    }

    const data = await response.json().catch(() => null);
    return {
      ok: true,
      status: data ? normalizeStatus(data) : { connected: true, spreadsheetId },
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Could not update spreadsheet ID.",
    };
  }
}

export function readGoogleOAuthReturnParam(
  searchParams: URLSearchParams | null,
): "connected" | "error" | null {
  if (!searchParams) return null;
  const value = searchParams.get("google");
  if (value === "connected" || value === "error") return value;
  return null;
}

export function clearGoogleOAuthReturnParam() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (!url.searchParams.has("google")) return;
  url.searchParams.delete("google");
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}
