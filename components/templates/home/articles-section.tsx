import Link from "next/link";
import { getLatestArticles } from "@/lib/wp/articles";
import { ArticleCard } from "@/components/templates/home/article-card";

export async function ArticlesSection() {
  const latestArticles = await getLatestArticles(3);

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Blog
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-heading sm:text-4xl lg:text-5xl">
            Latest Articles
          </h2>
        </div>

        {latestArticles.length > 0 ? (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((article) => (
              <ArticleCard
                key={article.slug}
                article={article}
              />
            ))}
          </div>
        ) : (
          <p className="mt-14 text-center text-sm text-muted">
            Latest posts will appear here once WordPress is connected.
          </p>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/articles"
            className="inline-flex h-11 items-center rounded-xl border border-border bg-surface px-6 text-sm font-medium text-heading transition hover:bg-surface-elevated">
            View all articles
          </Link>
        </div>
      </div>
    </section>
  );
}
