import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, DollarSign, Package, CreditCard, AlertCircle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { format } from "date-fns";

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  codOrders: number;
  onlinePayments: number;
  pendingPayments: number;
  dailySales: {
    date: string;
    revenue: number;
    orders: number;
  }[];
  paymentMethods: {
    method: string;
    count: number;
    amount: number;
  }[];
}

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    codOrders: 0,
    onlinePayments: 0,
    pendingPayments: 0,
    dailySales: [],
    paymentMethods: [],
  });

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch orders with payment information
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Process orders data
      const processedData: AnalyticsData = {
        totalRevenue: 0,
        totalOrders: orders?.length || 0,
        codOrders: 0,
        onlinePayments: 0,
        pendingPayments: 0,
        dailySales: [],
        paymentMethods: [],
      };

      // Create a map to store daily sales
      const dailySalesMap = new Map();
      const paymentMethodsMap = new Map();

      orders?.forEach((order) => {
        // Calculate totals
        processedData.totalRevenue += order.total_amount;
        
        // Count payment methods
        if (order.payment_method === 'cod') {
          processedData.codOrders++;
        } else {
          processedData.onlinePayments++;
        }

        // Count pending payments
        if (order.status === 'pending' || order.status === 'processing') {
          processedData.pendingPayments += order.total_amount;
        }

        // Group by date for daily sales
        const date = format(new Date(order.created_at), 'yyyy-MM-dd');
        const existingDate = dailySalesMap.get(date) || { revenue: 0, orders: 0 };
        dailySalesMap.set(date, {
          revenue: existingDate.revenue + order.total_amount,
          orders: existingDate.orders + 1,
        });

        // Group by payment method
        const method = order.payment_method || 'unknown';
        const existingMethod = paymentMethodsMap.get(method) || { count: 0, amount: 0 };
        paymentMethodsMap.set(method, {
          count: existingMethod.count + 1,
          amount: existingMethod.amount + order.total_amount,
        });
      });

      // Convert daily sales map to array
      processedData.dailySales = Array.from(dailySalesMap.entries()).map(([date, data]) => ({
        date,
        ...data,
      }));

      // Convert payment methods map to array
      processedData.paymentMethods = Array.from(paymentMethodsMap.entries()).map(([method, data]) => ({
        method,
        ...data,
      }));

      setData(processedData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
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
        <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{data.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-gray-500">Lifetime revenue</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalOrders}</div>
              <p className="text-xs text-gray-500">All time orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Online vs COD</CardTitle>
              <CreditCard className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.onlinePayments} / {data.codOrders}</div>
              <p className="text-xs text-gray-500">Online / Cash on Delivery</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <AlertCircle className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{data.pendingPayments.toFixed(2)}</div>
              <p className="text-xs text-gray-500">Yet to be collected</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.dailySales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                      formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Revenue']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.paymentMethods}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="method" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Amount']}
                    />
                    <Bar dataKey="amount" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
} 