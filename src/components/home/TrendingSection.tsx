import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VelocityScroll } from "@/components/ui/scroll-based-velocity";

export function TrendingSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({
    container: containerRef,
    layoutEffect: false
  });

  const x = useTransform(scrollXProgress, [0, 1], ["0%", "-50%"]);

  const { data: products, isLoading, error } = useQuery({
    queryKey: ["trending-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_trending", true)
        .limit(8);

      if (error) {
        console.error("Error fetching trending products:", error);
        throw error;
      }

      return data;
    },
  });

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
        <p className="text-red-500">Failed to load trending products</p>
      </div>
    );
  }

  if (!products?.length) {
    return null;
  }

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 mb-12"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <motion.div
            initial={{ rotate: -20, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="h-8 w-8 text-luxury-gold" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-center bg-clip-text text-transparent bg-gradient-to-r from-luxury-gold to-luxury-silver"
          >
            Trending Now
          </motion.h2>
          <motion.div
            initial={{ rotate: 20, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="h-8 w-8 text-luxury-gold" />
          </motion.div>
        </div>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 text-center text-lg"
        >
          Discover what's hot in fashion
        </motion.p>
      </motion.div>

      <div className="mt-24 mb-24 bg-slate-950 py-20">
        <VelocityScroll
          text="PREMIUM QUALITY • LUXURY DESIGNS • EXCLUSIVE COLLECTION"
          default_velocity={3}
          className="font-bold text-4xl md:text-6xl bg-gradient-to-r from-cyan-500 to-cyan-300 text-transparent bg-clip-text"
        />
      </div>
      
      <div 
        ref={containerRef}
        className="overflow-x-auto hide-scrollbar relative"
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <motion.div 
          className="flex gap-6 px-8 min-w-max pb-8"
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="w-[300px] flex-shrink-0"
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <ProductCard
                product={product}
                className="h-full"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <Link
          to="/products?category=trending"
          className="inline-flex items-center px-6 py-3 rounded-full bg-luxury-gold text-white hover:bg-luxury-gold/90 transition-all transform hover:scale-105"
        >
          View All Trending Items
          <ChevronRight className="ml-2 h-4 w-4" />
        </Link>
      </motion.div>

      {/* Gradient overlays for smooth scroll edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none" />
    </section>
  );
}