import { NextResponse } from "next/server";
import {
  parseArticlesCategoryParam,
  parseArticlesPageParam,
} from "@/lib/wp/article-routes";
import { ARTICLES_PER_PAGE } from "@/lib/wp/articles";
import {
  getSnapshotArticlesPageForNumber,
} from "@/lib/wp/articles-snapshot";
// import {
//   getArticlesPage,
//   getArticlesPageForNumber,
// } from "@/lib/wp/articles";

export const revalidate = 300;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = parseArticlesCategoryParam(
    searchParams.get("category") ?? undefined,
  );
  const page = parseArticlesPageParam(searchParams.get("page") ?? undefined);
  const perPage = Number(searchParams.get("perPage") ?? ARTICLES_PER_PAGE);

  try {
    // const cursor = searchParams.get("cursor");
    // const result = cursor
    //   ? await getArticlesPage({
    //       categorySlug: category,
    //       perPage:
    //         Number.isFinite(perPage) && perPage > 0 ? perPage : ARTICLES_PER_PAGE,
    //       cursor,
    //     })
    //   : await getArticlesPageForNumber(page, category, perPage);

    const result = getSnapshotArticlesPageForNumber(
      page,
      category,
      Number.isFinite(perPage) && perPage > 0 ? perPage : ARTICLES_PER_PAGE,
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/articles] failed:", error);
    return NextResponse.json(
      { error: "Failed to load articles." },
      { status: 500 },
    );
  }
}
