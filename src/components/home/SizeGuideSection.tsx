import { motion } from "framer-motion";
import { Ruler } from "lucide-react";

const SizeGuideSection = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Ruler className="h-12 w-12 mx-auto text-luxury-gold mb-6" />
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Size Guide</h2>
          <p className="text-gray-600">Find your perfect fit</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-4 px-6 text-left">Size</th>
                    <th className="py-4 px-6 text-left">Bust</th>
                    <th className="py-4 px-6 text-left">Waist</th>
                    <th className="py-4 px-6 text-left">Hips</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 px-6">XS</td>
                    <td className="py-4 px-6">32"</td>
                    <td className="py-4 px-6">24"</td>
                    <td className="py-4 px-6">34"</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-6">S</td>
                    <td className="py-4 px-6">34"</td>
                    <td className="py-4 px-6">26"</td>
                    <td className="py-4 px-6">36"</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-6">M</td>
                    <td className="py-4 px-6">36"</td>
                    <td className="py-4 px-6">28"</td>
                    <td className="py-4 px-6">38"</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-6">L</td>
                    <td className="py-4 px-6">38"</td>
                    <td className="py-4 px-6">30"</td>
                    <td className="py-4 px-6">40"</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6">XL</td>
                    <td className="py-4 px-6">40"</td>
                    <td className="py-4 px-6">32"</td>
                    <td className="py-4 px-6">42"</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-serif">How to Measure</h3>
            <div className="space-y-4">
              <p className="text-gray-600">
                <strong>Bust:</strong> Measure around the fullest part of your bust, keeping the tape parallel to the floor.
              </p>
              <p className="text-gray-600">
                <strong>Waist:</strong> Measure around your natural waistline, keeping the tape comfortably loose.
              </p>
              <p className="text-gray-600">
                <strong>Hips:</strong> Measure around the fullest part of your hips, keeping the tape parallel to the floor.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SizeGuideSection;