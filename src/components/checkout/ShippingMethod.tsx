import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";

export const ShippingMethod = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="w-5 h-5" />
          Shipping Method
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Standard Shipping</p>
              <p className="text-sm text-gray-500">3-5 business days</p>
            </div>
            <p className="font-medium">Free</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};