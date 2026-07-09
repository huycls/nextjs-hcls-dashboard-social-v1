import { HeroSection } from "@/components/organisms/HeroSectionHome";
import { ProblemSection } from "@/components/organisms/ProblemSection";
import { SolutionsSection } from "@/components/organisms/SolutionSection";
import { StepsSection } from "@/components/organisms/StepSection";
import { ArticlesSection } from "@/components/organisms/ArticleSlide";
import { FaqSection } from "@/components/organisms/FaqSection";
import { PricingSection } from "@/components/organisms/PricingSection";
import { TestimonialsSection } from "@/components/organisms/TestimonialSection";
import { TrustedBySection } from "@/components/organisms/TrustedBySection";

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
