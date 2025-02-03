import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { SEO } from '@/components/SEO';

export default function AdminSettings() {
  return (
    <AdminLayout>
      <SEO 
        title="Settings - Admin Dashboard | CustomPrint"
        description="Manage your store settings and configurations"
      />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        </div>

        <div className="grid gap-6">
          {/* Store Settings */}
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Store Settings</h2>
            <div className="space-y-4">
              {/* Add your settings form components here */}
              <p className="text-gray-500 dark:text-gray-400">
                Store settings configuration will be implemented soon.
              </p>
            </div>
          </div>

          {/* Payment Settings */}
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Payment Settings</h2>
            <div className="space-y-4">
              {/* Add your payment settings form components here */}
              <p className="text-gray-500 dark:text-gray-400">
                Payment settings configuration will be implemented soon.
              </p>
            </div>
          </div>

          {/* Shipping Settings */}
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Shipping Settings</h2>
            <div className="space-y-4">
              {/* Add your shipping settings form components here */}
              <p className="text-gray-500 dark:text-gray-400">
                Shipping settings configuration will be implemented soon.
              </p>
            </div>
          </div>

          {/* Email Settings */}
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Email Settings</h2>
            <div className="space-y-4">
              {/* Add your email settings form components here */}
              <p className="text-gray-500 dark:text-gray-400">
                Email settings configuration will be implemented soon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 