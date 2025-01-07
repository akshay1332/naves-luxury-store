import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Percent, Tag, Calendar, DollarSign, ShoppingBag, Hash } from "lucide-react";
import { motion } from "framer-motion";

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
    <Card className="p-8 bg-white shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2"
          >
            <Label htmlFor="code" className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-luxury-gold" />
              Coupon Code
            </Label>
            <Input
              id="code"
              name="code"
              defaultValue={initialData?.code}
              className="border-luxury-gold/20 focus:border-luxury-gold focus:ring-luxury-gold"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2"
          >
            <Label htmlFor="discount_percentage" className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-luxury-gold" />
              Discount Percentage
            </Label>
            <Input
              id="discount_percentage"
              name="discount_percentage"
              type="number"
              min="0"
              max="100"
              defaultValue={initialData?.discount_percentage}
              className="border-luxury-gold/20 focus:border-luxury-gold focus:ring-luxury-gold"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <Label htmlFor="valid_from" className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-luxury-gold" />
              Valid From
            </Label>
            <Input
              id="valid_from"
              name="valid_from"
              type="datetime-local"
              defaultValue={initialData?.valid_from}
              className="border-luxury-gold/20 focus:border-luxury-gold focus:ring-luxury-gold"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <Label htmlFor="valid_until" className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-luxury-gold" />
              Valid Until
            </Label>
            <Input
              id="valid_until"
              name="valid_until"
              type="datetime-local"
              defaultValue={initialData?.valid_until}
              className="border-luxury-gold/20 focus:border-luxury-gold focus:ring-luxury-gold"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <Label htmlFor="min_purchase_amount" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-luxury-gold" />
              Minimum Purchase Amount
            </Label>
            <Input
              id="min_purchase_amount"
              name="min_purchase_amount"
              type="number"
              min="0"
              step="0.01"
              defaultValue={initialData?.min_purchase_amount}
              className="border-luxury-gold/20 focus:border-luxury-gold focus:ring-luxury-gold"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <Label htmlFor="max_discount_amount" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-luxury-gold" />
              Maximum Discount Amount
            </Label>
            <Input
              id="max_discount_amount"
              name="max_discount_amount"
              type="number"
              min="0"
              step="0.01"
              defaultValue={initialData?.max_discount_amount}
              className="border-luxury-gold/20 focus:border-luxury-gold focus:ring-luxury-gold"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <Label htmlFor="usage_limit" className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-luxury-gold" />
              Usage Limit
            </Label>
            <Input
              id="usage_limit"
              name="usage_limit"
              type="number"
              min="0"
              defaultValue={initialData?.usage_limit}
              className="border-luxury-gold/20 focus:border-luxury-gold focus:ring-luxury-gold"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <Label htmlFor="category" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-luxury-gold" />
              Category (Optional)
            </Label>
            <Input
              id="category"
              name="category"
              defaultValue={initialData?.category}
              className="border-luxury-gold/20 focus:border-luxury-gold focus:ring-luxury-gold"
            />
          </motion.div>
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