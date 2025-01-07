import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Hash } from "lucide-react";
import { motion } from "framer-motion";

interface CouponLimitationsProps {
  defaultMinPurchase?: number;
  defaultMaxDiscount?: number;
  defaultUsageLimit?: number;
}

export const CouponLimitations = ({ 
  defaultMinPurchase,
  defaultMaxDiscount,
  defaultUsageLimit 
}: CouponLimitationsProps) => {
  return (
    <>
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
          defaultValue={defaultMinPurchase}
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
          defaultValue={defaultMaxDiscount}
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
          defaultValue={defaultUsageLimit}
          className="border-luxury-gold/20 focus:border-luxury-gold focus:ring-luxury-gold"
        />
      </motion.div>
    </>
  );
};