import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
}

interface CouponProductAssignmentProps {
  couponId: string;
}

export const CouponProductAssignment = ({ couponId }: CouponProductAssignmentProps) => {
  const { toast } = useToast();
  const [assignedProducts, setAssignedProducts] = useState<Product[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch assigned products
  const fetchAssignedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('coupon_products')
        .select(`
          products (
            id,
            title,
            price,
            category
          )
        `)
        .eq('coupon_id', couponId);

      if (error) throw error;
      setAssignedProducts(data?.map(item => item.products) || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch assigned products",
      });
    }
  };

  // Fetch available products
  const fetchAvailableProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, title, price, category')
        .ilike('title', `%${searchTerm}%`);

      if (error) throw error;
      setAvailableProducts(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch products",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedProducts();
  }, [couponId]);

  useEffect(() => {
    if (dialogOpen) {
      fetchAvailableProducts();
    }
  }, [dialogOpen, searchTerm]);

  const handleAssignProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('coupon_products')
        .insert([
          { coupon_id: couponId, product_id: productId }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product assigned successfully",
      });

      fetchAssignedProducts();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assign product",
      });
    }
  };

  const handleRemoveProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('coupon_products')
        .delete()
        .eq('coupon_id', couponId)
        .eq('product_id', productId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product removed successfully",
      });

      fetchAssignedProducts();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove product",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Assigned Products</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Assign Products
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Assign Products to Coupon</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox
                          checked={assignedProducts.some(p => p.id === product.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleAssignProduct(product.id);
                            } else {
                              handleRemoveProduct(product.id);
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>{product.title}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>₹{product.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.title}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>₹{product.price}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveProduct(product.id)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {assignedProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                  No products assigned to this coupon
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}; 