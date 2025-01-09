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
import { Pencil, Plus, Trash } from "lucide-react";
import { LuxuryLoader } from "@/components/LuxuryLoader";
import ProductForm from "@/components/admin/ProductForm";

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
  category: string;
  gender: string;
}

export default function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
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
      // First, delete any associated coupons
      const { error: couponError } = await supabase
        .from('coupons')
        .delete()
        .eq('product_id', id);

      if (couponError) throw couponError;

      // Then delete the product
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
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete product.",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowProductForm(true);
  };

  if (loading) {
    return <LuxuryLoader />;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-serif font-bold">Product Management</h1>
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
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif">
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
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Best Seller</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.title}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="capitalize">{product.gender}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>{product.stock_quantity}</TableCell>
                    <TableCell>{product.is_best_seller ? "Yes" : "No"}</TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(product)}
                        className="hover:bg-luxury-gold/10"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}