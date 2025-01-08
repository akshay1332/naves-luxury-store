import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tag, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
      const now = new Date().toISOString();
      
      let query = supabase
        .from('coupons')
        .select('id, code, discount_percentage')
        .gte('valid_from', now)
        .is('valid_until', null)
        .or('valid_until.gte.now');

      // Add product-specific filter
      if (productId) {
        query = query.or(`product_id.eq.${productId},product_id.is.null`);
      } else {
        query = query.is('product_id', null);
      }

      // Add usage limit filter as a separate condition
      query = query.or('usage_limit.is.null,times_used.lt.usage_limit');

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

        {availableCoupons.length > 0 && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full flex justify-between items-center">
                Available Coupons
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-2">
              {availableCoupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">{coupon.code}</p>
                    <p className="text-sm text-gray-500">{coupon.discount_percentage}% off</p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => applyCoupon(coupon.code)}
                  >
                    Apply
                  </Button>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
};