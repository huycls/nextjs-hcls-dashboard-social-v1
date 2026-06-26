import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import type { Article, ArticlesPageResult } from "./articles";

export const ARTICLES_SNAPSHOT_PATH = join(
  process.cwd(),
  "common/data/articles.json",
);

export type ArticlesSnapshotFile = {
  generatedAt: string | null;
  articles: Article[];
};

export function readArticlesSnapshot(): Article[] {
  try {
    if (!existsSync(ARTICLES_SNAPSHOT_PATH)) {
      return [];
    }

    const raw = readFileSync(ARTICLES_SNAPSHOT_PATH, "utf-8");
    const parsed = JSON.parse(raw) as ArticlesSnapshotFile;

    if (!Array.isArray(parsed?.articles)) {
      return [];
    }

    return parsed.articles;
  } catch (error) {
    console.error("[lib/wp] Failed to read articles.json snapshot:", error);
    return [];
  }
}

export function writeArticlesSnapshot(articles: Article[]): void {
  const payload: ArticlesSnapshotFile = {
    generatedAt: new Date().toISOString(),
    articles,
  };

  mkdirSync(join(process.cwd(), "common/data"), { recursive: true });
  writeFileSync(ARTICLES_SNAPSHOT_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
}

export function getArticleFromSnapshot(slug: string): Article | null {
  return readArticlesSnapshot().find((article) => article.slug === slug) ?? null;
}

export function getSnapshotArticleSlugs(): string[] {
  return readArticlesSnapshot().map((article) => article.slug);
}

export function getSnapshotLatestArticles(limit = 3): Article[] {
  return getArticlesPageFromSnapshot(readArticlesSnapshot(), {
    perPage: limit,
    categorySlug: "all",
  }).articles;
}

export function getSnapshotArticlesPageForNumber(
  page: number,
  categorySlug = "all",
  perPage = 12,
): ArticlesPageResult {
  const safePage = Math.max(1, Math.floor(page) || 1);
  const offset = (safePage - 1) * perPage;

  return getArticlesPageFromSnapshot(readArticlesSnapshot(), {
    categorySlug,
    perPage,
    offset,
    cursor: null,
  });
}

export function getSnapshotRelatedArticles(
  options: {
    slug?: string;
    categorySlug?: string;
    limit?: number;
  } = {},
): Article[] {
  const { slug, categorySlug, limit = 5 } = options;
  const articles = readArticlesSnapshot();

  if (!slug) {
    return getArticlesPageFromSnapshot(articles, {
      perPage: limit,
      categorySlug: "all",
    }).articles;
  }

  const sameCategory = articles.filter(
    (article) =>
      article.slug !== slug &&
      (!categorySlug || article.categorySlug === categorySlug),
  );
  const others = articles.filter(
    (article) =>
      article.slug !== slug &&
      categorySlug &&
      article.categorySlug !== categorySlug,
  );

  return [...sameCategory, ...others].slice(0, limit);
}

export function getArticlesPageFromSnapshot(
  articles: Article[],
  options: {
    categorySlug?: string;
    perPage?: number;
    offset?: number;
    cursor?: string | null;
  },
): ArticlesPageResult {
  const {
    categorySlug = "all",
    perPage = 12,
    offset = 0,
    cursor = null,
  } = options;

  const filtered =
    categorySlug === "all"
      ? articles
      : articles.filter((article) => article.categorySlug === categorySlug);

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const safeOffset = Math.max(0, offset);
  const pageArticles = sorted.slice(safeOffset, safeOffset + perPage);
  const hasNextPage = sorted.length > safeOffset + perPage;

  return {
    articles: pageArticles,
    perPage,
    categorySlug,
    page: Math.floor(safeOffset / perPage) + 1,
    hasNextPage,
    hasPreviousPage: safeOffset > 0,
    cursor,
    nextCursor: hasNextPage
      ? Buffer.from(
          JSON.stringify({
            v: 1,
            offset: safeOffset + perPage,
            cursors: {},
            exhausted: [],
          }),
        ).toString("base64url")
      : null,
  };
}
