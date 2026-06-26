/**
 * Đọc biến PUBLIC_* / NEXT_PUBLIC_* (Next.js) hoặc process.env.
 */

export const DEFAULT_WORDPRESS_GRAPHQL =
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL || "";

function envKeys(name: string): string[] {
  const keys = [name];
  if (name.startsWith("PUBLIC_")) {
    keys.push(`NEXT_${name}`);
  }
  if (name.startsWith("NEXT_PUBLIC_")) {
    keys.push(name.replace(/^NEXT_PUBLIC_/, "PUBLIC_"));
  }
  return [...new Set(keys)];
}

export function wpEnvString(name: string): string | undefined {
  for (const key of envKeys(name)) {
    const value =
      typeof process !== "undefined" ? process.env[key]?.trim() : undefined;
    if (value) return value;
  }
  return undefined;
}

export function wpEnvNumber(name: string): number | undefined {
  const s = wpEnvString(name);
  if (s === undefined) return undefined;
  const n = parseInt(s, 10);
  return Number.isNaN(n) ? undefined : n;
}
