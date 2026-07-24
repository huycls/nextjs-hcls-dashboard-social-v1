import Image from "next/image";
import Link from "next/link";
import { FileText } from "lucide-react";
import type { Article } from "@/lib/wp/articles";
import { buildArticleHref } from "@/lib/wp/article-routes";

type RelatedArticlesSidebarProps = {
  articles: Article[];
  title?: string;
  currentSlug?: string;
};

function RelatedArticleThumb({
  title,
  imageUrl,
  imageAlt,
}: {
  title: string;
  imageUrl?: string;
  imageAlt?: string;
}) {
  if (imageUrl) {
    return (
      <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-elevated">
        <Image
          src={imageUrl}
          alt={imageAlt ?? title}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>
    );
  }

  return (
    <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-elevated">
      <FileText className="h-5 w-5 text-muted" />
    </div>
  );
}

export function RelatedArticlesSidebar({
  articles,
  title = "Bài viết liên quan",
  currentSlug,
}: RelatedArticlesSidebarProps) {
  const items = currentSlug
    ? articles.filter((article) => article.slug !== currentSlug)
    : articles;

  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="surface-card rounded-2xl bg-surface p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
          {title}
        </h2>

        <ul className="mt-5 space-y-4">
          {items.slice(0, 5).map((article) => (
            <li key={article.slug}>
              <Link
                href={buildArticleHref(article.slug)}
                className="group flex gap-3 transition"
              >
                <RelatedArticleThumb
                  title={article.title}
                  imageUrl={article.featuredImageUrl}
                  imageAlt={article.featuredImageAlt}
                />

                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-semibold text-heading transition group-hover:text-primary">
                    {article.title}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {article.date}
                    {article.relativeDate ? ` · ${article.relativeDate}` : ""}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
