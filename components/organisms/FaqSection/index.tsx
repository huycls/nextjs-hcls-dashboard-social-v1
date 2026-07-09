"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";

type FaqItem = {
  question: string;
  answer: string;
};

const faqs: FaqItem[] = [
  {
    question: "What is Avispark?",
    answer:
      "Avispark is an automation workflow platform that helps teams build, deploy, and monitor AI-driven workflows — from simple triggers to complex multi-step pipelines.",
  },
  {
    question: "How can I get started with Avispark?",
    answer:
      "Create a free account, connect your integrations, and use the visual workflow builder to design your first automation. Most teams ship their first workflow in under a day.",
  },
  {
    question: "What types of AI models does Avispark support?",
    answer:
      "Avispark supports popular LLM providers and custom API endpoints. You can plug in models for classification, summarization, extraction, and more within your workflow nodes.",
  },
  {
    question: "Is Avispark suitable for beginners in AI development?",
    answer:
      "Yes. The drag-and-drop canvas requires no code to get started. Advanced users can still customize nodes, webhooks, and API calls when they need more control.",
  },
  {
    question: "What kind of support does Avispark provide?",
    answer:
      "All plans include documentation and community support. Pro and Enterprise plans add priority and 24/7 premium support with dedicated onboarding assistance.",
  },
];

function FaqAccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="surface-card overflow-hidden rounded-2xl bg-surface">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full cursor-pointer group items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5">
        <span
          className={cn(
            "text-sm group-hover:text-primary transition-colors duration-300 ease-in-out font-medium sm:text-base",
            isOpen ? "text-primary" : "text-heading",
          )}>
          {item.question}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-foreground transition-transform duration-300 ease-out ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}>
        <div className="overflow-hidden">
          <div className="border-t border-border/30 px-5 pb-5 pt-0 sm:px-6 sm:pb-6">
            <p
              className={`pt-4 text-sm leading-relaxed text-foreground transition-opacity duration-300 ${
                isOpen ? "opacity-100" : "opacity-0"
              }`}>
              {item.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function handleToggle(index: number) {
    setOpenIndex((current) => (current === index ? null : index));
  }

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            FAQ
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-heading sm:text-4xl lg:text-5xl">
            Frequently asked questions
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((item, index) => (
            <FaqAccordionItem
              key={item.question}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-foreground">
          Still have questions? Email us at{" "}
          <a
            href="mailto:support@Avispark.com"
            className="font-medium text-heading underline underline-offset-2">
            support@Avispark.com
          </a>
        </p>
      </div>
    </section>
  );
}
