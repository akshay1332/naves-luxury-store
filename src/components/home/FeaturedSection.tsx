import React from "react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { TestimonialsSection } from "@/components/blocks/testimonials-with-marquee";
import { useToast } from "@/hooks/use-toast";

export function FeaturedSection() {
  const { toast } = useToast();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_featured", true)
        .limit(8);

      if (error) {
        console.error("Error fetching featured products:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load featured products",
        });
        throw error;
      }

      return data;
    },
  });

  const { data: testimonials, isError: testimonialsError, isLoading: testimonialsLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*, profiles(full_name, avatar_url)")
        .eq("is_featured", true)
        .limit(6);
      
      if (error) {
        console.error("Testimonials fetch error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load testimonials",
        });
        throw error;
      }
      return data;
    },
    retry: 2,
  });

  const formattedTestimonials = testimonials?.map(testimonial => ({
    author: {
      name: testimonial.profiles?.full_name || "Anonymous",
      handle: "@customer",
      avatar: testimonial.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.id}`
    },
    text: testimonial.content
  })) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load featured products</p>
      </div>
    );
  }

  if (!products?.length) {
    return null;
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Collection</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium pieces that define modern luxury
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Featured
          </Button>
        </div>

        {!testimonialsError && testimonials?.length > 0 && (
          <TestimonialsSection
            title="What Our Customers Say"
            description="Join our community of satisfied customers who trust in our quality and service"
            testimonials={formattedTestimonials}
            className="mt-20"
          />
        )}
      </div>
    </section>
  );
}