import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { NewArrivalsSection } from "@/components/home/NewArrivalsSection";
import { TrendingSection } from "@/components/home/TrendingSection";
import { BestSellersSection } from "@/components/home/BestSellersSection";
import { RecentlyViewedSection } from "@/components/home/RecentlyViewedSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";

export function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturedSection />
      <NewArrivalsSection />
      <TrendingSection />
      <BestSellersSection />
      <ReviewsSection />
      <RecentlyViewedSection />
    </main>
  );
}

export default HomePage;