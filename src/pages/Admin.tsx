import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Plus, Trash, MoreHorizontal, Tag } from "lucide-react";
import { LuxuryLoader } from "@/components/LuxuryLoader";
import ProductForm from "@/components/admin/ProductForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CouponForm } from "@/components/admin/CouponForm";
import { formatIndianPrice } from "@/lib/utils";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  sizes: string[];
  colors: string[];
  images: string[];
  stock_quantity: number;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  is_trending: boolean;
  video_url: string;
  style_category: string;
  category: string;
  gender: string;
  sale_percentage: number;
  sale_start_date: string | null;
  sale_end_date: string | null;
  quick_view_data: {
    material: string;
    fit: string;
    care_instructions: string[];
    features: string[];
  };
  key_highlights: {
    fit_type: string;
    fabric: string;
    neck: string;
    sleeve: string;
    pattern: string;
    length: string;
  };
  coupons?: {
    id: string;
    code: string;
    discount_percentage: number;
    valid_until: string;
    is_active: boolean;
  }[];
}

interface Coupon {
  id: string;
  code: string;
  description: string;
  category: string;
  discount_percentage: number;
  min_purchase_amount: number;
  max_discount_amount: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  usage_limit: number;
  times_used: number;
  product_id: string;
}

export default function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCouponDialog, setShowCouponDialog] = useState(false);
  const [selectedProductForCoupon, setSelectedProductForCoupon] = useState<Product | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          coupons (
            id,
            code,
            discount_percentage,
            valid_until,
            is_active
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
      setLoading(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch products.",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error: couponError } = await supabase
        .from('coupons')
        .delete()
        .eq('product_id', id);

      if (couponError) throw couponError;

      const { error: productError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (productError) throw productError;

      toast({
        title: "Success",
        description: "Product and associated coupons deleted successfully.",
      });
      fetchProducts();
    } catch (error: unknown) {
      const err = error as { message: string };
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to delete product.",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowProductForm(true);
  };

  const handleAssignCoupon = (product: Product) => {
    setSelectedProductForCoupon(product);
    setShowCouponDialog(true);
  };

  if (loading) {
    return <LuxuryLoader />;
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-500 mt-1">Manage your products and their coupons</p>
          </div>
          <Button 
            onClick={() => {
              setSelectedProduct(null);
              setShowProductForm(true);
            }}
            className="bg-luxury-gold hover:bg-luxury-gold/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Product
          </Button>
        </div>

        {showProductForm ? (
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif">
                {selectedProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowProductForm(false);
                  setSelectedProduct(null);
                }}
              >
                Cancel
              </Button>
            </div>
            <ProductForm
              initialData={selectedProduct || undefined}
              onSuccess={() => {
                setShowProductForm(false);
                setSelectedProduct(null);
                fetchProducts();
              }}
            />
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Coupons</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={product.images[0]} 
                          alt={product.title}
                          className="w-10 h-10 rounded-md object-cover"
                        />
                        <span>{product.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="capitalize">{product.gender}</TableCell>
                    <TableCell>{formatIndianPrice(product.price)}</TableCell>
                    <TableCell>
                      <Badge variant={product.stock_quantity > 10 ? "secondary" : "destructive"}>
                        {product.stock_quantity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {product.is_best_seller && (
                          <Badge variant="secondary">Best Seller</Badge>
                        )}
                        {product.is_featured && (
                          <Badge variant="secondary">Featured</Badge>
                        )}
                        {product.is_new_arrival && (
                          <Badge variant="secondary">New Arrival</Badge>
                        )}
                        {product.is_trending && (
                          <Badge variant="secondary">Trending</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {product.coupons?.map((coupon) => (
                          <Badge 
                            key={coupon.id}
                            variant={coupon.is_active ? "default" : "outline"}
                            className="text-xs"
                          >
                            {coupon.code} ({coupon.discount_percentage}%)
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleEdit(product)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit Product
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAssignCoupon(product)}>
                            <Tag className="w-4 h-4 mr-2" />
                            Assign Coupon
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash className="w-4 h-4 mr-2" />
                            Delete Product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        <Dialog open={showCouponDialog} onOpenChange={setShowCouponDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif">
                Assign Coupon to {selectedProductForCoupon?.title}
              </DialogTitle>
            </DialogHeader>
            {selectedProductForCoupon && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Existing Coupons</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProductForCoupon.coupons?.map((coupon) => (
                      <Badge 
                        key={coupon.id}
                        variant={coupon.is_active ? "default" : "outline"}
                      >
                        {coupon.code} ({coupon.discount_percentage}%)
                      </Badge>
                    ))}
                  </div>
                </div>
                <CouponForm
                  productId={selectedProductForCoupon.id}
                  onSuccess={() => {
                    setShowCouponDialog(false);
                    setSelectedProductForCoupon(null);
                    fetchProducts();
                    toast({
                      title: "Success",
                      description: "Coupon assigned successfully",
                    });
                  }}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}