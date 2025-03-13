import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tag, X } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Coupon {
  id: string;
  code: string;
  description: string;
  discount_percentage: number;
  min_purchase_amount: number;
  max_discount_amount: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  category: string;
}

interface CouponSelectorProps {
  productIds: string[];
  subtotal: number;
  onApplyCoupon: (coupon: Coupon | null) => void;
  appliedCoupon: Coupon | null;
}

export const CouponSelector = ({ productIds, subtotal, onApplyCoupon, appliedCoupon }: CouponSelectorProps) => {
  const { toast } = useToast();
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAvailableCoupons = async () => {
    try {
      setLoading(true);
      
      // Get coupons through coupon_products table with proper joins
      const { data: couponProducts, error } = await supabase
        .from('coupon_products')
        .select(`
          coupon_id,
          product_id,
          coupons (
            id,
            code,
            description,
            category,
            discount_percentage,
            min_purchase_amount,
            max_discount_amount,
            valid_from,
            valid_until,
            is_active,
            usage_limit,
            times_used
          )
        `)
        .in('product_id', productIds)
        .not('coupons', 'is', null);

      if (error) {
        throw error;
      }

      // Filter valid coupons
      const now = new Date();
      const validCoupons = couponProducts
        ?.map(cp => cp.coupons)
        .filter((coupon): coupon is Coupon => {
          if (!coupon) return false;

          const isValid = 
            coupon.is_active && 
            new Date(coupon.valid_from) <= now &&
            new Date(coupon.valid_until) >= now &&
            coupon.min_purchase_amount <= subtotal &&
            (coupon.usage_limit === 0 || coupon.times_used < coupon.usage_limit);

          return isValid;
        })
        // Remove duplicates
        .filter((coupon, index, self) => 
          index === self.findIndex(c => c.id === coupon.id)
        )
        // Sort by highest discount first
        .sort((a, b) => b.discount_percentage - a.discount_percentage);

      console.log('Available coupons:', validCoupons); // For debugging
      setAvailableCoupons(validCoupons || []);

    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch available coupons",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productIds.length > 0) {
      fetchAvailableCoupons();
    }
  }, [productIds, subtotal]);

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Available Coupons</h3>
        {appliedCoupon && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onApplyCoupon(null)}
            className="text-red-500 hover:text-red-600"
          >
            <X className="h-4 w-4 mr-2" />
            Remove Coupon
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin">⏳</div>
        </div>
      ) : appliedCoupon ? (
        <div className="bg-gray-50 p-3 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{appliedCoupon.code}</Badge>
              <span className="text-sm text-green-600 font-medium">
                {appliedCoupon.discount_percentage}% off
              </span>
            </div>
            <Badge variant="outline">{appliedCoupon.category}</Badge>
          </div>
          <p className="text-sm text-gray-600">{appliedCoupon.description}</p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Min. order: ₹{appliedCoupon.min_purchase_amount}</span>
            <span>Max discount: ₹{appliedCoupon.max_discount_amount}</span>
          </div>
        </div>
      ) : (
        <>
          <Select onValueChange={(id) => {
            const coupon = availableCoupons.find(c => c.id === id);
            if (coupon) onApplyCoupon(coupon);
          }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a coupon to apply" />
            </SelectTrigger>
            <SelectContent>
              {availableCoupons.map((coupon) => (
                <SelectItem key={coupon.id} value={coupon.id}>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{coupon.code}</Badge>
                        <span className="text-sm font-medium">
                          {coupon.discount_percentage}% off
                        </span>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {coupon.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{coupon.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Min: ₹{coupon.min_purchase_amount}</span>
                      <span>Max: ₹{coupon.max_discount_amount}</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
              {availableCoupons.length === 0 && (
                <SelectItem value="none" disabled>
                  No coupons available for these products
                </SelectItem>
              )}
            </SelectContent>
          </Select>

          {availableCoupons.length > 0 && (
            <p className="text-xs text-gray-500">
              * Select a coupon to apply discount to your order
            </p>
          )}
        </>
      )}
    </Card>
  );
}; 