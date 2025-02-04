import React from 'react';
import { SEO } from "@/components/SEO";
import Hero from '@/components/Hero';
import { BestSellersSection } from '@/components/home/BestSellersSection';
import { NewArrivalsSection } from '@/components/home/NewArrivalsSection';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { TrendingSection } from '@/components/home/TrendingSection';
import { ReviewsSection } from '@/components/home/ReviewsSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import SizeGuideSection from '@/components/home/SizeGuideSection';
import StyleGuideSection from '@/components/home/StyleGuideSection';
import { RecentlyViewedSection } from '@/components/home/RecentlyViewedSection';

export default function Index() {
  return (
    <>
      <SEO 
        title="CustomPrint - Premium Fashion & Accessories"
        description="Discover luxury fashion, accessories, and custom designs at CustomPrint. Shop our curated collection of premium clothing and accessories."
      />
      <main className="min-h-screen">

        <Hero />
        
        <div className="container mx-auto px-4 space-y-24 py-16">
          <NewArrivalsSection />
          <BestSellersSection />
          <FeaturedSection />
          <TrendingSection />
          <ReviewsSection />
          <RecentlyViewedSection />
          <div className="space-y-16">
            <SizeGuideSection />
            <StyleGuideSection />
          </div>
          <NewsletterSection />
        </div>
      </main>
    </>
  );
}