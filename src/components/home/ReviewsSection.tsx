import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Loader2, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  product_id: string;
  admin_response: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  } | null;
  products: {
    title: string;
    images: string[];
  } | null;
}

export function ReviewsSection() {
  const { data: reviews, isLoading, error } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          profiles (full_name, avatar_url),
          products (title, images)
        `)
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) {
        console.error("Error fetching reviews:", error);
        throw error;
      }

      return data as Review[];
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
        <p className="text-red-500">Failed to load reviews</p>
      </div>
    );
  }

  if (!reviews?.length) {
    return null;
  }

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Customer Reviews</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See what our customers are saying about their experience with us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <Avatar>
                  <AvatarImage
                    src={review.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.id}`}
                    alt={review.profiles?.full_name || "Anonymous"}
                  />
                  <AvatarFallback>
                    {(review.profiles?.full_name || "Anonymous").charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">
                    {review.profiles?.full_name || "Anonymous"}
                  </h3>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{review.comment}</p>
              {review.products && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <img
                    src={review.products.images[0]}
                    alt={review.products.title}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <span>Reviewed {review.products.title}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}