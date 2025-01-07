import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface CouponValidityPeriodProps {
  defaultValidFrom?: string;
  defaultValidUntil?: string;
}

export const CouponValidityPeriod = ({ defaultValidFrom, defaultValidUntil }: CouponValidityPeriodProps) => {
  return (
    <>
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
          defaultValue={defaultValidFrom}
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
          defaultValue={defaultValidUntil}
          className="border-luxury-gold/20 focus:border-luxury-gold focus:ring-luxury-gold"
        />
      </motion.div>
    </>
  );
};