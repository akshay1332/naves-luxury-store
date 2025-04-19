import PolicyLayout from "@/components/layouts/PolicyLayout";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { Truck, Clock, Globe2, AlertCircle } from "lucide-react";

const ShippingInfo = () => {
  const { theme: currentTheme } = useTheme();

  const shippingMethods = [
    {
      icon: Truck,
      title: "Standard Shipping",
      delivery: "5-7 business days",
      cost: "FREE" // "₹39 or FREE on orders above ₹999"
    },
    {
      icon: Clock,
      title: "Express Delivery",
      delivery: "2-3 business days",
      cost: "₹59"
    },
    {
      icon: Globe2,
      title: "International Shipping",
      delivery: "10-15 business days",
      cost: "Calculated at checkout"
    }
  ];

  return (
    <PolicyLayout
      title="Shipping Information"
      subtitle="Everything you need to know about our shipping process"
    >
      {/* Shipping Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {shippingMethods.map((method, index) => (
          <div
            key={index}
            className={cn(
              "p-6 rounded-lg border",
              currentTheme === 'dark' ? "border-gray-800" : "border-gray-200"
            )}
          >
            <method.icon className="w-8 h-8 text-rose-500 mb-4" />
            <h3 className={cn(
              "text-lg font-semibold mb-2",
              currentTheme === 'dark' ? "text-white" : "text-gray-900"
            )}>
              {method.title}
            </h3>
            <p className={cn(
              "text-sm mb-2",
              currentTheme === 'dark' ? "text-gray-300" : "text-gray-600"
            )}>
              Delivery Time: {method.delivery}
            </p>
            <p className={cn(
              "text-sm font-semibold",
              currentTheme === 'dark' ? "text-gray-200" : "text-gray-700"
            )}>
              Cost: {method.cost}
            </p>
          </div>
        ))}
      </div>

      {/* Shipping Process */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Shipping Process</h2>
        <ol className="space-y-4">
          <li className="flex gap-4">
            <span className={cn(
              "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold",
              "bg-rose-500 text-white"
            )}>
              1
            </span>
            <div>
              <h3 className="font-semibold mb-2">Order Processing</h3>
              <p>Orders are processed within 24 hours of placement. You'll receive a confirmation email once your order is confirmed.</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className={cn(
              "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold",
              "bg-rose-500 text-white"
            )}>
              2
            </span>
            <div>
              <h3 className="font-semibold mb-2">Order Dispatch</h3>
              <p>Once your order is ready, it will be carefully packed and handed over to our shipping partner. You'll receive a tracking number via email.</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className={cn(
              "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold",
              "bg-rose-500 text-white"
            )}>
              3
            </span>
            <div>
              <h3 className="font-semibold mb-2">Delivery</h3>
              <p>Our shipping partner will deliver your order to the provided address. You can track your order status using the tracking number.</p>
            </div>
          </li>
        </ol>
      </div>

      {/* Important Notes */}
      <div className={cn(
        "p-6 rounded-lg",
        currentTheme === 'dark' ? "bg-gray-800/50" : "bg-gray-50"
      )}>
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-rose-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold mb-4">Important Notes</h3>
            <ul className="space-y-2 list-disc pl-4">
              <li>Delivery times may vary during peak seasons and holidays</li>
              <li>We currently ship to all major cities in India</li>
              <li>International shipping is available for select countries</li>
              <li>Orders placed after 2 PM will be processed the next business day</li>
              <li>Shipping charges are calculated based on delivery location and order weight</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="mt-12 text-center">
        <p className="mb-4">For any shipping-related queries, please contact our support team</p>
        <a
          href="mailto:support@customprint.co.in"
          className={cn(
            "inline-flex items-center justify-center px-6 py-3 rounded-lg",
            "font-semibold text-white bg-rose-500 hover:bg-rose-600",
            "transition-colors duration-300"
          )}
        >
          Contact Support
        </a>
      </div>
    </PolicyLayout>
  );
};

export default ShippingInfo; 