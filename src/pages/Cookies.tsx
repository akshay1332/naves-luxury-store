import PolicyLayout from "@/components/layouts/PolicyLayout";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { Cookie, Shield, Settings, AlertTriangle } from "lucide-react";

const Cookies = () => {
  const { theme: currentTheme } = useTheme();

  const cookieTypes = [
    {
      title: "Essential Cookies",
      description: "These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.",
      examples: [
        "Session cookies",
        "Authentication cookies",
        "Security cookies",
        "Load balancing cookies"
      ]
    },
    {
      title: "Functional Cookies",
      description: "These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers.",
      examples: [
        "Language preference cookies",
        "Theme preference cookies",
        "User customization cookies",
        "Region/location cookies"
      ]
    },
    {
      title: "Analytics Cookies",
      description: "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.",
      examples: [
        "Google Analytics cookies",
        "Performance cookies",
        "Visitor behavior cookies",
        "Traffic source cookies"
      ]
    },
    {
      title: "Marketing Cookies",
      description: "These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for individual users.",
      examples: [
        "Advertising cookies",
        "Social media cookies",
        "Retargeting cookies",
        "Campaign effectiveness cookies"
      ]
    }
  ];

  return (
    <PolicyLayout
      title="Cookie Policy"
      subtitle="Understanding how we use cookies to improve your experience"
    >
      {/* Introduction */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Cookie className="w-6 h-6 text-rose-500" />
          <h2 className="text-2xl font-semibold">What Are Cookies?</h2>
        </div>
        <p className="text-lg mb-6">
          Cookies are small text files that are placed on your device when you visit our website. 
          They help us provide you with a better experience by remembering your preferences, 
          analyzing site usage, and assisting in our marketing efforts.
        </p>
      </div>

      {/* Cookie Types */}
      <div className="space-y-8 mb-12">
        {cookieTypes.map((type, index) => (
          <div
            key={index}
            className={cn(
              "p-6 rounded-lg border",
              currentTheme === 'dark' ? "border-gray-800" : "border-gray-200"
            )}
          >
            <h3 className="text-xl font-semibold mb-4">{type.title}</h3>
            <p className={cn(
              "mb-4",
              currentTheme === 'dark' ? "text-gray-300" : "text-gray-600"
            )}>
              {type.description}
            </p>
            <div className="pl-4">
              <p className="font-semibold mb-2">Examples:</p>
              <ul className="space-y-2">
                {type.examples.map((example, exampleIndex) => (
                  <li key={exampleIndex} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Cookie Management */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-rose-500" />
          <h2 className="text-2xl font-semibold">Managing Cookies</h2>
        </div>
        <p className="mb-4">
          You can control and manage cookies in various ways:
        </p>
        <ul className="space-y-3 pl-4">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2" />
            <span>Browser Settings: You can modify your browser settings to accept or reject cookies</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2" />
            <span>Cookie Consent: Use our cookie consent tool to manage your preferences</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2" />
            <span>Third-Party Tools: Install browser extensions to manage cookie preferences</span>
          </li>
        </ul>
      </div>

      {/* Data Protection */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-rose-500" />
          <h2 className="text-2xl font-semibold">Data Protection</h2>
        </div>
        <p className="mb-4">
          We are committed to protecting your privacy and ensuring the security of your data:
        </p>
        <ul className="space-y-3 pl-4">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2" />
            <span>We only collect necessary information through cookies</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2" />
            <span>Your data is encrypted and securely stored</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2" />
            <span>We never sell your personal information to third parties</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2" />
            <span>Regular security audits ensure data protection compliance</span>
          </li>
        </ul>
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
              By continuing to use our website, you agree to our use of cookies. 
              Disabling certain cookies may affect the functionality of our website.
            </p>
            <p>
              We may update this Cookie Policy from time to time. Any changes will be 
              posted on this page with an updated revision date.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="text-center">
        <p className="mb-4">
          For questions about our Cookie Policy or to update your preferences, please contact us
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

export default Cookies; 