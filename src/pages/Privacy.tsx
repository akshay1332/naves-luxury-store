import PolicyLayout from "@/components/layouts/PolicyLayout";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { Shield, Lock, Eye, Database, Mail, AlertTriangle } from "lucide-react";

const Privacy = () => {
  const { theme: currentTheme } = useTheme();

  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        "Personal information (name, email, shipping address)",
        "Payment information (processed securely through our payment partners)",
        "Order history and preferences",
        "Device information and browsing data",
        "Communication records with our support team"
      ]
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        "Processing and fulfilling your orders",
        "Providing customer support",
        "Sending order updates and shipping notifications",
        "Improving our products and services",
        "Marketing communications (with your consent)",
        "Fraud prevention and security"
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        "Industry-standard encryption protocols",
        "Secure payment processing",
        "Regular security audits and updates",
        "Limited employee access to personal data",
        "Strict data handling procedures"
      ]
    },
    {
      icon: Mail,
      title: "Marketing Communications",
      content: [
        "Optional newsletter subscription",
        "Product updates and promotions",
        "Easy unsubscribe option in every email",
        "Preference management through account settings",
        "No sharing of email lists with third parties"
      ]
    }
  ];

  return (
    <PolicyLayout
      title="Privacy Policy"
      subtitle="Last updated: February 2024"
    >
      {/* Introduction */}
      <div className="mb-12">
        <p className="text-lg mb-6">
          At Custom Print, we take your privacy seriously. This Privacy Policy explains how we collect, 
          use, and protect your personal information when you use our website and services.
        </p>
      </div>

      {/* Main Sections */}
      <div className="space-y-12">
        {sections.map((section, index) => (
          <div key={index} className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <section.icon className="w-6 h-6 text-rose-500" />
              <h2 className="text-2xl font-semibold">{section.title}</h2>
            </div>
            <ul className="space-y-2 pl-4">
              {section.content.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
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

      {/* Your Rights */}
      <div className="mt-12 mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-rose-500" />
          <h2 className="text-2xl font-semibold">Your Rights</h2>
        </div>
        <div className="space-y-4">
          <p>You have the right to:</p>
          <ul className="space-y-2 pl-4">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
              <span>Access your personal information</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
              <span>Correct any inaccurate information</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
              <span>Request deletion of your information</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
              <span>Opt-out of marketing communications</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
              <span>Request a copy of your data</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Important Notice */}
      <div className={cn(
        "p-6 rounded-lg mb-12",
        currentTheme === 'dark' ? "bg-gray-800/50" : "bg-gray-50"
      )}>
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-rose-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold mb-4">Important Notice</h3>
            <p className="mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices 
              or for legal requirements. We will notify you of any material changes through our website 
              or email.
            </p>
            <p>
              By using our website and services, you agree to the terms of this Privacy Policy. 
              If you do not agree with our practices, please do not use our services.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="text-center">
        <p className="mb-4">
          For any privacy-related questions or concerns, please contact our Data Protection Officer
        </p>
        <a
          href="mailto:privacy@customprint.co.in"
          className={cn(
            "inline-flex items-center justify-center px-6 py-3 rounded-lg",
            "font-semibold text-white bg-rose-500 hover:bg-rose-600",
            "transition-colors duration-300"
          )}
        >
          Contact Privacy Team
        </a>
      </div>
    </PolicyLayout>
  );
};

export default Privacy; 