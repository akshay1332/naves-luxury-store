import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard } from "lucide-react";
import { loadRazorpayScript, createRazorpayOrder, initializeRazorpayPayment } from "@/lib/razorpay";
import { useToast } from "@/hooks/use-toast";

interface PaymentSectionProps {
  loading: boolean;
  subtotal: number;
  discountAmount: number;
  total: number;
  onPaymentMethodChange: (method: "cod" | "online") => void;
  onPaymentComplete: (paymentId: string, orderId: string) => void;
  userEmail: string;
  userName: string;
}

export const PaymentSection = ({ 
  loading, 
  subtotal, 
  discountAmount, 
  total,
  onPaymentMethodChange,
  onPaymentComplete,
  userEmail,
  userName
}: PaymentSectionProps) => {
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [processingPayment, setProcessingPayment] = useState(false);
  const { toast } = useToast();

  const handlePaymentMethodChange = (value: "cod" | "online") => {
    setPaymentMethod(value);
    onPaymentMethodChange(value);
  };

  const handlePayment = async () => {
    if (paymentMethod === "online") {
      setProcessingPayment(true);
      try {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          throw new Error("Failed to load Razorpay SDK");
        }

        const { id: razorpayOrderId } = await createRazorpayOrder(total, "ORDER123");

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: total * 100,
          currency: "INR",
          name: "Your Store Name",
          description: "Purchase Payment",
          order_id: razorpayOrderId,
          prefill: {
            name: userName,
            email: userEmail,
          },
          handler: function (response: any) {
            onPaymentComplete(response.razorpay_payment_id, response.razorpay_order_id);
          },
        };

        await initializeRazorpayPayment(options);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Payment Failed",
          description: error.message || "Something went wrong with the payment",
        });
      } finally {
        setProcessingPayment(false);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup 
          value={paymentMethod} 
          onValueChange={handlePaymentMethodChange}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="online" id="online" />
            <Label htmlFor="online">Pay Online (Razorpay)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cod" id="cod" />
            <Label htmlFor="cod">Cash on Delivery (COD)</Label>
          </div>
        </RadioGroup>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-₹{discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold border-t pt-2">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading || processingPayment}
          onClick={handlePayment}
        >
          {processingPayment ? "Processing Payment..." : loading ? "Processing..." : "Place Order"}
        </Button>
      </CardFooter>
    </Card>
  );
};