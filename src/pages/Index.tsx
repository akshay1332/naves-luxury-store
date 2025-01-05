import HeroSection from "@/components/home/HeroSection";
import NewArrivalsSection from "@/components/home/NewArrivalsSection";
import TrendingSection from "@/components/home/TrendingSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedSection from "@/components/home/FeaturedSection";
import StyleGuideSection from "@/components/home/StyleGuideSection";
import SizeGuideSection from "@/components/home/SizeGuideSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import RecentlyViewedSection from "@/components/home/RecentlyViewedSection";
import ReviewsSection from "@/components/home/ReviewsSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <NewArrivalsSection />
      <TrendingSection />
      <CategoriesSection />
      <FeaturedSection />
      <StyleGuideSection />
      <SizeGuideSection />
      <NewsletterSection />
      <RecentlyViewedSection />
      <ReviewsSection />
    </div>
  );
};

export default Index;