import type { Metadata } from "next";
import { ArticlesArchive } from "@/components/templates/home/articles-archive";
import { MarketingPageHeader } from "@/components/templates/home/marketing-page-header";
import { RelatedArticlesSidebar } from "@/components/templates/home/related-articles-sidebar";
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
    <section className="bg-background py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <MarketingPageHeader
          eyebrow="Blog"
          title="Article archives"
          description="Posts synced from WordPress via WPGraphQL."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
          <ArticlesArchive
            pageData={pageData}
            categories={articleCategories}
          />
          <RelatedArticlesSidebar
            articles={sidebarArticles}
            title="Related articles"
          />
        </div>
      </div>
    </section>
  );
}
