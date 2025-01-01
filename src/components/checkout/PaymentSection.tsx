import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

interface PaymentSectionProps {
  loading: boolean;
}

export const PaymentSection = ({ loading }: PaymentSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">
          Payment will be handled on the next step
        </p>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Processing..." : "Place Order"}
        </Button>
      </CardFooter>
    </Card>
  );
};