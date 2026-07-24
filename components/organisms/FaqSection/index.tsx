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
    question: "Avispark là gì?",
    answer:
      "Avispark là nền tảng workflow tự động hóa giúp đội ngũ xây dựng, triển khai và giám sát workflow AI — từ trigger đơn giản đến pipeline nhiều bước phức tạp.",
  },
  {
    question: "Làm thế nào để bắt đầu với Avispark?",
    answer:
      "Tạo tài khoản miễn phí, kết nối tích hợp và dùng trình tạo workflow trực quan để thiết kế automation đầu tiên. Hầu hết đội ngũ triển khai workflow đầu tiên trong vòng một ngày.",
  },
  {
    question: "Avispark hỗ trợ những loại mô hình AI nào?",
    answer:
      "Avispark hỗ trợ các nhà cung cấp LLM phổ biến và endpoint API tùy chỉnh. Bạn có thể tích hợp mô hình cho phân loại, tóm tắt, trích xuất và nhiều hơn nữa trong các node workflow.",
  },
  {
    question: "Avispark có phù hợp với người mới bắt đầu phát triển AI?",
    answer:
      "Có. Canvas kéo-thả không cần code để bắt đầu. Người dùng nâng cao vẫn có thể tùy chỉnh node, webhook và API call khi cần kiểm soát nhiều hơn.",
  },
  {
    question: "Avispark cung cấp loại hỗ trợ nào?",
    answer:
      "Tất cả gói đều có tài liệu và hỗ trợ cộng đồng. Gói Pro và Enterprise bổ sung hỗ trợ ưu tiên và premium 24/7 cùng hỗ trợ onboarding chuyên biệt.",
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
            Câu hỏi thường gặp
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
          Vẫn còn thắc mắc? Gửi email cho chúng tôi tại{" "}
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
