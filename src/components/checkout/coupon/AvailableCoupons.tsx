import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Coupon {
  id: string;
  code: string;
  discount_percentage: number;
}

interface AvailableCouponsProps {
  coupons: Coupon[];
  onApply: (code: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AvailableCoupons = ({ 
  coupons, 
  onApply, 
  isOpen, 
  onOpenChange 
}: AvailableCouponsProps) => {
  if (coupons.length === 0) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full flex justify-between items-center">
          Available Coupons
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-2">
        {coupons.map((coupon) => (
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
              onClick={() => onApply(coupon.code)}
            >
              Apply
            </Button>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};