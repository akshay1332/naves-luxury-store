import React from 'react';
import { CouponForm } from '@/components/admin/CouponForm';
import AdminLayout from '@/components/admin/AdminLayout';

export const NewCouponPage = () => {
  return (
    <AdminLayout>
      <CouponForm />
    </AdminLayout>
  );
}; 