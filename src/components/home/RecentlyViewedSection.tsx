import React from "react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";

export function RecentlyViewedSection() {
  const { user } = useAuth();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ["recently-viewed", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("recently_viewed")
        .select("product_id, products(*)")
        .eq("user_id", user.id)
        .order("viewed_at", { ascending: false })
        .limit(8);

      if (error) {
        console.error("Error fetching recently viewed products:", error);
        throw error;
      }

      return data?.map((item) => item.products);
    },
    enabled: !!user,
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (!user) return null;

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
        <p className="text-red-500">Failed to load recently viewed products</p>
      </div>
    );
  }

  if (!products?.length) {
    return null;
  }

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Recently Viewed</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Continue exploring the products you've shown interest in
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              className="h-full"
            />
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Recently Viewed
          </Button>
        </div>
      </div>
    </section>
  );
}