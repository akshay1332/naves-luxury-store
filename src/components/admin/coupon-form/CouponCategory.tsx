import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

interface CouponCategoryProps {
  defaultCategory?: string;
}

export const CouponCategory = ({ defaultCategory }: CouponCategoryProps) => {
  return (
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
        defaultValue={defaultCategory}
        className="border-luxury-gold/20 focus:border-luxury-gold focus:ring-luxury-gold"
      />
    </motion.div>
  );
};