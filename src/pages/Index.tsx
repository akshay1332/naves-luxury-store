import HeroSection from "@/components/home/HeroSection";
import BestSellersSection from "@/components/home/BestSellersSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedSection from "@/components/home/FeaturedSection";
import ReviewsSection from "@/components/home/ReviewsSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <BestSellersSection />
      <CategoriesSection />
      <FeaturedSection />
      <ReviewsSection />
    </div>
  );
};

export default Index;