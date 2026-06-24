import Link from "next/link";
import { Laptop } from "lucide-react";

type Article = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  relativeDate: string;
};

const articles: Article[] = [
  {
    slug: "introducing-flowaxon",
    title: "Introducing Flowaxon",
    excerpt:
      "Introducing Flowaxon, a cutting-edge automation platform for modern businesses.",
    date: "August 29, 2024",
    relativeDate: "1y ago",
  },
  {
    slug: "first-automation-workflow",
    title: "Build your first automation workflow",
    excerpt:
      "A step-by-step guide to designing, testing, and deploying your first workflow in under an hour.",
    date: "June 14, 2024",
    relativeDate: "1y ago",
  },
  {
    slug: "ai-workflow-best-practices",
    title: "5 AI workflow best practices for teams",
    excerpt:
      "Learn how high-performing teams structure triggers, error handling, and monitoring at scale.",
    date: "March 8, 2024",
    relativeDate: "2y ago",
  },
];

function ArticleThumbnail({ title }: { title: string }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-[radial-gradient(circle,var(--border)_1px,transparent_1px)] bg-[length:12px_12px]">
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface shadow-sm">
          <Laptop className="h-5 w-5 text-[#333333]d" />
        </div>
        <p className="max-w-[180px] text-center text-xs font-semibold text-heading">
          {title}
        </p>
        <div className="mt-4 w-full max-w-[200px] overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
          <div className="flex gap-1 border-b border-border px-2 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-border" />
            <span className="h-1.5 w-1.5 rounded-full bg-border" />
            <span className="h-1.5 w-1.5 rounded-full bg-border" />
          </div>
          <div className="space-y-1.5 p-2">
            <div className="h-2 w-full rounded bg-surface-elevated" />
            <div className="h-2 w-4/5 rounded bg-surface-elevated" />
            <div className="h-8 rounded bg-background" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="surface-card surface-card-hover group rounded-2xl bg-surface p-4 transition sm:p-5">
      <Link
        href={`#${article.slug}`}
        className="block">
        <ArticleThumbnail title={article.title} />

        <p className="mt-4 text-xs text-[#333333]d">
          {article.date}{" "}
          <span className="text-[#333333]d/70">({article.relativeDate})</span>
        </p>

        <h3 className="mt-2 text-base font-semibold text-heading transition group-hover:text-primary">
          {article.title}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-foreground">
          {article.excerpt}
        </p>
      </Link>
    </article>
  );
}

export function ArticlesSection() {
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

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard
              key={article.slug}
              article={article}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
