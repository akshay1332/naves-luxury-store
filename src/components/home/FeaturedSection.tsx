import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ThreeDPhotoCarousel } from "@/components/ui/3d-carousel";
import { TestimonialsSection } from "@/components/blocks/testimonials-with-marquee";

const FeaturedSection = () => {
  const { data: featuredProducts } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_featured", true)
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: testimonials } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*, profiles(full_name, avatar_url)")
        .eq("is_featured", true)
        .limit(6);
      
      if (error) throw error;
      return data;
    },
  });

  const formattedTestimonials = testimonials?.map(testimonial => ({
    author: {
      name: testimonial.profiles?.full_name || "Anonymous",
      handle: "@customer",
      avatar: testimonial.profiles?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + testimonial.id
    },
    text: testimonial.content
  })) || [];

  if (!featuredProducts?.length) return null;

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-serif mb-4 text-secondary"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Featured Collection
          </motion.h2>
          <motion.p 
            className="text-primary-dark"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Curated pieces that define elegance
          </motion.p>
        </motion.div>
        
        <ThreeDPhotoCarousel />

        {testimonials?.length > 0 && (
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