import { HeroSection } from "@/components/home/hero-section";
import { ProblemSection } from "@/components/home/problem-section";
import { SolutionsSection } from "@/components/home/solutions-section";
import { StepsSection } from "@/components/home/steps-section";
import { ArticlesSection } from "@/components/home/articles-section";
import { FaqSection } from "@/components/home/faq-section";
import { PricingSection } from "@/components/home/pricing-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { TrustedBySection } from "@/components/home/trusted-by-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustedBySection />
      <ProblemSection />
      <SolutionsSection />
      <StepsSection />
      <TestimonialsSection />
      <PricingSection />
      <FaqSection />
      <ArticlesSection />
    </>
  );
}