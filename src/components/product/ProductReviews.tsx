import React, { useState } from 'react';
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

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
    <div className="mt-8">
      <h2 className="text-3xl font-serif font-bold mb-8">Customer Reviews</h2>
      <div className="space-y-8">
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-lg shadow-sm"
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
            <p className="text-gray-600">{review.comment}</p>
            
            {review.admin_response && (
              <div className="mt-4 pl-4 border-l-4 border-luxury-gold">
                <p className="text-sm font-medium text-gray-900 mb-1">Admin Response:</p>
                <p className="text-gray-600">{review.admin_response}</p>
              </div>
            )}

            {isAdmin && !review.admin_response && (
              <div className="mt-4 space-y-2">
                <Textarea
                  value={responses[review.id] || ''}
                  onChange={(e) => setResponses(prev => ({
                    ...prev,
                    [review.id]: e.target.value
                  }))}
                  placeholder="Write your response..."
                  className="min-h-[100px]"
                />
                <Button
                  onClick={() => handleAdminResponse(review.id)}
                  disabled={loading[review.id] || !responses[review.id]?.trim()}
                  className="bg-luxury-gold hover:bg-luxury-gold/90"
                >
                  {loading[review.id] ? "Sending..." : "Send Response"}
                </Button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductReviews;