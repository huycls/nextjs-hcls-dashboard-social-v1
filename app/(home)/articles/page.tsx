import type { Metadata } from "next";
import { ArticlesTemplate } from "@/components/templates/articles";
import {
  parseArticlesCategoryParam,
  parseArticlesPageParam,
} from "@/lib/wp/article-routes";
import {
  articleCategories,
  getArticlesPageForNumber,
  getRelatedArticles,
} from "@/lib/wp/articles";

export const metadata: Metadata = {
  title: "Articles — Avispark",
  description: "Latest news and guides from WordPress headless CMS.",
};

export const revalidate = 300;

type ArticlesPageProps = {
  searchParams: Promise<{
    category?: string;
    page?: string;
  }>;
};

export default async function ArticlesPage({
  searchParams,
}: ArticlesPageProps) {
  const params = await searchParams;
  const categorySlug = parseArticlesCategoryParam(params.category);
  const page = parseArticlesPageParam(params.page);

  const [pageData, sidebarArticles] = await Promise.all([
    getArticlesPageForNumber(page, categorySlug),
    getRelatedArticles({ limit: 5 }),
  ]);

  return (
    <ArticlesTemplate
      pageData={pageData}
      categories={articleCategories}
      sidebarArticles={sidebarArticles}
    />
  );
}
