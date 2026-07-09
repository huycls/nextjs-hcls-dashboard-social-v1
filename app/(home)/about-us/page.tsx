import type { Metadata } from "next";
import { AboutUsContent } from "@/components/organisms/AboutusContent";

export const metadata: Metadata = {
  title: "About Us — Avispark",
  description:
    "Learn about Avispark's mission to make workflow automation accessible, powerful, and trustworthy for every team.",
};

export default function AboutUsPage() {
  return <AboutUsContent />;
}
