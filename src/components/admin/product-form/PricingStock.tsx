import { Input } from "@/components/ui/input";

interface PricingStockProps {
  initialData?: {
    price: number;
    stock_quantity: number;
  };
}

export const PricingStock = ({ initialData }: PricingStockProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Price</label>
        <Input
          name="price"
          type="number"
          step="0.01"
          defaultValue={initialData?.price}
          required
          className="luxury-input"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Stock Quantity</label>
        <Input
          name="stock_quantity"
          type="number"
          defaultValue={initialData?.stock_quantity}
          required
          className="luxury-input"
        />
      </div>
    </div>
  );
};