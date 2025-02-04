import React from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Order } from "@/types/orders";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ExternalLink, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { UserOptions } from "jspdf-autotable";
import { cn } from "@/lib/utils";

// Extend jsPDF type to include autoTable
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: UserOptions) => void;
  lastAutoTable: {
    finalY: number;
  };
}

interface OrderDetailsProps {
  order: Order;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  if (!order) {
    return (
      <div className="p-6">
        <p>No order details available</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
      processing: "bg-blue-50 text-blue-700 border border-blue-200",
      shipped: "bg-purple-50 text-purple-700 border border-purple-200",
      delivered: "bg-green-50 text-green-700 border border-green-200",
      cancelled: "bg-red-50 text-red-700 border border-red-200",
      refunded: "bg-gray-50 text-gray-700 border border-gray-200",
    };
    return colors[status as keyof typeof colors] || "bg-gray-50 text-gray-700 border border-gray-200";
  };

  // Format amount in Indian Rupees
  const formatIndianPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const downloadPDF = () => {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    
    // Add header with logo and branding
    doc.setFillColor(44, 62, 80);
    doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
    
    // Add brand name
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("CUSTOMPRINT", 20, 25);
    
    // Add invoice label
    doc.setFontSize(12);
    doc.setTextColor(200, 200, 200);
    doc.text("LUXURY FASHION INVOICE", 120, 25);

    // Add decorative line
    doc.setDrawColor(255, 215, 0); // Gold color
    doc.setLineWidth(0.5);
    doc.line(20, 45, doc.internal.pageSize.width - 20, 45);

    // Order Information
    doc.setTextColor(44, 62, 80);
    doc.setFontSize(16);
    doc.text("Order Information", 20, 60);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const orderInfo = [
      ["Order ID:", order.id.toString()],
      ["Date:", format(new Date(order.created_at), 'PPP')],
      ["Status:", order.status.toUpperCase()],
      ["Payment Status:", order.payment_status.toUpperCase()]
    ];
    
    orderInfo.forEach((item, index) => {
      const [label, value] = item;
      doc.setFont("helvetica", "bold");
      doc.text(label, 20, 70 + (index * 7));
      doc.setFont("helvetica", "normal");
      doc.text(String(value), 80, 70 + (index * 7));
    });

    // Customer Information
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Customer Details", 20, 105);
    
    doc.setFontSize(10);
    if (order.shipping_address) {
      const customerInfo = [
        ["Name:", order.shipping_address.fullName],
        ["Email:", order.shipping_address.email],
        ["Phone:", order.shipping_address.phone],
        ["Address:", order.shipping_address.address],
        ["", `${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.zipCode}`],
        ["", order.shipping_address.country]
      ];
      
      customerInfo.forEach((item, index) => {
        const [label, value] = item;
        if (label) {
          doc.setFont("helvetica", "bold");
          doc.text(label, 20, 115 + (index * 7));
        }
        doc.setFont("helvetica", "normal");
        doc.text(String(value), label ? 80 : 80, 115 + (index * 7));
      });
    }

    // Order Items Table
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Order Summary", 20, 160);

    const tableData = order.invoice_data?.items?.filter(item => item && item.product).map(item => [
      item.product?.title || 'Unknown Product',
      (item.quantity || 0).toString(),
      formatIndianPrice(item.product?.price || 0),
      formatIndianPrice((item.product?.price || 0) * (item.quantity || 0))
    ]) || [];

    doc.autoTable({
      startY: 170,
      head: [['Product', 'Quantity', 'Price', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [44, 62, 80],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 9,
        cellPadding: 5,
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 30, halign: 'center' },
        2: { cellWidth: 40, halign: 'right' },
        3: { cellWidth: 40, halign: 'right' },
      },
    });

    // Add totals
    const finalY = doc.lastAutoTable.finalY + 10;
    
    // Add summary box
    doc.setDrawColor(44, 62, 80);
    doc.setLineWidth(0.1);
    doc.rect(120, finalY, 70, 35);
    
    // Add summary content
    doc.setFontSize(10);
    doc.setTextColor(44, 62, 80);
    
    doc.setFont("helvetica", "normal");
    doc.text("Subtotal:", 125, finalY + 10);
    doc.text(formatIndianPrice(order.total_amount || 0), 185, finalY + 10, { align: 'right' });
    
    if (order.discount_amount && order.discount_amount > 0) {
      doc.text("Discount:", 125, finalY + 20);
      doc.setTextColor(255, 0, 0);
      doc.text(`-${formatIndianPrice(order.discount_amount)}`, 185, finalY + 20, { align: 'right' });
    }
    
    doc.setTextColor(44, 62, 80);
    doc.setFont("helvetica", "bold");
    doc.text("Total:", 125, finalY + 30);
    doc.text(
      formatIndianPrice((order.total_amount || 0) - (order.discount_amount || 0)),
      185,
      finalY + 30,
      { align: 'right' }
    );

    // Add footer
    const pageHeight = doc.internal.pageSize.height;
    
    // Add decorative line
    doc.setDrawColor(44, 62, 80);
    doc.setLineWidth(0.5);
    doc.line(20, pageHeight - 40, doc.internal.pageSize.width - 20, pageHeight - 40);
    
    // Footer text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text("Thank you for shopping with CustomPrint", doc.internal.pageSize.width / 2, pageHeight - 30, { align: "center" });
    doc.text("For any queries, please contact support@customprint.com", doc.internal.pageSize.width / 2, pageHeight - 25, { align: "center" });
    doc.text("www.customprint.com", doc.internal.pageSize.width / 2, pageHeight - 20, { align: "center" });

    // Save the PDF
    doc.save(`CustomPrint-Invoice-${order.id}.pdf`);
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Order Details</h2>
          <Button
            onClick={downloadPDF}
            className="flex items-center gap-2"
            variant="outline"
          >
            <Download className="h-4 w-4" />
            Download Invoice
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Information */}
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold mb-3">Order Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-medium">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">{format(new Date(order.created_at), 'PPP')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <Badge className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    getStatusColor(order.status)
                  )}>
                    {order.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <Badge variant={order.payment_status === 'paid' ? 'default' : 'destructive'}>
                    {order.payment_status}
                  </Badge>
                </div>
                {order.tracking_number && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tracking Number</span>
                    <span className="font-medium">{order.tracking_number}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold mb-3">Customer Information</h3>
              {order.shipping_address && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name</span>
                    <span className="font-medium">{order.shipping_address.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email</span>
                    <span className="font-medium">{order.shipping_address.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone</span>
                    <span className="font-medium">{order.shipping_address.phone}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Shipping Address */}
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold mb-3">Shipping Address</h3>
              {order.shipping_address && (
                <div className="space-y-2">
                  <p className="text-gray-600">
                    {order.shipping_address.address}<br />
                    {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}<br />
                    {order.shipping_address.country}
                  </p>
                </div>
              )}
            </div>

            {/* Custom Design Information */}
            {order.invoice_data?.custom_design && (
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold mb-3">Custom Design</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium capitalize">{order.invoice_data.custom_design.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Design URL</span>
                    <a
                      href={order.invoice_data.custom_design.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                    >
                      View Design <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  {order.invoice_data.custom_design.instructions && (
                    <div className="mt-2">
                      <span className="text-gray-600 block mb-1">Instructions:</span>
                      <p className="text-sm">{order.invoice_data.custom_design.instructions}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold mb-3">Order Items</h3>
      <Table>
        <TableHeader>
          <TableRow>
                    <TableHeader className="w-[40%]">Product</TableHeader>
            <TableHeader>Quantity</TableHeader>
                    <TableHeader>Price</TableHeader>
                    <TableHeader className="text-right">Total</TableHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
                  {order.invoice_data?.items?.filter(item => item && item.product).map((item) => (
                    <TableRow key={item.product?.id || 'unknown'}>
                      <TableCell className="font-medium">
                        {item.product?.title || 'Unknown Product'}
                        {item.size && <span className="text-sm text-gray-500 ml-2">Size: {item.size}</span>}
                        {item.color && <span className="text-sm text-gray-500 ml-2">Color: {item.color}</span>}
                      </TableCell>
                      <TableCell>{item.quantity || 0}</TableCell>
                      <TableCell>{formatIndianPrice(item.product?.price || 0)}</TableCell>
                      <TableCell className="text-right">
                        {formatIndianPrice((item.product?.price || 0) * (item.quantity || 0))}
                      </TableCell>
            </TableRow>
          ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Subtotal
                    </TableCell>
                    <TableCell className="text-right">
                      {formatIndianPrice(order.total_amount || 0)}
                    </TableCell>
                  </TableRow>
                  {order.discount_amount && order.discount_amount > 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium">
                        Discount
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        -{formatIndianPrice(order.discount_amount)}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Total
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {formatIndianPrice((order.total_amount || 0) - (order.discount_amount || 0))}
                    </TableCell>
                  </TableRow>
        </TableBody>
      </Table>
            </div>

            {/* Order History */}
            {order.order_status_history && order.order_status_history.length > 0 && (
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold mb-3">Order History</h3>
                <div className="space-y-3">
                  {order.order_status_history.map((history, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div>
                        <Badge className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          getStatusColor(history.status)
                        )}>
                          {history.status}
                        </Badge>
                        {history.notes && (
                          <p className="text-sm text-gray-600 mt-1">{history.notes}</p>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {format(new Date(history.created_at), 'PPp')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
