import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleHero } from "@/components/home/article-hero";
import { RelatedArticlesSidebar } from "@/components/home/related-articles-sidebar";
import {
  getArticleBySlug,
  getArticleSlugs,
  getRelatedArticles,
} from "@/lib/wp/articles";

type ArticleDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Article not found — Avispark" };
  }

  return {
    title: `${article.title} — Avispark`,
    description: article.excerpt,
  };
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const related = await getRelatedArticles({
    slug,
    categorySlug: article.categorySlug,
    limit: 5,
  });

  return (
    <article className="bg-background">
      <ArticleHero article={article} />

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
            <div className="min-w-0">
              {article.contentHtml ? (
                <div
                  className="wp-content prose prose-neutral max-w-none text-foreground"
                  dangerouslySetInnerHTML={{ __html: article.contentHtml }}
                />
              ) : (
                <p className="text-sm text-muted">No content available.</p>
              )}
            </div>

            <RelatedArticlesSidebar
              articles={related}
              currentSlug={slug}
              title="Related articles"
            />
        </div>
      </div>
    </article>
  );
}
