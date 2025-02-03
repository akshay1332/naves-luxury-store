import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Rating } from "@/components/ui/rating";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ReviewFormProps {
  productId: string;
  userId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ productId, userId, onSuccess }: ReviewFormProps) {
  const { toast } = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("reviews").insert({
        product_id: productId,
        user_id: userId,
        rating,
        comment,
        created_at: new Date().toISOString()
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Review submitted successfully",
      });

      setRating(5);
      setComment("");
      onSuccess?.();
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
      <div className="space-y-2">
        <label className="text-sm font-medium">Rating</label>
        <Rating value={rating} onChange={setRating} />
      </div>

      <div className="space-y-2">
        <label htmlFor="comment" className="text-sm font-medium">
          Comment
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this product..."
          required
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}