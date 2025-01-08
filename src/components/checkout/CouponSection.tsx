import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag } from "lucide-react";
import { CouponInput } from "./coupon/CouponInput";
import { AvailableCoupons } from "./coupon/AvailableCoupons";

interface CouponSectionProps {
  subtotal: number;
  onCouponApplied: (discountAmount: number, couponId: string) => void;
  productId?: string;
}

interface Coupon {
  id: string;
  code: string;
  discount_percentage: number;
}

export const CouponSection = ({ subtotal, onCouponApplied, productId }: CouponSectionProps) => {
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAvailableCoupons();
  }, [productId]);

  const fetchAvailableCoupons = async () => {
    try {
      let query = supabase
        .from('coupons')
        .select('id, code, discount_percentage')
        .gte('valid_from', new Date().toISOString());

      // Add valid_until condition
      query = query.or('valid_until.is.null,valid_until.gte.now()');

      // Add product_id filter
      if (productId) {
        query = query.or(`product_id.eq.${productId},product_id.is.null`);
      } else {
        query = query.is('product_id', null);
      }

      // Add usage limit condition - fixed syntax
      query = query.or('usage_limit.is.null,and(times_used.lt.usage_limit)');

      const { data: coupons, error } = await query;

      if (error) {
        console.error('Error fetching coupons:', error);
        throw error;
      }

      setAvailableCoupons(coupons || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch available coupons",
      });
    }
  };

  const validateCoupon = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('validate_coupon', {
          p_coupon_code: couponCode,
          p_total_amount: subtotal,
          p_product_ids: productId ? [productId] : []
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

  const applyCoupon = (code: string) => {
    setCouponCode(code);
    validateCoupon();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="w-5 h-5" />
          Apply Coupon
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CouponInput
          couponCode={couponCode}
          onChange={setCouponCode}
          onApply={validateCoupon}
          loading={loading}
        />
        <AvailableCoupons
          coupons={availableCoupons}
          onApply={applyCoupon}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        />
      </CardContent>
    </Card>
  );
};