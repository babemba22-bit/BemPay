import LandingHeader from "@/components/landing/header";
import HeroSection from "@/components/landing/hero-section";
import HowItWorksSection from "@/components/landing/how-it-works-section";
import WhyBemPaySection from "@/components/landing/why-bem-pay-section";
import DemoSection from "@/components/landing/demo-section";
import TestimonialsSection from "@/components/landing/testimonials-section";
import FaqSection from "@/components/landing/faq-section";
import FinalCtaSection from "@/components/landing/final-cta-section";
import LandingFooter from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <main className="flex-grow">
        <HeroSection />
        <HowItWorksSection />
        <WhyBemPaySection />
        <DemoSection />
        <TestimonialsSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
