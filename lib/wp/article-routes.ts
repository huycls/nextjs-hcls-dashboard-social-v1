import { WP_CATEGORY_NAV } from "./categoryNav";

/** Static app routes — must not be handled as article slugs. */
const RESERVED_ARTICLE_SLUGS = new Set([
  "about-us",
  "pricing",
  "articles",
  "dashboard",
  "login",
  "api",
]);

export function isReservedArticleSlug(slug: string): boolean {
  return RESERVED_ARTICLE_SLUGS.has(slug);
}

export function buildArticleHref(slug: string): string {
  return `/${slug}`;
}

export function parseArticlesPageParam(pageParam?: string): number {
  const parsed = Number(pageParam);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.floor(parsed);
}

export function parseArticlesCategoryParam(categoryParam?: string): string {
  if (!categoryParam?.trim()) return "all";

  const slug = categoryParam.trim();
  if (slug === "all") return "all";

  return WP_CATEGORY_NAV.some((item) => item.slug === slug) ? slug : "all";
}

export function buildArticlesHref(options: {
  category?: string;
  page?: number;
} = {}): string {
  const category = options.category ?? "all";
  const page = options.page ?? 1;
  const params = new URLSearchParams();

  if (category !== "all") {
    params.set("category", category);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  return query ? `/articles?${query}` : "/articles";
}
