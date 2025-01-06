import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { CouponForm } from "@/components/admin/CouponForm";
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
import { Plus, Pencil, Trash } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  discount_percentage: number;
  valid_from: string;
  valid_until: string;
  min_purchase_amount: number;
  max_discount_amount: number;
  usage_limit: number;
  times_used: number;
  category?: string;
}

export default function Coupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoupons(data || []);
      setLoading(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch coupons.",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Coupon deleted successfully.",
      });
      fetchCoupons();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete coupon.",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Coupon Management</h1>
          <Button 
            onClick={() => {
              setSelectedCoupon(null);
              setShowForm(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Coupon
          </Button>
        </div>

        {showForm ? (
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {selectedCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </h2>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowForm(false);
                  setSelectedCoupon(null);
                }}
              >
                Cancel
              </Button>
            </div>
            <div className="p-4">
              <CouponForm
                initialData={selectedCoupon || undefined}
                onSuccess={() => {
                  setShowForm(false);
                  setSelectedCoupon(null);
                  fetchCoupons();
                }}
              />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Valid Period</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell className="font-medium">{coupon.code}</TableCell>
                    <TableCell>{coupon.discount_percentage}%</TableCell>
                    <TableCell>
                      {new Date(coupon.valid_from).toLocaleDateString()} - 
                      {coupon.valid_until ? new Date(coupon.valid_until).toLocaleDateString() : 'No expiry'}
                    </TableCell>
                    <TableCell>
                      {coupon.times_used} / {coupon.usage_limit || '∞'}
                    </TableCell>
                    <TableCell>{coupon.category || 'All'}</TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedCoupon(coupon);
                          setShowForm(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(coupon.id)}
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