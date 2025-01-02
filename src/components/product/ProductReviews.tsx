import React from 'react';
import { Star } from "lucide-react";

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
}

const ProductReviews = ({ reviews }: ProductReviewsProps) => {
  return (
    <div className="mt-8">
      <h2 className="text-3xl font-serif font-bold mb-8">Customer Reviews</h2>
      <div className="space-y-8">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm">
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
              <div className="mt-4 pl-4 border-l-4 border-primary">
                <p className="text-sm font-medium text-gray-900 mb-1">Admin Response:</p>
                <p className="text-gray-600">{review.admin_response}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReviews;