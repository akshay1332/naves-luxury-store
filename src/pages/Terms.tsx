import PolicyLayout from "@/components/layouts/PolicyLayout";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { Scale, ShieldCheck, AlertTriangle, FileText } from "lucide-react";

const Terms = () => {
  const { theme: currentTheme } = useTheme();

  const sections = [
    {
      title: "Account Terms",
      content: [
        "You must be at least 18 years old to use our services",
        "You must provide accurate and complete information when creating an account",
        "You are responsible for maintaining the security of your account",
        "You must notify us immediately of any unauthorized access to your account",
        "We reserve the right to suspend or terminate accounts that violate our terms"
      ]
    },
    {
      title: "Product Terms",
      content: [
        "All product images and descriptions are for reference only",
        "Colors may vary slightly from what appears on your screen",
        "We reserve the right to modify product specifications without notice",
        "Product availability is subject to change",
        "Pricing is subject to change without notice"
      ]
    },
    {
      title: "Order & Payment Terms",
      content: [
        "Orders are subject to acceptance and availability",
        "Payment must be made in full at the time of order",
        "We accept major credit cards and other payment methods as specified",
        "Prices are inclusive of applicable taxes",
        "Shipping costs are calculated at checkout"
      ]
    },
    {
      title: "Intellectual Property",
      content: [
        "All content on our website is our exclusive property",
        "You may not use our content without explicit permission",
        "Our brand name and logo are protected trademarks",
        "User-submitted content remains the property of the user",
        "We respect intellectual property rights and expect users to do the same"
      ]
    }
  ];

  return (
    <PolicyLayout
      title="Terms of Service"
      subtitle="Last updated: February 2024"
    >
      {/* Introduction */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Scale className="w-6 h-6 text-rose-500" />
          <h2 className="text-2xl font-semibold">Introduction</h2>
        </div>
        <p className="text-lg mb-6">
          Welcome to Custom Print. By accessing or using our website and services, 
          you agree to be bound by these Terms of Service. Please read them carefully 
          before using our services.
        </p>
      </div>

      {/* Main Sections */}
      <div className="space-y-12">
        {sections.map((section, index) => (
          <div key={index}>
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-rose-500" />
              <h2 className="text-2xl font-semibold">{section.title}</h2>
            </div>
            <ul className="space-y-3 pl-4">
              {section.content.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0 mt-2" />
                  <span className={cn(
                    "text-base",
                    currentTheme === 'dark' ? "text-gray-300" : "text-gray-600"
                  )}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* User Responsibilities */}
      <div className="mt-12 mb-12">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="w-6 h-6 text-rose-500" />
          <h2 className="text-2xl font-semibold">User Responsibilities</h2>
        </div>
        <ul className="space-y-3 pl-4">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0 mt-2" />
            <span>You agree not to use our services for any illegal or unauthorized purpose</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0 mt-2" />
            <span>You must not violate any laws in your jurisdiction while using our services</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0 mt-2" />
            <span>You are responsible for any activity that occurs under your account</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0 mt-2" />
            <span>You must not harass, abuse, or harm another person through our services</span>
          </li>
        </ul>
      </div>

      {/* Disclaimer */}
      <div className={cn(
        "p-6 rounded-lg mb-12",
        currentTheme === 'dark' ? "bg-gray-800/50" : "bg-gray-50"
      )}>
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-rose-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold mb-4">Disclaimer</h3>
            <p className="mb-4">
              Our services are provided "as is" without any warranties, expressed or implied. 
              We do not guarantee that our services will be uninterrupted, timely, secure, or error-free.
            </p>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any 
              material changes through our website or email.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="text-center">
        <p className="mb-4">
          If you have any questions about these Terms of Service, please contact us
        </p>
        <a
          href="mailto:legal@customprint.co.in"
          className={cn(
            "inline-flex items-center justify-center px-6 py-3 rounded-lg",
            "font-semibold text-white bg-rose-500 hover:bg-rose-600",
            "transition-colors duration-300"
          )}
        >
          Contact Legal Team
        </a>
      </div>
    </PolicyLayout>
  );
};

export default Terms; 