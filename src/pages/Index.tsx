import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const PRODUCT_CATEGORIES = [
  "Dresses",
  "Tops",
  "Bottoms",
  "Outerwear",
  "Accessories",
  "Footwear",
  "Other"
];

const Index = () => {
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

  const { data: bestSellers } = useQuery({
    queryKey: ["best-sellers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_best_seller", true)
        .limit(4);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: reviews } = useQuery({
    queryKey: ["featured-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .limit(3)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="relative h-full w-full">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070"
              alt="Luxury Fashion"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-serif font-light mb-6"
          >
            Zariya
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 font-light"
          >
            For every chapter of your journey
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              to="/products"
              className="inline-block bg-luxury-gold hover:bg-luxury-gold/90 text-white px-8 py-3 rounded-md transition-colors"
            >
              Explore Collection
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Best Sellers Section */}
      {bestSellers && bestSellers.length > 0 && (
        <section className="py-20 px-4 bg-luxury-pearl">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif mb-4">Best Sellers</h2>
              <p className="text-gray-600">Our most loved pieces</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link
                to="/products"
                className="inline-flex items-center text-luxury-gold hover:text-luxury-gold/80 transition-colors"
              >
                View All Best Sellers
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Shop by Category</h2>
            <p className="text-gray-600">Find your perfect style</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {PRODUCT_CATEGORIES.map((category) => (
              <Link
                key={category}
                to={`/products?category=${category}`}
                className="group relative h-48 overflow-hidden rounded-lg"
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xl font-serif">{category}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif mb-4">Featured Collection</h2>
              <p className="text-gray-600">Curated pieces that define elegance</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Client Reviews Section */}
      {reviews && reviews.length > 0 && (
        <section className="bg-luxury-pearl py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif mb-4">Client Stories</h2>
              <p className="text-gray-600">Experiences shared by our valued customers</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-lg shadow-sm"
                >
                  <div className="flex items-center space-x-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">{review.comment}</p>
                  <p className="font-medium text-gray-900">
                    {review.profiles?.full_name || "Anonymous"}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;