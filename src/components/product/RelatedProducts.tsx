import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { motion } from "framer-motion";

interface RelatedProductsProps {
  currentProductId: string;
  category?: string;
}

export const RelatedProducts = ({ currentProductId, category }: RelatedProductsProps) => {
  const { data: relatedProducts } = useQuery({
    queryKey: ["related-products", currentProductId, category],
    queryFn: async () => {
      const query = supabase
        .from("products")
        .select("*")
        .neq("id", currentProductId)
        .limit(4);

      if (category) {
        query.eq("category", category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  if (!relatedProducts?.length) return null;

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-serif font-bold mb-8">You May Also Like</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
