import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { Grid, List, LayoutGrid, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "@/components/ui/use-toast";
import { SEO } from "@/components/SEO";
import { formatIndianPrice } from "@/lib/utils";

interface QuickViewData {
  material?: string;
  fit?: string;
  care_instructions?: string[];
  features?: string[];
}

interface SizeGuideInfo {
  measurements?: {
    [key: string]: {
      chest?: string;
      length?: string;
      sleeve?: string;
    };
  };
  notes?: string[];
}

interface Product {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  gender: string | null;
  colors: string[] | null;
  sizes: string[] | null;
  price: number;
  images: string[] | null;
  video_url: string | null;
  is_featured: boolean | null;
  is_best_seller: boolean | null;
  is_new_arrival: boolean | null;
  is_trending: boolean | null;
  stock_quantity: number | null;
  created_at: string;
  updated_at: string;
  quick_view_data: QuickViewData | null;
  sale_percentage: number | null;
  sale_start_date: string | null;
  sale_end_date: string | null;
  size_guide_info: SizeGuideInfo | null;
  style_category: string | null;
}

const PRODUCT_CATEGORIES = [
  "All",
  "Oversized T-shirts",
  "T-Shirts",
  "Bottles",
  "Cup",
  "Cargo Pants",
  "Cap"
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest Arrivals" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
const COLORS = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Gray", value: "#808080" },
  { name: "Red", value: "#FF0000" },
  { name: "Blue", value: "#0000FF" },
  { name: "Green", value: "#00FF00" },
  { name: "Yellow", value: "#FFFF00" },
  { name: "Purple", value: "#800080" },
  { name: "Pink", value: "#FFC0CB" },
  { name: "Orange", value: "#FFA500" },
];

const STYLES = [
  "Casual",
  "Streetwear",
  "Athletic",
  "Formal",
  "Vintage",
  "Modern",
  "Classic",
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedCategory = searchParams.get('category') || 'All';
  const selectedSort = searchParams.get('sort') || 'newest';
  const selectedView = searchParams.get('view') || 'grid';
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [hoveredImageIndex, setHoveredImageIndex] = useState<{ [key: string]: number }>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [cartCounts, setCartCounts] = useState<{ [key: string]: number }>({});

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["products", selectedCategory, selectedSort, priceRange, selectedSizes, selectedColors, selectedStyles],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*");
      
      if (selectedCategory !== 'All') {
        query = query.eq('category', selectedCategory);
      }
      
      const { data, error } = await query;
      if (error) throw error;

      return (data as Product[])
        .filter(product => {
          const price = product.price;
          const hasValidPrice = price >= priceRange[0] && price <= priceRange[1];
          const hasValidSize = selectedSizes.length === 0 || 
            (product.sizes && product.sizes.some(size => selectedSizes.includes(size)));
          const hasValidColor = selectedColors.length === 0 || 
            (product.colors && product.colors.some(color => selectedColors.includes(color)));
          const hasValidStyle = selectedStyles.length === 0 || 
            (product.style_category && selectedStyles.includes(product.style_category));
          
          return hasValidPrice && hasValidSize && hasValidColor && hasValidStyle;
        })
        .sort((a, b) => {
          switch (selectedSort) {
            case 'price-low':
              return a.price - b.price;
            case 'price-high':
              return b.price - a.price;
            case 'popular':
              return ((b.is_trending ? 1 : 0) + (b.is_best_seller ? 1 : 0)) - 
                     ((a.is_trending ? 1 : 0) + (a.is_best_seller ? 1 : 0));
            default:
              return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
        });
    },
  });

  const handleCategoryChange = (category: string) => {
    setSearchParams({ ...Object.fromEntries(searchParams), category });
  };

  const handleSortChange = (sort: string) => {
    setSearchParams({ ...Object.fromEntries(searchParams), sort });
  };

  const handleViewChange = (view: string) => {
    setSearchParams({ ...Object.fromEntries(searchParams), view });
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const handleStyleToggle = (style: string) => {
    setSelectedStyles(prev => 
      prev.includes(style) 
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please log in to add items to your cart",
        });
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: productId,
          quantity: 1,
        });

      if (error) throw error;

      setCartCounts(prev => ({
        ...prev,
        [productId]: (prev[productId] || 0) + 1
      }));

      toast({
        title: "Success",
        description: "Item added to cart",
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    }
  };

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Price Range</h3>
        <div className="px-2">
          <Slider
            defaultValue={[0, 10000]}
            max={10000}
            step={500}
            value={priceRange}
            onValueChange={(value: number[]) => {
              if (value.length === 2) {
                setPriceRange([value[0], value[1]]);
              }
            }}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
            <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Sizes</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map(size => (
            <Button
              key={size}
              variant={selectedSizes.includes(size) ? "default" : "outline"}
              size="sm"
              onClick={() => handleSizeToggle(size)}
              className="w-12 h-12 rounded-full"
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Colors</h3>
        <div className="flex flex-wrap gap-3">
          {COLORS.map(color => (
            <button
              key={color.name}
              onClick={() => handleColorToggle(color.name)}
              className={`w-8 h-8 rounded-full border-2 transition-transform ${
                selectedColors.includes(color.name)
                  ? 'border-primary scale-110'
                  : 'border-gray-200 hover:scale-110'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Styles */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Styles</h3>
        <div className="flex flex-wrap gap-2">
          {STYLES.map(style => (
            <Button
              key={style}
              variant={selectedStyles.includes(style) ? "default" : "outline"}
              size="sm"
              onClick={() => handleStyleToggle(style)}
              className="rounded-full"
            >
              {style}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={`${selectedCategory === 'All' ? 'All Products' : selectedCategory} - Custom Print | Premium Custom Clothing`}
        description={`Shop our ${selectedCategory.toLowerCase()} collection of premium custom printed clothing. High-quality ${selectedCategory === 'All' ? 'hoodies, t-shirts, and apparel' : selectedCategory.toLowerCase()} with custom designs. Fast delivery and bulk order options available.`}
        keywords={[
          `custom ${selectedCategory.toLowerCase()}`,
          `printed ${selectedCategory.toLowerCase()}`,
          'custom clothing india',
          'custom print shop',
          'premium clothing printing',
          'bulk custom orders',
          'personalized apparel',
          'custom design printing',
          'quality print service',
          'custom merchandise',
          'clothing customization',
          'print on demand india',
          'custom fashion wear',
          'branded apparel printing',
          'custom clothing store',
          'best printing service'
        ]}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-50"
      >
        {/* Announcement Banner */}
        <div className="bg-primary/90 text-white py-3 px-4 text-center">
          <p className="text-sm font-medium">
            Free Shipping Sitewide on Every Order, Don't Miss Out!!
          </p>
        </div>

        <div className="max-w-[2000px] mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              {selectedCategory === 'All' ? 'All Products' : selectedCategory}
            </motion.h1>
            <motion.p
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600"
            >
              Discover our collection of premium quality custom prints
            </motion.p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filters */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="hidden lg:block w-80 bg-white p-6 rounded-lg shadow-sm h-fit sticky top-4"
            >
              <FilterSection />
            </motion.div>

            {/* Mobile Filters */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="lg:hidden mb-4 w-full flex items-center justify-center gap-2"
                >
                  <SlidersHorizontal size={20} />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[540px] bg-white">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-8">
                  <FilterSection />
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex-1">
              {/* Filters Section */}
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white p-4 rounded-lg shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="w-[200px] bg-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {PRODUCT_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedSort} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-[200px] bg-white">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {SORT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => handleViewChange('grid')}
                    className={`p-2 rounded-md transition-all ${
                      selectedView === 'grid'
                        ? 'bg-white shadow-sm text-primary'
                        : 'text-gray-500 hover:text-primary'
                    }`}
                  >
                    <LayoutGrid size={20} />
                  </button>
                  <button
                    onClick={() => handleViewChange('compact')}
                    className={`p-2 rounded-md transition-all ${
                      selectedView === 'compact'
                        ? 'bg-white shadow-sm text-primary'
                        : 'text-gray-500 hover:text-primary'
                    }`}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => handleViewChange('list')}
                    className={`p-2 rounded-md transition-all ${
                      selectedView === 'list'
                        ? 'bg-white shadow-sm text-primary'
                        : 'text-gray-500 hover:text-primary'
                    }`}
                  >
                    <List size={20} />
                  </button>
                </div>
              </motion.div>

              {/* Active Filters */}
              {(selectedSizes.length > 0 || selectedColors.length > 0 || selectedStyles.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-2 mb-6"
                >
                  {selectedSizes.map(size => (
                    <Button
                      key={size}
                      variant="secondary"
                      size="sm"
                      onClick={() => handleSizeToggle(size)}
                      className="rounded-full"
                    >
                      {size}
                      <X size={14} className="ml-2" />
                    </Button>
                  ))}
                  {selectedColors.map(color => (
                    <Button
                      key={color}
                      variant="secondary"
                      size="sm"
                      onClick={() => handleColorToggle(color)}
                      className="rounded-full"
                    >
                      {color}
                      <X size={14} className="ml-2" />
                    </Button>
                  ))}
                  {selectedStyles.map(style => (
                    <Button
                      key={style}
                      variant="secondary"
                      size="sm"
                      onClick={() => handleStyleToggle(style)}
                      className="rounded-full"
                    >
                      {style}
                      <X size={14} className="ml-2" />
                    </Button>
                  ))}
                </motion.div>
              )}

              {/* Products Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`grid gap-6 ${
                  selectedView === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : selectedView === 'compact'
                    ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                    : 'grid-cols-1'
                }`}
              >
                {products?.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{
                      y: -8,
                      transition: { duration: 0.3 },
                    }}
                    onClick={() => handleProductClick(product.id)}
                    onHoverStart={() => {
                      if (product.images && product.images.length > 1) {
                        setHoveredImageIndex(prev => ({
                          ...prev,
                          [product.id]: 1
                        }));
                      }
                    }}
                    onHoverEnd={() => {
                      setHoveredImageIndex(prev => ({
                        ...prev,
                        [product.id]: 0
                      }));
                    }}
                    className={`group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer ${
                      selectedView === 'list' ? 'flex gap-6' : ''
                    }`}
                  >
                    <div className={`relative ${selectedView === 'list' ? 'w-1/3' : 'w-full'}`}>
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={hoveredImageIndex[product.id] || 0}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          src={product.images?.[hoveredImageIndex[product.id] || 0] || '/placeholder-product.jpg'}
                          alt={product.title}
                          className="w-full h-[300px] object-cover"
                        />
                      </AnimatePresence>
                      {product.is_new_arrival && (
                        <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          NEW
                        </div>
                      )}
                      {product.sale_percentage && product.sale_percentage > 0 && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          SAVE {product.sale_percentage}%
                        </div>
                      )}
                    </div>
                    <div className={`p-4 ${selectedView === 'list' ? 'w-2/3' : ''}`}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.title}</h3>
                      <p className="text-gray-600 mb-3">{product.description}</p>
                      {/* Colors */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="flex gap-1 mb-3">
                          {product.colors.map(color => (
                            <div
                              key={color}
                              className="w-4 h-4 rounded-full border border-gray-200"
                              style={{ backgroundColor: COLORS.find(c => c.name === color)?.value }}
                              title={color}
                            />
                          ))}
                        </div>
                      )}
                      {/* Sizes */}
                      {product.sizes && product.sizes.length > 0 && (
                        <div className="flex gap-1 mb-3">
                          {product.sizes.map(size => (
                            <div
                              key={size}
                              className="text-xs bg-gray-100 px-2 py-1 rounded"
                            >
                              {size}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-red-500">
                            {formatIndianPrice(product.price)}
                          </span>
                          {product.sale_percentage && product.sale_percentage > 0 && (
                            <>
                              <span className="text-sm text-gray-500 line-through">
                                {formatIndianPrice(Math.round(product.price / (1 - product.sale_percentage / 100)))}
                              </span>
                              <span className="text-red-500 text-sm font-semibold">
                                ({product.sale_percentage}% OFF)
                              </span>
                            </>
                          )}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => handleAddToCart(e, product.id)}
                          className="relative bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                        >
                          Add to Cart
                          {cartCounts[product.id] && cartCounts[product.id] > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                              {cartCounts[product.id]}
                            </span>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Empty State */}
              {products?.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Products Found</h3>
                  <p className="text-gray-600">Try adjusting your filters to find what you're looking for.</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Products;