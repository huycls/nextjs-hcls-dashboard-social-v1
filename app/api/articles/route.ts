import { NextResponse } from "next/server";
import {
  parseArticlesCategoryParam,
  parseArticlesPageParam,
} from "@/lib/wp/article-routes";
import {
  ARTICLES_PER_PAGE,
  getArticlesPage,
  getArticlesPageForNumber,
} from "@/lib/wp/articles";

export const revalidate = 300;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = parseArticlesCategoryParam(
    searchParams.get("category") ?? undefined,
  );
  const page = parseArticlesPageParam(searchParams.get("page") ?? undefined);
  const cursor = searchParams.get("cursor");
  const perPage = Number(searchParams.get("perPage") ?? ARTICLES_PER_PAGE);

  try {
    const result = cursor
      ? await getArticlesPage({
          categorySlug: category,
          perPage:
            Number.isFinite(perPage) && perPage > 0 ? perPage : ARTICLES_PER_PAGE,
          cursor,
        })
      : await getArticlesPageForNumber(page, category, perPage);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/articles] failed:", error);
    return NextResponse.json(
      { error: "Failed to load articles." },
      { status: 500 },
    );
  }
}
