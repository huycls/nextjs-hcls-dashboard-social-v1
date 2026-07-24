import Link from "next/link";
import { ArrowRight, Heart, Lightbulb, Shield, Users, Zap } from "lucide-react";
import { MarketingPageHeader } from "@/components/organisms/AboutusContent/marketing-page-header";
import CountUp from "@/components/atoms/CountUp";

const stats = [
  { value: 10, suffix: "K+", label: "Workflow đã tự động hóa" },
  { value: 500, suffix: "+", label: "Đội ngũ trên toàn cầu" },
  { value: 99.9, suffix: "%", label: "Cam kết uptime SLA" },
  { value: 24, suffix: "/7", label: "Hỗ trợ doanh nghiệp" },
];

const values = [
  {
    icon: Zap,
    title: "Triển khai nhanh, vận hành ổn định",
    description:
      "Chúng tôi tin rằng tự động hóa phải giúp đội ngũ làm việc nhanh hơn — không tạo thêm phức tạp. Mọi tính năng đều được kiểm thử độ tin cậy thực tế.",
  },
  {
    icon: Users,
    title: "Dành cho mọi đội ngũ",
    description:
      "Từ founder solo đến vận hành doanh nghiệp, Avispark mở rộng cùng bạn. No-code cho người mới, kiểm soát API đầy đủ cho power user.",
  },
  {
    icon: Shield,
    title: "Bảo mật mặc định",
    description:
      "Dữ liệu và workflow của bạn được bảo vệ bằng mã hóa khi lưu trữ và truyền tải, phân quyền theo vai trò và nhật ký kiểm toán.",
  },
  {
    icon: Lightbulb,
    title: "AI phục vụ công việc của bạn",
    description:
      "Chúng tôi tích hợp các mô hình AI hàng đầu vào node workflow thực tế — phân loại, trích xuất, tóm tắt và nhiều hơn nữa.",
  },
  {
    icon: Heart,
    title: "Lấy khách hàng làm trung tâm",
    description:
      "Lộ trình sản phẩm được định hình bởi phản hồi thực tế. Chúng tôi phát hành cải tiến hàng tuần và lắng nghe mọi cuộc trò chuyện hỗ trợ.",
  },
];

export function AboutUsContent() {
  return (
    <>
      <section className="bg-background py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <MarketingPageHeader
            eyebrow="Giới thiệu"
            title="Giúp đội ngũ tự động hóa những việc quan trọng"
            description="Avispark được thành lập với sứ mệnh đơn giản: làm cho tự động hóa workflow trở nên dễ tiếp cận, mạnh mẽ và đáng tin cậy cho mọi đội ngũ — từ startup đến doanh nghiệp."
          />

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const number = stat.value.toString().split(".")[0];
              const suffix = stat.suffix;
              return (
                <div
                  key={stat.label}
                  className="surface-card rounded-2xl bg-surface p-6 text-center">
                  <div className="text-3xl font-bold tracking-tight text-primary">
                    <CountUp
                      from={0}
                      to={Number(number)}
                    />
                    {suffix}
                  </div>
                  <p className="mt-2 text-sm text-foreground">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-surface-elevated py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Câu chuyện của chúng tôi
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-heading sm:text-4xl">
              Sinh ra từ sự bực bội với công việc thủ công
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground sm:text-lg">
              Các founder đã dành nhiều năm chứng kiến đội ngũ tài năng chìm
              trong công việc lặp lại — sao chép dữ liệu giữa các công cụ, gửi
              cảnh báo thủ công và chờ đội kỹ thuật cho mỗi automation nhỏ.
              Avispark bắt đầu như công cụ nội bộ và phát triển thành nền tảng
              được hàng trăm đội ngũ sử dụng để lấy lại thời gian và tập trung
              vào công việc có tác động cao.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Giá trị cốt lõi
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-heading sm:text-4xl">
              Điều thúc đẩy chúng tôi mỗi ngày
            </h2>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="surface-card rounded-2xl bg-surface p-6 sm:p-8">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-heading">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-elevated py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-semibold text-heading sm:text-4xl">
            Sẵn sàng tự động hóa workflow?
          </h2>
          <p className="mt-4 text-base text-foreground sm:text-lg">
            Tham gia cùng hàng trăm đội ngũ đang dùng Avispark để xây dựng
            automation thông minh và nhanh hơn.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-background transition hover:bg-primary-hover">
              Bắt đầu miễn phí
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-12 items-center rounded-xl border border-border bg-surface px-6 text-sm font-medium text-heading transition hover:bg-surface-elevated">
              Xem bảng giá
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
