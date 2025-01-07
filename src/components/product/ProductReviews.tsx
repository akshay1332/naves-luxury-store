import React, { useState } from 'react';
import { Star, MessageCircle, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  admin_response: string | null;
  profiles: {
    full_name: string;
  };
}

interface ProductReviewsProps {
  reviews: Review[];
  isAdmin?: boolean;
  onReviewsUpdate: () => void;
}

const ProductReviews = ({ reviews, isAdmin = false, onReviewsUpdate }: ProductReviewsProps) => {
  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  const handleAdminResponse = async (reviewId: string) => {
    if (!responses[reviewId]?.trim()) return;
    
    setLoading(prev => ({ ...prev, [reviewId]: true }));
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ admin_response: responses[reviewId] })
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Response added successfully",
      });
      
      onReviewsUpdate();
      setResponses(prev => ({ ...prev, [reviewId]: '' }));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add response",
      });
    } finally {
      setLoading(prev => ({ ...prev, [reviewId]: false }));
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-serif font-bold mb-8 text-center">
        <span className="bg-gradient-to-r from-luxury-gold to-luxury-silver bg-clip-text text-transparent">
          Customer Reviews
        </span>
      </h2>
      <div className="space-y-8">
        <AnimatePresence>
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium text-gray-900">
                  {review.profiles.full_name || "Anonymous"}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-luxury-gold mt-1" />
                <p className="text-gray-600 flex-1">{review.comment}</p>
              </div>
              
              {review.admin_response && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 pl-4 border-l-4 border-luxury-gold bg-luxury-pearl/20 p-4 rounded-r-lg"
                >
                  <p className="text-sm font-medium text-gray-900 mb-1 flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4 text-luxury-gold" />
                    Admin Response:
                  </p>
                  <p className="text-gray-600">{review.admin_response}</p>
                </motion.div>
              )}

              {isAdmin && !review.admin_response && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 space-y-2"
                >
                  <Textarea
                    value={responses[review.id] || ''}
                    onChange={(e) => setResponses(prev => ({
                      ...prev,
                      [review.id]: e.target.value
                    }))}
                    placeholder="Write your response..."
                    className="min-h-[100px] border-luxury-gold/20 focus:border-luxury-gold focus:ring-luxury-gold"
                  />
                  <Button
                    onClick={() => handleAdminResponse(review.id)}
                    disabled={loading[review.id] || !responses[review.id]?.trim()}
                    className="bg-luxury-gold hover:bg-luxury-gold/90 transition-colors"
                  >
                    {loading[review.id] ? "Sending..." : "Send Response"}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductReviews;