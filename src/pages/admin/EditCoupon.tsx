import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CouponForm } from '@/components/admin/CouponForm';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';

export const EditCouponPage = () => {
  const { id } = useParams();
  const [couponData, setCouponData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const { data, error } = await supabase
          .from('coupons')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setCouponData(data);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch coupon details",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCoupon();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin">⏳</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <CouponForm initialData={couponData} />
    </AdminLayout>
  );
}; 