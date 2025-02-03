import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const ProductReviews: React.FC<{ productId: string }> = ({ productId }) => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ comment: '', rating: 0 });

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch reviews',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('reviews')
        .insert([{ ...newReview, product_id: productId }]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Review submitted successfully',
      });
      setNewReview({ comment: '', rating: 0 });
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to submit review',
      });
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Product Reviews</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b py-4">
                <p className="font-semibold">{review.user_id}</p>
                <p>{review.comment}</p>
                <p className="text-sm text-gray-500">Rating: {review.rating}</p>
              </div>
            ))
          )}
        </div>
      )}
      <form onSubmit={handleSubmit} className="mt-6">
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Write your review..."
          value={newReview.comment}
          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
          required
        />
        <div className="flex items-center mt-2">
          <label className="mr-2">Rating:</label>
          <select
            className="border rounded p-1"
            value={newReview.rating}
            onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
            required
          >
            <option value={0}>Select rating</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">
          Submit Review
        </button>
      </form>
    </div>
  );
};
