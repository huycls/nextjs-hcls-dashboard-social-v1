import { ArticlesArchive } from "@/components/organisms/ArticleArchive";
import { MarketingPageHeader } from "@/components/organisms/AboutusContent/marketing-page-header";
import { RelatedArticlesSidebar } from "@/components/organisms/RelatedArticleSidebar";
import type {
  Article,
  ArticleCategory,
  ArticlesPageResult,
} from "@/lib/wp/articles";

type ArticlesTemplateProps = {
  pageData: ArticlesPageResult;
  categories: ArticleCategory[];
  sidebarArticles: Article[];
};

export function ArticlesTemplate({
  pageData,
  categories,
  sidebarArticles,
}: ArticlesTemplateProps) {
  return (
    <section className="bg-background py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <MarketingPageHeader
          eyebrow="Blog"
          title="Bài viết"
          description=""
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
          <ArticlesArchive pageData={pageData} categories={categories} />
          <RelatedArticlesSidebar
            articles={sidebarArticles}
            title="Bài viết liên quan"
          />
        </div>
      </div>
    </section>
  );
}
