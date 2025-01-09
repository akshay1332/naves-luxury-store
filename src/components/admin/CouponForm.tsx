import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CouponBasicDetails } from "./coupon-form/CouponBasicDetails";
import { CouponValidityPeriod } from "./coupon-form/CouponValidityPeriod";
import { CouponLimitations } from "./coupon-form/CouponLimitations";
import { CouponCategory } from "./coupon-form/CouponCategory";

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

      let error;
      
      if (initialData) {
        // Check if we're trying to update to an existing code
        const { data: existingCoupon } = await supabase
          .from('coupons')
          .select('id')
          .eq('code', couponData.code)
          .neq('id', initialData.id)
          .single();

        if (existingCoupon) {
          throw new Error('A coupon with this code already exists.');
        }

        const result = await supabase
          .from('coupons')
          .update(couponData)
          .eq('id', initialData.id);
          
        error = result.error;
      } else {
        // Check if code already exists before inserting
        const { data: existingCoupon } = await supabase
          .from('coupons')
          .select('id')
          .eq('code', couponData.code)
          .single();

        if (existingCoupon) {
          throw new Error('A coupon with this code already exists.');
        }

        const result = await supabase
          .from('coupons')
          .insert(couponData);
          
        error = result.error;
      }

      if (error) {
        // Handle specific Supabase error codes
        if (error.code === '23505') {
          throw new Error('A coupon with this code already exists.');
        }
        throw error;
      }

      toast({
        title: "Success",
        description: `Coupon ${initialData ? 'updated' : 'created'} successfully.`,
      });

      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error saving coupon:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'Failed to save coupon.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-8 bg-white shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CouponBasicDetails 
            defaultCode={initialData?.code}
            defaultDiscount={initialData?.discount_percentage}
          />
          
          <CouponValidityPeriod 
            defaultValidFrom={initialData?.valid_from}
            defaultValidUntil={initialData?.valid_until}
          />
          
          <CouponLimitations 
            defaultMinPurchase={initialData?.min_purchase_amount}
            defaultMaxDiscount={initialData?.max_discount_amount}
            defaultUsageLimit={initialData?.usage_limit}
          />
          
          <CouponCategory 
            defaultCategory={initialData?.category}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            type="submit"
            className="w-full bg-luxury-gold hover:bg-luxury-gold/90 text-white transition-colors"
            disabled={loading}
          >
            {loading ? "Saving..." : initialData ? "Update Coupon" : "Create Coupon"}
          </Button>
        </motion.div>
      </form>
    </Card>
  );
};