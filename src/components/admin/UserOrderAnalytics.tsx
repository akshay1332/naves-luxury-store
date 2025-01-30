import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";

interface UserAnalyticsProps {
  analytics: {
    total_orders: number;
    total_spent: number;
    avg_order_value: number;
    most_ordered_product: {
      title: string;
      order_count: number;
      total_quantity: number;
    };
    custom_designs_count: number;
    completed_orders: number;
    pending_orders: number;
    cancelled_orders: number;
    cod_orders: number;
    online_orders: number;
    last_order_date: string;
    customer_type: string;
    customer_value: string;
  };
}

export function UserOrderAnalytics({ analytics }: UserAnalyticsProps) {
  const totalOrders = analytics.completed_orders + analytics.pending_orders + analytics.cancelled_orders;
  const completionRate = (analytics.completed_orders / totalOrders) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Customer Status */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Customer Status</h3>
            <Badge variant={analytics.customer_type === 'VIP' ? 'default' : 'secondary'}>
              {analytics.customer_type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Customer Value:</span>
              <Badge variant="outline">{analytics.customer_value}</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total Spent:</span>
              <span className="font-semibold">{formatPrice(analytics.total_spent)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Statistics */}
      <Card>
        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold">Order Statistics</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Order Completion Rate</span>
                <span className="text-sm font-semibold">{completionRate.toFixed(1)}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Orders</span>
                <p className="font-semibold">{totalOrders}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Avg. Order Value</span>
                <p className="font-semibold">{formatPrice(analytics.avg_order_value)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Completed</span>
                <p className="font-semibold text-green-600">{analytics.completed_orders}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Pending</span>
                <p className="font-semibold text-yellow-600">{analytics.pending_orders}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Cancelled</span>
                <p className="font-semibold text-red-600">{analytics.cancelled_orders}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Custom Designs</span>
                <p className="font-semibold">{analytics.custom_designs_count}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold">Payment Methods</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">COD Orders</span>
              <Badge variant="outline">{analytics.cod_orders}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Online Payments</span>
              <Badge variant="outline">{analytics.online_orders}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Most Ordered Product */}
      <Card>
        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold">Most Popular Item</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm font-medium">{analytics.most_ordered_product.title}</p>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Ordered</span>
              <span>{analytics.most_ordered_product.order_count} times</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Quantity</span>
              <span>{analytics.most_ordered_product.total_quantity} units</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground text-center">
        Last order: {new Date(analytics.last_order_date).toLocaleDateString()}
      </div>
    </motion.div>
  );
} 