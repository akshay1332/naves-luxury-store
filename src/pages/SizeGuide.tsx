import PolicyLayout from "@/components/layouts/PolicyLayout";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { Ruler, Shirt, RulerIcon, Info } from "lucide-react";

const SizeGuide = () => {
  const { theme: currentTheme } = useTheme();

  const measurementSteps = [
    {
      title: "Chest",
      instruction: "Measure around the fullest part of your chest, keeping the tape horizontal."
    },
    {
      title: "Waist",
      instruction: "Measure around your natural waistline, keeping the tape comfortably loose."
    },
    {
      title: "Hips",
      instruction: "Measure around the fullest part of your hips, keeping the tape horizontal."
    },
    {
      title: "Length",
      instruction: "Measure from the highest point of your shoulder to your desired length."
    },
    {
      title: "Sleeve",
      instruction: "Measure from shoulder seam to desired sleeve end point."
    }
  ];

  const sizeCharts = {
    tshirts: [
      { size: "XS", chest: "34-36", length: "26", shoulder: "16" },
      { size: "S", chest: "36-38", length: "27", shoulder: "17" },
      { size: "M", chest: "38-40", length: "28", shoulder: "18" },
      { size: "L", chest: "40-42", length: "29", shoulder: "19" },
      { size: "XL", chest: "42-44", length: "30", shoulder: "20" },
      { size: "XXL", chest: "44-46", length: "31", shoulder: "21" }
    ],
    hoodies: [
      { size: "XS", chest: "36-38", length: "27", shoulder: "17" },
      { size: "S", chest: "38-40", length: "28", shoulder: "18" },
      { size: "M", chest: "40-42", length: "29", shoulder: "19" },
      { size: "L", chest: "42-44", length: "30", shoulder: "20" },
      { size: "XL", chest: "44-46", length: "31", shoulder: "21" },
      { size: "XXL", chest: "46-48", length: "32", shoulder: "22" }
    ]
  };

  return (
    <PolicyLayout
      title="Size Guide"
      subtitle="Find your perfect fit with our detailed size guide"
    >
      {/* How to Measure */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <RulerIcon className="w-6 h-6 text-rose-500" />
          <h2 className="text-2xl font-semibold">How to Measure</h2>
        </div>
        <p className="mb-6">
          For the best fit, take your measurements while wearing light clothing. 
          Use a flexible tape measure and keep it snug but not tight.
        </p>
        <div className="space-y-6">
          {measurementSteps.map((step, index) => (
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
                  {step.instruction}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Size Charts */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Ruler className="w-6 h-6 text-rose-500" />
          <h2 className="text-2xl font-semibold">Size Charts</h2>
        </div>

        {/* T-Shirts */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Shirt className="w-5 h-5 text-rose-500" />
            <h3 className="text-xl font-semibold">T-Shirts</h3>
          </div>
          <div className="overflow-x-auto">
            <table className={cn(
              "w-full min-w-[500px] border-collapse",
              currentTheme === 'dark' ? "text-gray-300" : "text-gray-600"
            )}>
              <thead>
                <tr className={cn(
                  "border-b",
                  currentTheme === 'dark' ? "border-gray-800" : "border-gray-200"
                )}>
                  <th className="py-3 px-4 text-left font-semibold">Size</th>
                  <th className="py-3 px-4 text-left font-semibold">Chest (Inches)</th>
                  <th className="py-3 px-4 text-left font-semibold">Length (Inches)</th>
                  <th className="py-3 px-4 text-left font-semibold">Shoulder (Inches)</th>
                </tr>
              </thead>
              <tbody>
                {sizeCharts.tshirts.map((item, index) => (
                  <tr key={index} className={cn(
                    "border-b",
                    currentTheme === 'dark' ? "border-gray-800" : "border-gray-200"
                  )}>
                    <td className="py-3 px-4 font-semibold">{item.size}</td>
                    <td className="py-3 px-4">{item.chest}</td>
                    <td className="py-3 px-4">{item.length}</td>
                    <td className="py-3 px-4">{item.shoulder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hoodies */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shirt className="w-5 h-5 text-rose-500" />
            <h3 className="text-xl font-semibold">Hoodies</h3>
          </div>
          <div className="overflow-x-auto">
            <table className={cn(
              "w-full min-w-[500px] border-collapse",
              currentTheme === 'dark' ? "text-gray-300" : "text-gray-600"
            )}>
              <thead>
                <tr className={cn(
                  "border-b",
                  currentTheme === 'dark' ? "border-gray-800" : "border-gray-200"
                )}>
                  <th className="py-3 px-4 text-left font-semibold">Size</th>
                  <th className="py-3 px-4 text-left font-semibold">Chest (Inches)</th>
                  <th className="py-3 px-4 text-left font-semibold">Length (Inches)</th>
                  <th className="py-3 px-4 text-left font-semibold">Shoulder (Inches)</th>
                </tr>
              </thead>
              <tbody>
                {sizeCharts.hoodies.map((item, index) => (
                  <tr key={index} className={cn(
                    "border-b",
                    currentTheme === 'dark' ? "border-gray-800" : "border-gray-200"
                  )}>
                    <td className="py-3 px-4 font-semibold">{item.size}</td>
                    <td className="py-3 px-4">{item.chest}</td>
                    <td className="py-3 px-4">{item.length}</td>
                    <td className="py-3 px-4">{item.shoulder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Size Tips */}
      <div className={cn(
        "p-6 rounded-lg mb-12",
        currentTheme === 'dark' ? "bg-gray-800/50" : "bg-gray-50"
      )}>
        <div className="flex items-start gap-4">
          <Info className="w-6 h-6 text-rose-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold mb-4">Sizing Tips</h3>
            <ul className="space-y-2 list-disc pl-4">
              <li>If you're between sizes, order the larger size for a more comfortable fit</li>
              <li>Consider the style of the garment - oversized items are designed to fit loosely</li>
              <li>Check the product description for specific fit information</li>
              <li>Remember that different styles may fit differently</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="text-center">
        <p className="mb-4">Need help finding your size? Our support team is here to assist you</p>
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

export default SizeGuide; 