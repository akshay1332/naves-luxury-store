import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { TestimonialsSection } from "@/components/blocks/testimonials-with-marquee";
import ProductCard from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";

const FeaturedSection = () => {
  const { toast } = useToast();

  const { data: featuredProducts, isError: productsError, isLoading: productsLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_featured", true)
        .limit(6);
      
      if (error) {
        console.error("Products fetch error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load featured products",
        });
        throw error;
      }
      return data;
    },
    retry: 2,
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

  if (productsLoading || testimonialsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-gold"></div>
      </div>
    );
  }

  if (!featuredProducts?.length && !testimonialsError) return null;

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-serif mb-4 text-luxury-gold"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Featured Collection
          </motion.h2>
          <motion.p 
            className="text-gray-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Curated pieces that define elegance
          </motion.p>
        </motion.div>

        {!productsError && featuredProducts && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
          >
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
              />
            ))}
          </motion.div>
        )}

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
};

export default FeaturedSection;