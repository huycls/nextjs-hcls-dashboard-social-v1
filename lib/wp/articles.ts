import { WP_CATEGORY_NAV } from "./categoryNav";
import {
  fetchCategoryPosts,
  fetchCategoryPostsPage,
  wpSlugFromUri,
  type WpCategoryPostNode,
} from "./fetchCategoryPosts";
import { fetchPostDetail, type WpPostDetail } from "./fetchPosts";
import { sanitizeWpHtml } from "./sanitizeWpContent";
import {
  ARTICLE_EXCERPT_MAX_LENGTH,
  estimateReadTime,
  formatArticleDate,
  getDateDistance,
  normalizeArticleExcerpt,
  stripHtml,
} from "./utils";

export type ArticleCategory = {
  slug: string;
  label: string;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  relativeDate: string;
  category: string;
  categorySlug: string;
  readTime: string;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  contentHtml?: string;
};

type WpCategories = {
  nodes?: Array<{ name?: string; slug?: string }>;
};

const FETCH_OPTIONS: RequestInit = {
  next: { revalidate: 300 },
};

export const ARTICLES_PER_PAGE = 12;

export type ArticlesPageResult = {
  articles: Article[];
  perPage: number;
  categorySlug: string;
  page: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  cursor: string | null;
  nextCursor: string | null;
};

type ArticlesMergeCursor = {
  v: 1;
  offset: number;
  cursors: Record<string, string | null>;
  exhausted: string[];
};

