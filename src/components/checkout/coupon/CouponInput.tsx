import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CouponInputProps {
  couponCode: string;
  onChange: (value: string) => void;
  onApply: () => void;
  loading: boolean;
}

export const CouponInput = ({ 
  couponCode, 
  onChange, 
  onApply, 
  loading 
}: CouponInputProps) => {
  return (
    <div className="flex gap-2">
      <Input
        placeholder="Enter coupon code"
        value={couponCode}
        onChange={(e) => onChange(e.target.value)}
      />
      <Button 
        onClick={onApply} 
        disabled={loading || !couponCode}
      >
        {loading ? "Validating..." : "Apply"}
      </Button>
    </div>
  );
};