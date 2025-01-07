import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tag, Percent } from "lucide-react";
import { motion } from "framer-motion";

interface CouponBasicDetailsProps {
  defaultCode?: string;
  defaultDiscount?: number;
}

export const CouponBasicDetails = ({ defaultCode, defaultDiscount }: CouponBasicDetailsProps) => {
  return (
    <>
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
          defaultValue={defaultCode}
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
          defaultValue={defaultDiscount}
          className="border-luxury-gold/20 focus:border-luxury-gold focus:ring-luxury-gold"
          required
        />
      </motion.div>
    </>
  );
};