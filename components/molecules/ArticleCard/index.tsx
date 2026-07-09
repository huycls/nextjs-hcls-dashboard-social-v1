import Image from "next/image";
import Link from "next/link";
import { Laptop } from "lucide-react";
import type { Article } from "@/lib/wp/articles";
import { buildArticleHref } from "@/lib/wp/article-routes";

function ArticleThumbnail({
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
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-surface-elevated">
        <Image
          src={imageUrl}
          alt={imageAlt ?? title}
          fill
          className="object-cover transition duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-[radial-gradient(circle,var(--border)_1px,transparent_1px)] bg-[length:12px_12px]">
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface shadow-sm">
          <Laptop className="h-5 w-5 text-muted" />
        </div>
        <p className="max-w-[180px] text-center text-xs font-semibold text-heading">
          {title}
        </p>
      </div>
    </div>
  );
}

type ArticleCardProps = {
  article: Article;
};

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="surface-card surface-card-hover group rounded-2xl bg-surface p-4 transition sm:p-5">
      <Link
        href={buildArticleHref(article.slug)}
        className="block">
        <ArticleThumbnail
          title={article.title}
          imageUrl={article.featuredImageUrl}
          imageAlt={article.featuredImageAlt}
        />

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted">
          <span className="rounded-md text-primary bg-primary/10 px-2 py-0.5 font-medium">
            {article.category}
          </span>
          <span>
            {article.date}
            {article.relativeDate ? ` (${article.relativeDate})` : ""}
          </span>
        </div>

        <h3 className="mt-2 text-base font-semibold text-heading transition group-hover:text-primary">
          {article.title}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-foreground">
          {article.excerpt}
        </p>

        <p className="mt-3 text-xs font-medium text-muted">
          {article.readTime}
        </p>
      </Link>
    </article>
  );
}
