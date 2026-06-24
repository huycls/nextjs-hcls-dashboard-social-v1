import Link from "next/link";
import type { ArticleCategory, ArticlesPageResult } from "@/lib/wp/articles";
import { buildArticlesHref } from "@/lib/wp/article-routes";
import { ArticleCard } from "@/components/home/article-card";
import { ArticlesPagination } from "@/components/home/articles-pagination";

type ArticlesArchiveProps = {
  pageData: ArticlesPageResult;
  categories: ArticleCategory[];
};

export function ArticlesArchive({ pageData, categories }: ArticlesArchiveProps) {
  const { articles, categorySlug, page, hasNextPage, hasPreviousPage } =
    pageData;

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        <Link
          href={buildArticlesHref({ category: "all" })}
          prefetch
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            categorySlug === "all"
              ? "bg-primary text-background"
              : "border border-border bg-surface text-foreground hover:bg-surface-elevated"
          }`}
        >
          All
        </Link>
        {categories.map(({ slug, label }) => (
          <Link
            key={slug}
            href={buildArticlesHref({ category: slug })}
            prefetch
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              categorySlug === slug
                ? "bg-primary text-background"
                : "border border-border bg-surface text-foreground hover:bg-surface-elevated"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>

      {articles.length === 0 && (
        <p className="mt-12 text-center text-sm text-muted">
          No articles in this category yet.
        </p>
      )}

      {(hasPreviousPage || hasNextPage || page > 1) && (
        <ArticlesPagination
          categorySlug={categorySlug}
          page={page}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
        />
      )}
    </div>
  );
}
