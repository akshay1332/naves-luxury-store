import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package, User, Truck, CreditCard, Palette, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Database } from "@/integrations/supabase/types";
import { formatIndianPrice } from "@/lib/utils";
import { Table, TableHeader, TableBody, TableCell, TableRow } from "@/components/ui/table";

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

interface OrderDetailsProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetails({ order, open, onOpenChange }: OrderDetailsProps) {
  if (!order) return null;

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `custom-design-${order.invoice_number}${url.substring(url.lastIndexOf('.'))}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Details - {order.invoice_number}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 p-4">
          {/* Order Status */}
          <div className="col-span-2">
            <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
              {order.status?.toUpperCase()}
            </Badge>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </h3>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {order.shipping_address.fullName}</p>
              <p><span className="font-medium">Email:</span> {order.shipping_address.email}</p>
              <p><span className="font-medium">Phone:</span> {order.shipping_address.phone}</p>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Shipping Information
            </h3>
            <div className="space-y-2">
              <p><span className="font-medium">Address:</span> {order.shipping_address.address}</p>
              <p><span className="font-medium">City:</span> {order.shipping_address.city}</p>
              <p><span className="font-medium">State:</span> {order.shipping_address.state}</p>
              <p><span className="font-medium">PIN Code:</span> {order.shipping_address.zipCode}</p>
              <p><span className="font-medium">Country:</span> {order.shipping_address.country}</p>
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Information
            </h3>
            <div className="space-y-2">
              <p><span className="font-medium">Payment Method:</span> {order.invoice_data.payment_method.toUpperCase()}</p>
              <p><span className="font-medium">Total Amount:</span> {formatIndianPrice(order.total_amount)}</p>
              {order.discount_amount && order.discount_amount > 0 && (
                <p><span className="font-medium">Discount Applied:</span> {formatIndianPrice(order.discount_amount)}</p>
              )}
            </div>
          </div>

          {/* Custom Design Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Custom Design
            </h3>
            <div className="space-y-4">
              {order.invoice_data.custom_design ? (
                <>
                  <p className="text-green-600 font-medium">Custom Design Requested</p>
                  {order.invoice_data.custom_design.type === 'upload' && order.invoice_data.custom_design.url && (
                    <motion.div 
                      className="relative group rounded-lg overflow-hidden border"
                      whileHover={{ scale: 1.02 }}
                    >
                      <img 
                        src={order.invoice_data.custom_design.url} 
                        alt="Custom Design" 
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleDownload(order.invoice_data.custom_design.url)}
                          className="flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </motion.div>
                  )}
                  {order.invoice_data.custom_design.type === 'link' && order.invoice_data.custom_design.url && (
                    <div className="space-y-2">
                      <p><span className="font-medium">Design Link:</span></p>
                      <div className="flex items-center gap-4">
                        <a 
                          href={order.invoice_data.custom_design.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-500 hover:underline flex items-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View Design
                        </a>
                        {order.invoice_data.custom_design.url.match(/\.(jpg|jpeg|png|gif)$/i) && (
                          <img 
                            src={order.invoice_data.custom_design.url} 
                            alt="Custom Design Preview" 
                            className="w-full h-48 object-cover rounded-lg border mt-2"
                          />
                        )}
                      </div>
                    </div>
                  )}
                  {order.invoice_data.custom_design.instructions && (
                    <div className="mt-4">
                      <p className="font-medium">Special Instructions:</p>
                      <p className="text-gray-600 mt-1">{order.invoice_data.custom_design.instructions}</p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-500">No custom design requested</p>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="col-span-2">
            <h3 className="text-lg font-semibold mb-4">Order Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.invoice_data.items.map((item: any) => (
                  <TableRow key={item.products.id}>
                    <TableCell>{item.products.title}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatIndianPrice(item.products.price)}</TableCell>
                    <TableCell className="text-right">{formatIndianPrice(item.quantity * item.products.price)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 