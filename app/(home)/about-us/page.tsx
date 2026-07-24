import type { Metadata } from "next";
import { AboutUsContent } from "@/components/organisms/AboutusContent";

export const metadata: Metadata = {
  title: "Giới thiệu — Avispark",
  description:
    "Tìm hiểu sứ mệnh của Avispark: đưa tự động hóa workflow đến gần hơn, mạnh mẽ và đáng tin cậy cho mọi đội ngũ.",
};

export default function AboutUsPage() {
  return <AboutUsContent />;
}
