import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Percent, Calendar, Tag } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";

interface FeaturesProps {
  initialData?: {
    is_featured: boolean;
    is_best_seller: boolean;
    is_new_arrival?: boolean;
    is_trending?: boolean;
    sale_percentage?: number;
    sale_start_date?: string;
    sale_end_date?: string;
  };
}

export const Features = ({ initialData }: FeaturesProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialData?.sale_start_date ? new Date(initialData.sale_start_date) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialData?.sale_end_date ? new Date(initialData.sale_end_date) : undefined
  );
  const [salePercentage, setSalePercentage] = useState<number | undefined>(
    initialData?.sale_percentage
  );

  const generateCouponCode = (title: string, percentage: number) => {
    if (!title || !percentage) return '';
    const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return `${cleanTitle.substring(0, 4)}${percentage}OFF`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_featured"
            name="is_featured"
            defaultChecked={initialData?.is_featured}
          />
          <Label htmlFor="is_featured">Featured Product</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_best_seller"
            name="is_best_seller"
            defaultChecked={initialData?.is_best_seller}
          />
          <Label htmlFor="is_best_seller">Best Seller</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_new_arrival"
            name="is_new_arrival"
            defaultChecked={initialData?.is_new_arrival}
          />
          <Label htmlFor="is_new_arrival">New Arrival</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_trending"
            name="is_trending"
            defaultChecked={initialData?.is_trending}
          />
          <Label htmlFor="is_trending">Trending</Label>
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="text-lg font-medium mb-4">Sale Settings & Coupon</h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sale_percentage">Sale Discount (%)</Label>
            <div className="relative">
              <Percent className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="sale_percentage"
                name="sale_percentage"
                type="number"
                min="0"
                max="100"
                defaultValue={initialData?.sale_percentage}
                className="pl-9"
                placeholder="Enter sale percentage"
                onChange={(e) => setSalePercentage(parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Generated Coupon Code</Label>
            <div className="relative">
              <Tag className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                name="coupon_code"
                readOnly
                className="pl-9 bg-gray-50"
                value={generateCouponCode(
                  document.querySelector<HTMLInputElement>('input[name="title"]')?.value || '',
                  salePercentage
                )}
                placeholder="Coupon code will be generated automatically"
              />
            </div>
            <p className="text-sm text-gray-500">
              This coupon code will be automatically generated and linked to this product
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Sale Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date);
                      const input = document.createElement('input');
                      input.type = 'hidden';
                      input.name = 'sale_start_date';
                      input.value = date ? date.toISOString() : '';
                      document.querySelector('form')?.appendChild(input);
                    }}
                    className="bg-white rounded-md border"
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Sale End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      setEndDate(date);
                      const input = document.createElement('input');
                      input.type = 'hidden';
                      input.name = 'sale_end_date';
                      input.value = date ? date.toISOString() : '';
                      document.querySelector('form')?.appendChild(input);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};