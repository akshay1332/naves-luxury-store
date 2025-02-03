import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const reviewData = {
        product_id: productId,
        user_id: user.id,
        rating: parseInt(formData.get('rating') as string),
        comment: formData.get('comment') as string,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('reviews')
        .insert([reviewData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Review submitted successfully",
      });
      
      if (onSuccess) onSuccess();
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit review",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
        <input
          type="number"
          id="rating"
          name="rating"
          min="1"
          max="5"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment</label>
        <textarea
          id="comment"
          name="comment"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
        />
      </div>
      <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-md">
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
