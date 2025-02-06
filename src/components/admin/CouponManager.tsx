import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

type Coupon = DatabaseCoupon;

type NewCoupon = Omit<DatabaseCoupon, 'id' | 'created_at' | 'updated_at' | 'times_used'>;

interface SupabaseError {
  message: string;
}

interface CouponManagerProps {
  initialData?: DatabaseCoupon | null;
  onSuccess: () => void;
}

export function CouponManager({ initialData, onSuccess }: CouponManagerProps) {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState<Omit<DatabaseCoupon, 'id' | 'created_at' | 'updated_at' | 'times_used'>>({
    code: initialData?.code || "",
    description: initialData?.description || "",
    discount_type: initialData?.discount_type || "percentage",
    discount_value: initialData?.discount_value || 0,
    min_purchase_amount: initialData?.min_purchase_amount || 0,
    max_discount_amount: initialData?.max_discount_amount || 0,
    valid_from: initialData?.valid_from || new Date().toISOString(),
    valid_until: initialData?.valid_until || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    usage_limit: initialData?.usage_limit || 100,
    is_active: initialData?.is_active ?? true,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCoupons(data as Coupon[]);
    } catch (error: unknown) {
      const err = error as SupabaseError;
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to fetch coupons",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (initialData) {
        // Update existing coupon
        const { error } = await supabase
          .from('coupons')
          .update(formData)
          .eq('id', initialData.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Coupon updated successfully",
        });
      } else {
        // Create new coupon
        const { error } = await supabase
          .from('coupons')
          .insert([formData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Coupon created successfully",
        });
      }

      onSuccess();
    } catch (error: unknown) {
      const err = error as { message: string };
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to save coupon",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleCouponStatus = async (coupon: Coupon) => {
    try {
      const { error } = await supabase
        .from("coupons")
        .update({ is_active: !coupon.is_active })
        .eq("id", coupon.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Coupon ${coupon.is_active ? "deactivated" : "activated"} successfully`,
      });
      fetchCoupons();
    } catch (error: unknown) {
      const err = error as SupabaseError;
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to update coupon status",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Coupon Management</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Coupon
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">
                {initialData ? 'Edit Coupon' : 'Create New Coupon'}
              </h2>
              <p className="text-muted-foreground">
                {initialData ? 'Update the coupon details below.' : 'Fill in the details to create a new coupon.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Coupon Code</Label>
                <Input
                  id="code"
                  required
                  placeholder="e.g., SUMMER2024"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select
                  value={formData.discount_type}
                  onValueChange={(value: "percentage" | "fixed") => setFormData(prev => ({ ...prev, discount_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Discount Value</Label>
                <Input
                  type="number"
                  required
                  min={0}
                  max={formData.discount_type === "percentage" ? 100 : undefined}
                  value={formData.discount_value}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount_value: Number(e.target.value) }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Usage Limit</Label>
                <Input
                  type="number"
                  required
                  min={1}
                  value={formData.usage_limit}
                  onChange={(e) => setFormData(prev => ({ ...prev, usage_limit: Number(e.target.value) }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Minimum Purchase Amount (₹)</Label>
                <Input
                  type="number"
                  required
                  min={0}
                  value={formData.min_purchase_amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, min_purchase_amount: Number(e.target.value) }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Maximum Discount Amount (₹)</Label>
                <Input
                  type="number"
                  required
                  min={0}
                  value={formData.max_discount_amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_discount_amount: Number(e.target.value) }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Valid From</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.valid_from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.valid_from ? format(new Date(formData.valid_from), "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.valid_from ? new Date(formData.valid_from) : undefined}
                      onSelect={(date) => setFormData(prev => ({ ...prev, valid_from: date?.toISOString() || new Date().toISOString() }))}
                      className="bg-white rounded-md border"
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Valid Until</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.valid_until && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.valid_until ? format(new Date(formData.valid_until), "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.valid_until ? new Date(formData.valid_until) : undefined}
                      onSelect={(date) => setFormData(prev => ({ ...prev, valid_until: date?.toISOString() || new Date().toISOString() }))}
                      className="bg-white rounded-md border"
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter coupon description..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="h-24"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="active">Active Status</Label>
                <div className="text-sm text-muted-foreground">
                  Enable or disable this coupon
                </div>
              </div>
              <Switch
                id="active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onSuccess()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : initialData ? "Update Coupon" : "Create Coupon"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Code</th>
                <th className="text-left py-2">Description</th>
                <th className="text-left py-2">Discount</th>
                <th className="text-left py-2">Min. Purchase</th>
                <th className="text-left py-2">Usage</th>
                <th className="text-left py-2">Valid Until</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="border-b">
                  <td className="py-2">{coupon.code}</td>
                  <td className="py-2">{coupon.description}</td>
                  <td className="py-2">{coupon.discount_type === "percentage" ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`}</td>
                  <td className="py-2">₹{coupon.min_purchase_amount}</td>
                  <td className="py-2">
                    {coupon.times_used}/{coupon.usage_limit || "∞"}
                  </td>
                  <td className="py-2">{format(new Date(coupon.valid_until), "PP")}</td>
                  <td className="py-2">
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-sm",
                        coupon.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      )}
                    >
                      {coupon.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleCouponStatus(coupon)}
                    >
                      {coupon.is_active ? "Deactivate" : "Activate"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default CouponManager; 