function sortArticlesByDate(articles: Article[]): Article[] {
  return [...articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

function encodeArticlesCursor(cursor: ArticlesMergeCursor): string {
  return Buffer.from(JSON.stringify(cursor)).toString("base64url");
}

function decodeArticlesCursor(
  cursor: string | null,
): ArticlesMergeCursor | null {
  if (!cursor) return null;

  try {
    const parsed = JSON.parse(
      Buffer.from(cursor, "base64url").toString("utf-8"),
    ) as ArticlesMergeCursor;

    if (parsed?.v !== 1 || typeof parsed.offset !== "number") {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function createInitialMergeCursor(): ArticlesMergeCursor {
  return {
    v: 1,
    offset: 0,
    cursors: Object.fromEntries(
      WP_CATEGORY_NAV.map(({ slug }) => [slug, null]),
    ),
    exhausted: [],
  };
}

function emptyArticlesPageResult(
  categorySlug: string,
  perPage: number,
  cursor: string | null = null,
  page = 1,
): ArticlesPageResult {
  return {
    articles: [],
    perPage,
    categorySlug,
    page,
    hasNextPage: false,
    hasPreviousPage: Boolean(cursor),
    cursor,
    nextCursor: null,
  };
}

async function getSingleCategoryArticlesPage(
  categorySlug: string,
  perPage: number,
  cursor: string | null,
): Promise<ArticlesPageResult> {
  try {
    const { nodes, pageInfo } = await fetchCategoryPostsPage({
      name: categorySlug,
      postPerPage: perPage,
      after: cursor,
      size: "LARGE",
      fetchOptions: FETCH_OPTIONS,
    });

    const articles = nodes
      .map((node) => mapCategoryPostToArticle(node, categorySlug))
      .filter((article): article is Article => Boolean(article));

    return {
      articles,
      perPage,
      categorySlug,
      page: 1,
      hasNextPage: Boolean(pageInfo.hasNextPage),
      hasPreviousPage: Boolean(cursor),
      cursor,
      nextCursor: pageInfo.hasNextPage ? (pageInfo.endCursor ?? null) : null,
    };
  } catch (error) {
    console.error(
      `[lib/wp] getSingleCategoryArticlesPage("${categorySlug}") failed:`,
      error,
    );
    return emptyArticlesPageResult(categorySlug, perPage, cursor);
  }
}

async function getMergedArticlesPage(
  perPage: number,
  cursor: string | null,
): Promise<ArticlesPageResult> {
  const state = decodeArticlesCursor(cursor) ?? createInitialMergeCursor();
  const exhaustedSet = new Set(state.exhausted);

  for (const { slug } of WP_CATEGORY_NAV) {
    if (!(slug in state.cursors)) {
      state.cursors[slug] = null;
    }
  }

  const pool: Article[] = [];
  const seen = new Set<string>();
  const targetCount = state.offset + perPage + 1;

  while (pool.length < targetCount) {
    let fetchedInRound = 0;

    await Promise.all(
      WP_CATEGORY_NAV.map(async ({ slug }) => {
        if (exhaustedSet.has(slug)) return;

        try {
          const { nodes, pageInfo } = await fetchCategoryPostsPage({
            name: slug,
            postPerPage: perPage,
            after: state.cursors[slug],
            size: "LARGE",
            fetchOptions: FETCH_OPTIONS,
          });

          state.cursors[slug] = pageInfo.endCursor ?? null;
          if (!pageInfo.hasNextPage) {
            exhaustedSet.add(slug);
          }

          fetchedInRound += nodes.length;

          for (const node of nodes) {
            const article = mapCategoryPostToArticle(node, slug);
            if (article && !seen.has(article.slug)) {
              seen.add(article.slug);
              pool.push(article);
            }
          }
        } catch (error) {
          console.error(
            `[lib/wp] fetchCategoryPostsPage("${slug}") failed:`,
            error,
          );
          exhaustedSet.add(slug);
        }
      }),
    );

    if (fetchedInRound === 0) break;

    pool.splice(0, pool.length, ...sortArticlesByDate(pool));

    if (
      exhaustedSet.size === WP_CATEGORY_NAV.length &&
      pool.length < targetCount
    ) {
      break;
    }
  }

  const sortedPool = sortArticlesByDate(pool);
  const articles = sortedPool.slice(state.offset, state.offset + perPage);
  const hasNextPage = sortedPool.length > state.offset + perPage;

  const nextCursor = hasNextPage
    ? encodeArticlesCursor({
        v: 1,
        offset: state.offset + perPage,
        cursors: state.cursors,
        exhausted: [...exhaustedSet],
      })
    : null;

  return {
    articles,
    perPage,
    categorySlug: "all",
    page: Math.floor(state.offset / perPage) + 1,
    hasNextPage,
    hasPreviousPage: state.offset > 0,
    cursor,
    nextCursor,
  };
}

export async function getArticlesPageForNumber(
  page: number,
  categorySlug = "all",
  perPage = ARTICLES_PER_PAGE,
): Promise<ArticlesPageResult> {
  const safePage = Math.max(1, Math.floor(page) || 1);
  let cursor: string | null = null;

  for (let current = 1; current < safePage; current++) {
    const step = await getArticlesPage({ categorySlug, perPage, cursor });
    if (!step.nextCursor) {
      return {
        ...step,
        page: current,
        hasPreviousPage: current > 1,
        hasNextPage: false,
      };
    }
    cursor = step.nextCursor;
  }

  const result = await getArticlesPage({ categorySlug, perPage, cursor });
  return {
    ...result,
    page: safePage,
    hasPreviousPage: safePage > 1,
  };
}

export async function getArticlesPage(
  options: {
    categorySlug?: string;
    perPage?: number;
    cursor?: string | null;
  } = {},
): Promise<ArticlesPageResult> {
  const {
    categorySlug = "all",
    perPage = ARTICLES_PER_PAGE,
    cursor = null,
  } = options;

  if (categorySlug !== "all") {
    return getSingleCategoryArticlesPage(categorySlug, perPage, cursor);
  }

  return getMergedArticlesPage(perPage, cursor);
}

export const articleCategories: ArticleCategory[] = WP_CATEGORY_NAV.map(
  ({ slug, label }) => ({ slug, label }),
);

function categoryLabelFromSlug(slug: string): string {
  return WP_CATEGORY_NAV.find((item) => item.slug === slug)?.label ?? slug;
}

function resolveCategory(
  categories: WpCategoryPostNode["categories"] | WpCategories | undefined,
  fallbackSlug: string,
): { name: string; slug: string } {
  const node = categories?.nodes?.[0] as
    | { name?: string; slug?: string }
    | undefined;
  const slug = node?.slug ?? fallbackSlug;
  const matched = WP_CATEGORY_NAV.find((item) => item.slug === slug);

  return {
    name: matched?.label ?? node?.name ?? categoryLabelFromSlug(fallbackSlug),
    slug,
  };
}

function getFeaturedImage(node: WpCategoryPostNode | WpPostDetail) {
  const image = node.featuredImage?.node;
  return {
    url: image?.sourceUrl,
    alt: image?.altText ?? stripHtml(node.title ?? ""),
  };
}

function mapCategoryPostToArticle(
  node: WpCategoryPostNode,
  categorySlug: string,
): Article | null {
  const slug = node.slug?.trim() || wpSlugFromUri(node.uri);
  const title = stripHtml(node.title ?? "");

  if (!slug || !title) return null;

  const category = resolveCategory(node.categories, categorySlug);
  const excerpt = normalizeArticleExcerpt(
    node.excerpt ?? "",
    node.content ?? "",
    ARTICLE_EXCERPT_MAX_LENGTH,
  );
  const featured = getFeaturedImage(node);

  return {
    slug,
    title,
    excerpt,
    date: formatArticleDate(node.date),
    relativeDate: node.date ? getDateDistance(node.date) : "",
    category: category.name,
    categorySlug: category.slug,
    readTime: estimateReadTime(excerpt),
    featuredImageUrl: featured.url,
    featuredImageAlt: featured.alt,
  };
}

function mapDetailToArticle(detail: WpPostDetail): Article | null {
  const slug = detail.slug?.trim() || wpSlugFromUri(detail.uri);
  const title = stripHtml(detail.title ?? "");

  if (!slug || !title) return null;

  const category = resolveCategory(detail.categories, "articles");
  const contentHtml = sanitizeWpHtml(detail.content ?? "");
  const excerpt = normalizeArticleExcerpt(
    detail.excerpt ?? "",
    contentHtml,
    ARTICLE_EXCERPT_MAX_LENGTH,
  );
  const featured = getFeaturedImage(detail);

  return {
    slug,
    title,
    excerpt,
    date: formatArticleDate(detail.date),
    relativeDate: detail.date ? getDateDistance(detail.date) : "",
    category: category.name,
    categorySlug: category.slug,
    readTime: estimateReadTime(contentHtml || excerpt),
    featuredImageUrl: featured.url,
    featuredImageAlt: featured.alt,
    contentHtml,
  };
}

export async function getArticles(): Promise<Article[]> {
  const bySlug = new Map<string, Article>();

  for (const { slug: categorySlug } of WP_CATEGORY_NAV) {
    try {
      const posts = await fetchCategoryPosts({
        name: categorySlug,
        fetchAll: true,
        size: "MEDIUM",
        fetchOptions: FETCH_OPTIONS,
      });

      for (const post of posts) {
        const article = mapCategoryPostToArticle(post, categorySlug);
        if (article && !bySlug.has(article.slug)) {
          bySlug.set(article.slug, article);
        }
      }
    } catch (error) {
      console.error(
        `[lib/wp] fetchCategoryPosts("${categorySlug}") failed:`,
        error,
      );
    }
  }

  return [...bySlug.values()].sort((a, b) => {
    const aTime = new Date(a.date).getTime();
    const bTime = new Date(b.date).getTime();
    return bTime - aTime;
  });
}

export async function getLatestArticles(limit = 3): Promise<Article[]> {
  try {
    const { articles } = await getArticlesPage({
      perPage: limit,
      categorySlug: "all",
    });
    return articles;
  } catch (error) {
    console.error("[lib/wp] getLatestArticles failed:", error);
    return [];
  }
}

export async function getRelatedArticles(
  options: {
    slug?: string;
    categorySlug?: string;
    limit?: number;
  } = {},
): Promise<Article[]> {
  const { slug, categorySlug, limit = 5 } = options;
  const articles = await getArticles();

  if (!slug) {
    const { articles } = await getArticlesPage({
      perPage: limit,
      categorySlug: "all",
    });
    return articles;
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

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const detail = await fetchPostDetail({
      id: slug,
      idType: "SLUG",
      featuredImageSize: "LARGE",
      fetchOptions: FETCH_OPTIONS,
    });

    if (!detail) return null;
    return mapDetailToArticle(detail);
  } catch (error) {
    console.error(`[lib/wp] getArticleBySlug("${slug}") failed:`, error);
    return null;
  }
}

export async function getArticleSlugs(): Promise<string[]> {
  const articles = await getArticles();
  return articles.map((article) => article.slug);
}
