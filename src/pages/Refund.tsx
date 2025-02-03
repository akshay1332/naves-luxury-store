import PolicyLayout from "@/components/layouts/PolicyLayout";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { IndianRupee, Clock, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

const Refund = () => {
  const { theme: currentTheme } = useTheme();

  const eligibleItems = [
    {
      icon: CheckCircle2,
      title: "Eligible for Refund",
      items: [
        "Unworn items with original tags attached",
        "Items in original packaging",
        "Defective or damaged products",
        "Wrong items received",
        "Items not matching description"
      ]
    },
    {
      icon: XCircle,
      title: "Not Eligible for Refund",
      items: [
        "Worn, washed, or altered items",
        "Items without original tags",
        "Customized or personalized products",
        "Items marked as 'Final Sale'",
        "Items damaged due to customer misuse"
      ]
    }
  ];

  const refundProcess = [
    {
      title: "Initiate Refund",
      description: "Log in to your account and go to the order history. Select the item you want to return and fill out the refund form."
    },
    {
      title: "Return the Item",
      description: "Pack the item securely with all original tags and packaging. Ship it back using the provided return label or your preferred carrier."
    },
    {
      title: "Quality Check",
      description: "Our team will inspect the returned item to ensure it meets our refund eligibility criteria."
    },
    {
      title: "Refund Processing",
      description: "Once approved, we'll process your refund to the original payment method within 5-7 business days."
    }
  ];

  return (
    <PolicyLayout
      title="Refund Policy"
      subtitle="Our commitment to customer satisfaction"
    >
      {/* Introduction */}
      <div className="mb-12">
        <p className="text-lg mb-6">
          At Custom Print, we want you to be completely satisfied with your purchase. 
          If you're not happy with your order, we offer a straightforward refund process 
          within 30 days of delivery.
        </p>
      </div>

      {/* Refund Eligibility */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {eligibleItems.map((section, index) => (
          <div
            key={index}
            className={cn(
              "p-6 rounded-lg border",
              currentTheme === 'dark' ? "border-gray-800" : "border-gray-200"
            )}
          >
            <div className="flex items-center gap-3 mb-4">
              <section.icon className={cn(
                "w-6 h-6",
                index === 0 ? "text-green-500" : "text-rose-500"
              )} />
              <h3 className="text-lg font-semibold">{section.title}</h3>
            </div>
            <ul className="space-y-2">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Refund Process */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-6 h-6 text-rose-500" />
          <h2 className="text-2xl font-semibold">Refund Process</h2>
        </div>
        <div className="space-y-6">
          {refundProcess.map((step, index) => (
            <div key={index} className="flex gap-4">
              <span className={cn(
                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold",
                "bg-rose-500 text-white"
              )}>
                {index + 1}
              </span>
              <div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className={cn(
                  currentTheme === 'dark' ? "text-gray-300" : "text-gray-600"
                )}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Refund Methods */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <IndianRupee className="w-6 h-6 text-rose-500" />
          <h2 className="text-2xl font-semibold">Refund Methods</h2>
        </div>
        <div className="space-y-4">
          <p>Your refund will be processed using your original payment method:</p>
          <ul className="space-y-2 pl-4">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>Credit/Debit Cards: 5-7 business days</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>UPI: 2-3 business days</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>Net Banking: 3-5 business days</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>Store Credit: Immediate</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Important Notes */}
      <div className={cn(
        "p-6 rounded-lg mb-12",
        currentTheme === 'dark' ? "bg-gray-800/50" : "bg-gray-50"
      )}>
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-rose-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold mb-4">Important Notes</h3>
            <ul className="space-y-2 list-disc pl-4">
              <li>Shipping costs are non-refundable unless the item is defective</li>
              <li>Return shipping costs are the responsibility of the customer</li>
              <li>Items must be returned in their original condition</li>
              <li>Sale items may have different refund policies</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="text-center">
        <p className="mb-4">Need help with a refund? Our support team is here to assist you</p>
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

export default Refund; 