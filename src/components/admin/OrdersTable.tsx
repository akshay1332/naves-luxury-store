import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import OrderDetails from "./OrderDetails";
import { UserDetails } from "./UserDetails";
import { MoreHorizontal, Eye, User, Palette, Trash2, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";
import { updateOrderStatus } from "@/lib/api/orders";

type Order = Database["public"]["Tables"]["orders"]["Row"] & {
  invoice_data: {
    items: Array<{
      products: {
        id: string;
        title: string;
        price: number;
        images?: string[];
      };
      quantity: number;
    }>;
    payment_method: string;
    custom_design?: {
      type: "upload" | "link";
      url: string;
      instructions?: string;
    };
  };
  shipping_address: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
};

interface OrdersTableProps {
  orders: Order[];
  onOrderDeleted?: () => void;
}

const ORDER_STATUSES = [
  'pending',
  'processing',
  'completed',
  'cancelled',
  'refunded'
] as const;

export function OrdersTable({ orders, onOrderDeleted }: OrdersTableProps) {
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleViewUser = (userId: string) => {
    setSelectedUserId(userId);
    setShowUserDetails(true);
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order deleted successfully",
      });

      if (onOrderDeleted) {
        onOrderDeleted();
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete order",
      });
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
      if (onOrderDeleted) onOrderDeleted();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update order status",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500 hover:bg-green-600';
      case 'processing':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'cancelled':
        return 'bg-red-500 hover:bg-red-600';
      case 'refunded':
        return 'bg-orange-500 hover:bg-orange-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Custom Design</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">
                {order.invoice_number || order.id.slice(0, 8)}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{order.shipping_address.fullName}</span>
                  <span className="text-sm text-gray-500">{order.shipping_address.email}</span>
                </div>
              </TableCell>
              <TableCell>₹{order.total_amount.toLocaleString('en-IN')}</TableCell>
              <TableCell>
                {format(new Date(order.created_at), "PPP")}
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(order.status || 'pending')}>
                  {(order.status || 'PENDING').toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>
                {order.invoice_data?.custom_design ? (
                  <Badge variant="default" className="bg-cyan-500">
                    <Palette className="h-3 w-3 mr-1" />
                    Yes
                  </Badge>
                ) : (
                  <Badge variant="secondary">No</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Order
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleViewUser(order.user_id)}>
                      <User className="h-4 w-4 mr-2" />
                      View Customer
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Update Status
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        {ORDER_STATUSES.map((status) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => handleUpdateStatus(order.id, status)}
                            className={status === order.status ? "bg-gray-100" : ""}
                          >
                            <Badge className={`${getStatusColor(status)} mr-2`}>
                              {status.toUpperCase()}
                            </Badge>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteOrder(order.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Order
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <OrderDetails
        order={selectedOrder}
        open={showOrderDetails}
        onOpenChange={setShowOrderDetails}
      />

      <UserDetails
        userId={selectedUserId}
        open={showUserDetails}
        onOpenChange={setShowUserDetails}
      />
    </div>
  );
} 
