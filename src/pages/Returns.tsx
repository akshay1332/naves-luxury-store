import PolicyLayout from "@/components/layouts/PolicyLayout";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, AlertTriangle, ArrowLeftRight } from "lucide-react";

const Returns = () => {
  const { theme: currentTheme } = useTheme();

  const eligibilityItems = [
    {
      icon: CheckCircle2,
      title: "Eligible Items",
      items: [
        "Unworn clothing with original tags attached",
        "Unwashed and undamaged items",
        "Items in original packaging",
        "Items returned within 30 days of delivery"
      ]
    },
    {
      icon: XCircle,
      title: "Non-Eligible Items",
      items: [
        "Worn or washed clothing",
        "Items without original tags",
        "Damaged or altered items",
        "Customized or personalized items",
        "Items marked as final sale"
      ]
    }
  ];

  const returnSteps = [
    {
      title: "Initiate Return",
      description: "Log in to your account and go to order history. Select the item you wish to return and fill out the return form."
    },
    {
      title: "Package Your Item",
      description: "Pack the item securely in its original packaging with all tags attached. Include the return form in the package."
    },
    {
      title: "Ship the Item",
      description: "Use the provided return shipping label or ship the item to our returns center. Keep the tracking number for reference."
    },
    {
      title: "Refund Processing",
      description: "Once we receive and inspect your return, we'll process your refund within 5-7 business days to your original payment method."
    }
  ];

  return (
    <PolicyLayout
      title="Returns & Exchanges"
      subtitle="Easy returns within 30 days of delivery"
    >
      {/* Return Policy Overview */}
      <div className="mb-12">
        <p className="text-lg mb-6">
          At Custom Print, we want you to be completely satisfied with your purchase. 
          If you're not happy with your order, we accept returns within 30 days of delivery 
          for a full refund or exchange.
        </p>
      </div>

      {/* Eligibility */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {eligibilityItems.map((section, index) => (
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

      {/* Return Process */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Return Process</h2>
        <div className="space-y-6">
          {returnSteps.map((step, index) => (
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
              <li>Return shipping costs are the responsibility of the customer unless the item is defective</li>
              <li>Refunds will be issued to the original payment method</li>
              <li>Sale items may have different return policies</li>
              <li>International returns may take longer to process</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Exchange Process */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <ArrowLeftRight className="w-6 h-6 text-rose-500" />
          <h2 className="text-2xl font-semibold">Exchange Process</h2>
        </div>
        <p className="mb-4">
          If you'd like to exchange your item for a different size or color:
        </p>
        <ol className="space-y-4 list-decimal pl-4">
          <li>Follow the same return process as mentioned above</li>
          <li>Indicate on the return form that you'd like an exchange</li>
          <li>Specify the new size or color you'd like</li>
          <li>Once we receive your return, we'll process your exchange and ship the new item</li>
        </ol>
      </div>

      {/* Contact Support */}
      <div className="text-center">
        <p className="mb-4">Need help with your return? Our support team is here to assist you</p>
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

export default Returns; 