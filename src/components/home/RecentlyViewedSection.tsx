import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import { History } from "lucide-react";

const RecentlyViewedSection = () => {
  const { data: recentlyViewed } = useQuery({
    queryKey: ["recently-viewed"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("recently_viewed")
        .select(`
          product_id,
          products (*)
        `)
        .eq("user_id", user.id)
        .order("viewed_at", { ascending: false })
        .limit(4);
      
      if (error) throw error;
      return data?.map(item => item.products) || [];
    },
  });

  if (!recentlyViewed || recentlyViewed.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <History className="h-12 w-12 mx-auto text-luxury-gold mb-6" />
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Recently Viewed</h2>
          <p className="text-gray-600">Products you've explored</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {recentlyViewed.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewedSection;