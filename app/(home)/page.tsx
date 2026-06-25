import { HeroSection } from "@/components/templates/home/hero-section";
import { ProblemSection } from "@/components/templates/home/problem-section";
import { SolutionsSection } from "@/components/templates/home/solutions-section";
import { StepsSection } from "@/components/templates/home/steps-section";
import { ArticlesSection } from "@/components/templates/home/articles-section";
import { FaqSection } from "@/components/templates/home/faq-section";
import { PricingSection } from "@/components/templates/home/pricing-section";
import { TestimonialsSection } from "@/components/templates/home/testimonials-section";
import { TrustedBySection } from "@/components/templates/home/trusted-by-section";

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
