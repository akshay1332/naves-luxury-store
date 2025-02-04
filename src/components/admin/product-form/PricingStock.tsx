import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface PricingStockProps {
  initialData?: {
    price: number;
    stock_quantity: number;
    allows_custom_printing: boolean;
    custom_printing_price: number;
  };
  form: any;
}

export const PricingStock = ({ initialData, form }: PricingStockProps) => {
  return (
    <Card className="p-6 space-y-6 border-black">
      <h3 className="text-lg font-semibold text-black">Pricing & Stock</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price" className="text-black">Base Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            {...form.register("price", {
              required: "Price is required",
              min: { value: 0, message: "Price must be positive" }
            })}
            className="border-black text-black"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock_quantity" className="text-black">Stock Quantity</Label>
          <Input
            id="stock_quantity"
            type="number"
            {...form.register("stock_quantity", {
              required: "Stock quantity is required",
              min: { value: 0, message: "Stock must be positive" }
            })}
            className="border-black text-black"
          />
        </div>
      </div>

      {/* Custom Printing Section */}
      <div className="space-y-4 border border-black rounded-lg p-4 mt-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="allows_custom_printing"
            checked={form.watch("allows_custom_printing")}
            onCheckedChange={(checked) => {
              form.setValue("allows_custom_printing", checked);
              if (!checked) {
                form.setValue("custom_printing_price", 0);
              }
            }}
            className="border-black data-[state=checked]:bg-black data-[state=checked]:text-white"
          />
          <Label htmlFor="allows_custom_printing" className="text-black font-medium">
            Allow Custom Printing
          </Label>
        </div>

        {form.watch("allows_custom_printing") && (
          <div className="space-y-2">
            <Label htmlFor="custom_printing_price" className="text-black">
              Custom Printing Price
            </Label>
            <Input
              id="custom_printing_price"
              type="number"
              step="0.01"
              placeholder="Enter custom printing price"
              {...form.register("custom_printing_price", {
                setValueAs: (v) => (v === "" ? 0 : parseFloat(v)),
                min: { value: 0, message: "Price must be positive" }
              })}
              className="border-black text-black"
            />
            <p className="text-sm text-gray-600">
              This amount will be added to the base price when customer selects custom printing
            </p>
          </div>
        )}
      </div>

      {/* Sale Section */}
      <div className="space-y-2">
        <Label htmlFor="sale_percentage" className="text-black">Sale Percentage (Optional)</Label>
        <Input
          id="sale_percentage"
          type="number"
          min="0"
          max="100"
          {...form.register("sale_percentage", {
            min: { value: 0, message: "Sale percentage must be between 0 and 100" },
            max: { value: 100, message: "Sale percentage must be between 0 and 100" }
          })}
          className="border-black text-black"
        />
      </div>
    </Card>
  );
};