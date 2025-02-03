import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { NewArrivalsSection } from "@/components/home/NewArrivalsSection";
import { TrendingSection } from "@/components/home/TrendingSection";
import { BestSellersSection } from "@/components/home/BestSellersSection";
import { RecentlyViewedSection } from "@/components/home/RecentlyViewedSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { SEO } from "@/components/SEO";
import Hero from "@/components/Hero";

export function HomePage() {
  return (
    <>
      <SEO
        title="Custom Print - Premium Custom Clothing"
        description="Discover unique, high-quality custom printed clothing that expresses your style. Shop our collection of t-shirts, hoodies, and more."
      />
      <main className="min-h-screen">
        <Hero />
        <FeaturedSection />
        <ReviewsSection />
      </main>
    </>
  );
}

export default HomePage;