import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";

interface CouponSectionProps {
  subtotal: number;
  onCouponApplied: (discountAmount: number, couponId: string) => void;
}

export const CouponSection = ({ subtotal, onCouponApplied }: CouponSectionProps) => {
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validateCoupon = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('validate_coupon', {
          p_coupon_code: couponCode,
          p_total_amount: subtotal,
          p_product_ids: []
        });

      if (error) throw error;

      const [result] = data;
      
      if (!result.valid) {
        toast({
          variant: "destructive",
          title: "Invalid Coupon",
          description: result.message,
        });
        return;
      }

      // Get coupon ID
      const { data: couponData } = await supabase
        .from('coupons')
        .select('id')
        .eq('code', couponCode)
        .single();

      if (couponData) {
        onCouponApplied(result.discount_amount, couponData.id);
        toast({
          title: "Success",
          description: result.message,
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to validate coupon",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="w-5 h-5" />
          Apply Coupon
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <Button 
            onClick={validateCoupon} 
            disabled={loading || !couponCode}
          >
            {loading ? "Validating..." : "Apply"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};