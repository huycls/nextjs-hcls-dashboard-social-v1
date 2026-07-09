export type LoginResult = {
  ok: boolean;
  message?: string;
  user?: {
    id?: string;
    email?: string;
    name?: string;
  } | null;
};

export async function loginWithCredentials(
  email: string,
  password: string,
  rememberMe: boolean,
): Promise<LoginResult> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, rememberMe }),
  });

  const data = (await response.json()) as LoginResult;

  if (!response.ok) {
    return {
      ok: false,
      message: data.message ?? "Login failed. Please try again.",
    };
  }

  return data;
}

export async function logout() {
  await fetch("/api/auth/logout", { method: "POST" });
}
