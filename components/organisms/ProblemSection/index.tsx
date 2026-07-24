import type { LucideIcon } from "lucide-react";
import { Brain, Shield, Zap } from "lucide-react";

type ProblemItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const problems: ProblemItem[] = [
  {
    icon: Brain,
    title: "Quá tải dữ liệu",
    description:
      "Doanh nghiệp gặp khó khăn khi xử lý khối lượng dữ liệu phức tạp, bỏ lỡ những insight quý giá có thể thúc đẩy tăng trưởng và đổi mới.",
  },
  {
    icon: Zap,
    title: "Ra quyết định chậm",
    description:
      "Phương pháp xử lý dữ liệu truyền thống quá chậm, khiến doanh nghiệp bị tụt hậu so với thị trường và bỏ lỡ cơ hội quan trọng.",
  },
  {
    icon: Shield,
    title: "Lo ngại bảo mật dữ liệu",
    description:
      "Trước các mối đe dọa mạng ngày càng tăng, doanh nghiệp lo lắng về an toàn thông tin nhạy cảm khi áp dụng công nghệ mới.",
  },
];

export function ProblemSection() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Vấn đề
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-heading sm:text-4xl lg:text-5xl">
            Nhập liệu thủ công là một gánh nặng.
          </h2>
        </div>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {problems.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="text-center lg:text-left">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-primary/10 lg:mx-0">
                <Icon
                  className="h-5 w-5 text-primary"
                  strokeWidth={1.75}
                />
              </div>
              <h3 className="text-lg font-semibold text-heading">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
