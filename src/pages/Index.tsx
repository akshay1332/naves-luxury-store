import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { NewArrivalsSection } from "@/components/home/NewArrivalsSection";
import { TrendingSection } from "@/components/home/TrendingSection";
import { BestSellersSection } from "@/components/home/BestSellersSection";
import { RecentlyViewedSection } from "@/components/home/RecentlyViewedSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { SEO } from "@/components/SEO";

export function HomePage() {
  return (
    <>
      <SEO 
        title="Custom Print - Premium Custom Clothing Printing Services in India"
        description="Transform your style with Custom Print's premium clothing printing services. Get custom hoodies, t-shirts, and apparel with high-quality prints, fast delivery, and bulk order options. Best custom clothing printing service in India."
        keywords={[
          'custom print india',
          'custom clothing printing',
          'custom hoodies india',
          'custom t-shirts printing',
          'bulk clothing printing india',
          'premium custom apparel',
          'personalized clothing india',
          'custom printed hoodies',
          'custom printed t-shirts',
          'clothing printing service',
          'custom merchandise india',
          'custom sportswear printing',
          'custom fashion india',
          'print on demand india',
          'custom branded clothing',
          'best clothing printing service',
          'affordable custom prints',
          'quality clothing printing'
        ]}
      />
      <main className="min-h-screen">
        <HeroSection />
        <FeaturedSection />
        <NewArrivalsSection />
        <TrendingSection />
        <BestSellersSection />
        <ReviewsSection />
        <RecentlyViewedSection />
      </main>
    </>
  );
}

export default HomePage;