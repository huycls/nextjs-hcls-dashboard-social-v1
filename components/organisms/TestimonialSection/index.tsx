"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Highlighter } from "@/components/atoms/Highlighter";

type QuotePart = {
  text: string;
  emphasis?: "underline" | "highlight";
};

type Testimonial = {
  quote: QuotePart[];
  company: string;
  name: string;
  role: string;
};

const HIGHLIGHT_COLOR = "#cfebfc";
const UNDERLINE_COLOR = "#FF9800";

const testimonials: Testimonial[] = [
  {
    quote: [
      {
        text: "Có rất nhiều điều thú vị đang diễn ra trên bầu trời phía trên khiến ",
      },
      { text: "thiên văn học", emphasis: "underline" },
      {
        text: " trở nên hấp dẫn. Sự thật là vũ trụ là một thứ ",
      },
      { text: "luôn thay đổi", emphasis: "highlight" },
      {
        text: ", chuyển động, có người còn gọi là ",
      },
      { text: "sống", emphasis: "underline" },
      {
        text: " vì bạn không bao giờ biết mình sẽ thấy gì vào bất kỳ đêm quan sát sao nào.",
      },
    ],
    company: "Google",
    name: "Leslie Alexander",
    role: "Thiết kế UI",
  },
  {
    quote: [
      { text: "Avispark " },
      {
        text: "giảm một nửa thời gian workflow thủ công",
        emphasis: "highlight",
      },
      { text: " của chúng tôi. " },
      { text: "Trình tạo trực quan", emphasis: "underline" },
      {
        text: " giúp đội vận hành tự động hóa mà không cần chờ đội kỹ thuật — chúng tôi triển khai automation đầu tiên ",
      },
      { text: "trong vòng một ngày", emphasis: "underline" },
      { text: "." },
    ],
    company: "Spotify",
    name: "Michael Chen",
    role: "Trưởng nhóm Vận hành",
  },
  {
    quote: [
      { text: "Riêng " },
      { text: "insight thực thi", emphasis: "underline" },
      { text: " đã đáng giá. " },
      { text: "Chúng tôi phát hiện lỗi ", emphasis: "highlight" },
      { text: " trước khi chúng ảnh hưởng production" },
      {
        text: " và đội ngũ cuối cùng có ",
      },
      { text: "một nơi duy nhất để giám sát " },
      { text: " mọi tích hợp.", emphasis: "underline" },
    ],
    company: "Microsoft",
    name: "Sarah Williams",
    role: "Quản lý Kỹ thuật",
  },
];

function CompanyLogo({ company }: { company: string }) {
  return (
    <span className="text-2xl font-semibold tracking-tight text-foreground">
      {company}
    </span>
  );
}

function renderQuotePart(part: QuotePart, index: number) {
  if (part.emphasis === "underline") {
    return (
      <Highlighter
        key={index}
        action="underline"
        color={UNDERLINE_COLOR}
        isView>
        {part.text}
      </Highlighter>
    );
  }

  if (part.emphasis === "highlight") {
    return (
      <Highlighter
        key={index}
        action="highlight"
        color={HIGHLIGHT_COLOR}
        isView>
        {part.text}
      </Highlighter>
    );
  }

  return <span key={index}>{part.text}</span>;
}

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = testimonials[activeIndex];

  function goToPrevious() {
    setActiveIndex((index) =>
      index === 0 ? testimonials.length - 1 : index - 1,
    );
  }

  function goToNext() {
    setActiveIndex((index) =>
      index === testimonials.length - 1 ? 0 : index + 1,
    );
  }

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Khách hàng nói gì
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-heading sm:text-4xl lg:text-5xl">
            Phản hồi từ khách hàng
          </h2>
        </div>

        <div className="mt-14 text-center">
          <span
            aria-hidden="true"
            className="text-5xl leading-none text-heading sm:text-6xl">
            &ldquo;
          </span>

          <blockquote
            key={activeIndex}
            className="mx-auto mt-6 min-h-[120px] max-w-2xl">
            <p className="text-base leading-relaxed text-foreground sm:text-lg">
              {current.quote.map(renderQuotePart)}
            </p>
          </blockquote>

          <div className="mt-10 flex flex-col items-center gap-3">
            <CompanyLogo company={current.company} />
            <div>
              <p className="text-base font-semibold text-primary">
                {current.name}
              </p>
              <p className="mt-0.5 text-sm text-foreground">{current.role}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={goToPrevious}
            aria-label="Phản hồi trước"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-foreground transition hover:bg-primary/50 hover:text-heading">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={goToNext}
            aria-label="Phản hồi tiếp theo"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-foreground transition hover:bg-primary/50 hover:text-heading">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
