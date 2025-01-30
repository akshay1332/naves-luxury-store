import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Edit, Plus, Trash2 } from "lucide-react";
import { CouponManager } from "./CouponManager";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface DatabaseCoupon {
  id: string;
  code: string;
  description: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_purchase_amount: number;
  max_discount_amount: number;
  valid_from: string;
  valid_until: string;
  usage_limit: number;
  times_used: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function CouponList() {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<DatabaseCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<DatabaseCoupon | null>(null);

  const fetchCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCoupons(data || []);
    } catch (error: unknown) {
      const err = error as { message: string };
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to fetch coupons",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("coupons")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Coupon deleted successfully",
      });

      fetchCoupons();
    } catch (error: unknown) {
      const err = error as { message: string };
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to delete coupon",
      });
    }
  };

  const handleEdit = (coupon: DatabaseCoupon) => {
    setSelectedCoupon(coupon);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedCoupon(null);
    setIsDialogOpen(true);
  };

  const onSuccess = () => {
    setIsDialogOpen(false);
    fetchCoupons();
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Create Coupon
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Valid Period</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.map((coupon) => (
            <TableRow key={coupon.id}>
              <TableCell className="font-medium">{coupon.code}</TableCell>
              <TableCell>{coupon.description}</TableCell>
              <TableCell>
                {coupon.discount_type === "percentage"
                  ? `${coupon.discount_value}%`
                  : `₹${coupon.discount_value}`}
              </TableCell>
              <TableCell>
                {format(new Date(coupon.valid_from), "PP")} -{" "}
                {format(new Date(coupon.valid_until), "PP")}
              </TableCell>
              <TableCell>
                {coupon.times_used} / {coupon.usage_limit}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    coupon.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {coupon.is_active ? "Active" : "Inactive"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(coupon)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(coupon.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <CouponManager
            initialData={selectedCoupon}
            onSuccess={onSuccess}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
} 