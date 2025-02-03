import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Rating } from "@/components/ui/rating";

export function ReviewForm({ productId }: { productId: string }) {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("reviews").insert({
        product_id: productId,
        user_id: user.id,
        rating,
        comment,
        created_at: new Date().toISOString()
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Review submitted successfully",
      });

      setRating(0);
      setComment("");
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
        <label className="block text-sm font-medium mb-2">Rating</label>
        <Rating value={rating} onChange={setRating} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Comment</label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this product..."
          required
        />
      </div>

      <Button type="submit" disabled={loading || rating === 0}>
        {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}