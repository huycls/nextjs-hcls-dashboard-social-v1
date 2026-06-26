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
          <div className="-mx-6 mt-14 sm:mx-0">
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-1 scrollbar-none sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:snap-none sm:px-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
              {latestArticles.map((article) => (
                <div
                  key={article.slug}
                  className="w-[min(88vw,340px)] shrink-0 snap-center sm:w-auto sm:shrink">
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
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
