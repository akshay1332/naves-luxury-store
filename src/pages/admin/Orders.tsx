import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { Loader2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          shipping_address,
          invoice_data,
          user:user_id (
            id,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Order Management</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              Total Orders: {orders.length}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <OrdersTable orders={orders} onOrderDeleted={fetchOrders} />
        </div>
      </div>
    </AdminLayout>
  );
}