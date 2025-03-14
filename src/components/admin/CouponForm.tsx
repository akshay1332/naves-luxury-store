import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from 'react-router-dom';
import { CouponProductAssignment } from './CouponProductAssignment';

interface CouponFormData {
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
  one_time_per_user: boolean;
}

export const CouponForm = ({ initialData }: { initialData?: any }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!initialData?.id;

  const form = useForm<CouponFormData>({
    defaultValues: {
      code: initialData?.code || '',
      description: initialData?.description || '',
      category: initialData?.category || '',
      discount_percentage: initialData?.discount_percentage || 0,
      min_purchase_amount: initialData?.min_purchase_amount || 0,
      max_discount_amount: initialData?.max_discount_amount || 0,
      valid_from: initialData?.valid_from ? new Date(initialData.valid_from).toISOString().slice(0, 16) : '',
      valid_until: initialData?.valid_until ? new Date(initialData.valid_until).toISOString().slice(0, 16) : '',
      is_active: initialData?.is_active ?? true,
      usage_limit: initialData?.usage_limit || 0,
      times_used: initialData?.times_used || 0,
      one_time_per_user: initialData?.one_time_per_user || false,
    },
  });

  const onSubmit = async (data: CouponFormData) => {
    setLoading(true);
    try {
      if (isEditMode) {
        const { error } = await supabase
          .from('coupons')
          .update(data)
          .eq('id', initialData.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Coupon updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('coupons')
          .insert([data]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Coupon created successfully",
        });
      }
      navigate('/admin/coupons');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Coupon' : 'Create New Coupon'}
      </h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Coupon Code</Label>
            <Input
              {...form.register("code")}
              placeholder="Enter coupon code"
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Input
              {...form.register("category")}
              placeholder="Enter category"
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label>Discount Percentage</Label>
            <Input
              type="number"
              {...form.register("discount_percentage", { valueAsNumber: true })}
              placeholder="Enter discount percentage"
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label>Minimum Purchase Amount</Label>
            <Input
              type="number"
              {...form.register("min_purchase_amount", { valueAsNumber: true })}
              placeholder="Enter minimum purchase amount"
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label>Maximum Discount Amount</Label>
            <Input
              type="number"
              {...form.register("max_discount_amount", { valueAsNumber: true })}
              placeholder="Enter maximum discount amount"
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label>Usage Limit</Label>
            <Input
              type="number"
              {...form.register("usage_limit", { valueAsNumber: true })}
              placeholder="Enter usage limit"
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label>Valid From</Label>
            <Input
              type="datetime-local"
              {...form.register("valid_from")}
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label>Valid Until</Label>
            <Input
              type="datetime-local"
              {...form.register("valid_until")}
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label>Active Status</Label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={form.watch("is_active")}
                onCheckedChange={(checked) => form.setValue("is_active", checked)}
              />
              <span>{form.watch("is_active") ? "Active" : "Inactive"}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Usage Restrictions</Label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={form.watch("one_time_per_user")}
                onCheckedChange={(checked) => form.setValue("one_time_per_user", checked)}
              />
              <span>One-time use per user</span>
            </div>
            <p className="text-sm text-gray-500">
              If enabled, each user can only use this coupon once
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Input
            {...form.register("description")}
            placeholder="Enter coupon description"
            className="bg-white"
          />
        </div>

        {isEditMode && (
          <div className="mt-8">
            <CouponProductAssignment couponId={initialData.id} />
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/coupons')}
            className="border-black text-black hover:bg-black hover:text-white"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={loading}
            className="bg-black text-white hover:bg-black/90"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                {isEditMode ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              isEditMode ? 'Update Coupon' : 'Create Coupon'
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export type { CouponFormData };