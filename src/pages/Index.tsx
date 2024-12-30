import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/placeholder.svg"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-light mb-6">
            Timeless Elegance
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Discover our collection of traditional clothing, where heritage meets contemporary style.
          </p>
          <Link
            to="/products"
            className="btn-primary"
          >
            Explore Collection
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Featured Collection</h2>
            <p className="text-gray-600">Curated pieces that define elegance</p>
          </div>
          
          {/* Product Grid Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Product cards will go here */}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-secondary-dark py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Client Stories</h2>
            <p className="text-gray-600">Experiences shared by our valued customers</p>
          </div>
          
          {/* Testimonials Grid Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial cards will go here */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;