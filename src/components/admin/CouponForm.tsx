import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Percent, Tag } from "lucide-react";

interface CouponFormProps {
  onSuccess?: () => void;
  initialData?: {
    id: string;
    code: string;
    discount_percentage: number;
    valid_from: string;
    valid_until: string;
    min_purchase_amount: number;
    max_discount_amount: number;
    usage_limit: number;
    category?: string;
  };
}

export const CouponForm = ({ onSuccess, initialData }: CouponFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const couponData = {
        code: String(formData.get('code')),
        discount_percentage: parseInt(String(formData.get('discount_percentage'))),
        valid_from: String(formData.get('valid_from')),
        valid_until: String(formData.get('valid_until')),
        min_purchase_amount: parseFloat(String(formData.get('min_purchase_amount'))),
        max_discount_amount: parseFloat(String(formData.get('max_discount_amount'))),
        usage_limit: parseInt(String(formData.get('usage_limit'))),
        category: formData.get('category') ? String(formData.get('category')) : null,
      };

      if (initialData) {
        await supabase
          .from('coupons')
          .update(couponData)
          .eq('id', initialData.id);
      } else {
        await supabase
          .from('coupons')
          .insert(couponData);
      }

      toast({
        title: "Success",
        description: `Coupon ${initialData ? 'updated' : 'created'} successfully.`,
      });

      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="code">Coupon Code</Label>
            <div className="relative">
              <Tag className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="code"
                name="code"
                defaultValue={initialData?.code}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount_percentage">Discount Percentage</Label>
            <div className="relative">
              <Percent className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="discount_percentage"
                name="discount_percentage"
                type="number"
                min="0"
                max="100"
                defaultValue={initialData?.discount_percentage}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="valid_from">Valid From</Label>
            <Input
              id="valid_from"
              name="valid_from"
              type="datetime-local"
              defaultValue={initialData?.valid_from}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valid_until">Valid Until</Label>
            <Input
              id="valid_until"
              name="valid_until"
              type="datetime-local"
              defaultValue={initialData?.valid_until}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="min_purchase_amount">Minimum Purchase Amount</Label>
            <Input
              id="min_purchase_amount"
              name="min_purchase_amount"
              type="number"
              min="0"
              step="0.01"
              defaultValue={initialData?.min_purchase_amount}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_discount_amount">Maximum Discount Amount</Label>
            <Input
              id="max_discount_amount"
              name="max_discount_amount"
              type="number"
              min="0"
              step="0.01"
              defaultValue={initialData?.max_discount_amount}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="usage_limit">Usage Limit</Label>
            <Input
              id="usage_limit"
              name="usage_limit"
              type="number"
              min="0"
              defaultValue={initialData?.usage_limit}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category (Optional)</Label>
            <Input
              id="category"
              name="category"
              defaultValue={initialData?.category}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Update Coupon" : "Create Coupon"}
        </Button>
      </form>
    </Card>
  );
};