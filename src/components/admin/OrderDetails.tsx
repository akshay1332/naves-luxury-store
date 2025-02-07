import React from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ExternalLink, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { UserOptions } from "jspdf-autotable";
import { cn } from "@/lib/utils";
import styled from "styled-components";

// Extend jsPDF type to include autoTable
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: UserOptions) => void;
  lastAutoTable: {
    finalY: number;
  };
}

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  size?: string;
  color?: string;
  products: {
    id: string;
    title: string;
    price: number;
    images: string[];
  };
}

interface Order {
  id: string;
  user_id: string;
  status: string;
  total_amount: number;
  shipping_address: any;
  invoice_data: {
    items: OrderItem[];
    custom_printing?: {
      price: number;
    };
    custom_design?: {
      type: string;
      url: string;
      instructions?: string;
    };
  };
  payment_status: string;
  payment_method: string;
  tracking_number?: string;
  created_at: string;
  discount_amount?: number;
  order_status_history?: Array<{
    status: string;
    notes?: string;
    created_at: string;
  }>;
}

interface OrderDetailsProps {
  order: Order;
}

// Move StyledBadge definition before the component
const StyledBadge = styled(Badge)<{ status: string }>`
  ${({ status }) => {
    switch (status) {
      case 'paid':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-red-50 text-red-700 border-red-200';
    }
  }}
`;

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
    
    // Add header with professional styling
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
    
    // Add brand name
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("CUSTOM PRINT", doc.internal.pageSize.width / 2, 25, { align: "center" });
    
    // Add invoice title
    doc.setFontSize(12);
    doc.setTextColor(200, 200, 200);
    doc.text(`INVOICE #${order.id.slice(-6)}`, doc.internal.pageSize.width / 2, 35, { align: "center" });

    // Add decorative line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(20, 45, doc.internal.pageSize.width - 20, 45);

    // Order Information - Filter out N/A values
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text("Order Information", 20, 60);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    // Only include fields that have values
    const orderInfo = [
      ["Order Date:", format(new Date(order.created_at), 'PPP')],
      order.status && ["Order Status:", order.status.toUpperCase()],
      order.payment_method && ["Payment Method:", order.payment_method.toUpperCase()],
      order.payment_status && ["Payment Status:", order.payment_status.toUpperCase()],
      order.tracking_number && ["Tracking Number:", order.tracking_number]
    ].filter(Boolean) as [string, string][];
    
    let currentY = 70;
    orderInfo.forEach((item) => {
      const [label, value] = item;
      doc.setFont("helvetica", "bold");
      doc.text(label, 20, currentY);
      doc.setFont("helvetica", "normal");
      doc.text(value, 80, currentY);
      currentY += 7;
    });

    // Customer Information - Filter out N/A values
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Bill To", 20, currentY + 15);
    
    doc.setFontSize(10);
    if (order.shipping_address) {
      const address = order.shipping_address;
      const customerInfo = [
        address.fullName && ["Name:", address.fullName],
        address.email && ["Email:", address.email],
        address.phone && ["Phone:", address.phone],
        address.address && ["Address:", address.address],
        [
          "",
          [
            address.city,
            address.state,
            address.zipCode
          ].filter(Boolean).join(', ')
        ],
        address.country && ["", address.country]
      ].filter(item => item && item[1]) as [string, string][];
      
      currentY += 25;
      customerInfo.forEach((item) => {
        const [label, value] = item;
        if (label) {
          doc.setFont("helvetica", "bold");
          doc.text(label, 20, currentY);
        }
        doc.setFont("helvetica", "normal");
        doc.text(value, label ? 80 : 80, currentY);
        currentY += 7;
      });
    }

    // Order Items Table
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Order Summary", 20, currentY + 15);

    // Filter out items with missing data
    const tableData = order.invoice_data?.items
      ?.filter(item => item.products?.title && item.quantity)
      ?.map(item => {
        const variants = [
          item.size && `Size: ${item.size}`,
          item.color && `Color: ${item.color}`
        ].filter(Boolean).join(' | ');
        
        const title = variants 
          ? `${item.products.title} (${variants})`
          : item.products.title;

        return [
          title,
          item.quantity.toString(),
          formatIndianPrice(item.products.price),
          formatIndianPrice(item.products.price * item.quantity)
        ];
      }) || [];

    doc.autoTable({
      startY: currentY + 25,
      head: [['Item Description', 'Qty', 'Price', 'Amount']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'left'
      },
      styles: {
        fontSize: 9,
        cellPadding: 5,
        valign: 'middle'
      },
      columnStyles: {
        0: { cellWidth: 'auto', halign: 'left' },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 35, halign: 'right' }
      },
      margin: { left: 20, right: 20 }
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    
    // Summary calculations
    const summaryX = doc.internal.pageSize.width - 90;
    const summaryWidth = 70;
    
    let summaryY = finalY + 10;
    
    // Only show fields with values
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    if (order.total_amount) {
      doc.setFont("helvetica", "normal");
      doc.text("Subtotal:", summaryX, summaryY);
      doc.text(formatIndianPrice(order.total_amount), summaryX + summaryWidth, summaryY, { align: "right" });
      summaryY += 10;
    }

    if (order.invoice_data?.custom_printing?.price > 0) {
      doc.text("Custom Printing:", summaryX, summaryY);
      doc.text(
        formatIndianPrice(order.invoice_data.custom_printing.price),
        summaryX + summaryWidth,
        summaryY,
        { align: "right" }
      );
      summaryY += 10;
    }

    if (order.discount_amount > 0) {
      doc.text("Discount:", summaryX, summaryY);
      doc.setTextColor(255, 0, 0);
      doc.text(
        `-${formatIndianPrice(order.discount_amount)}`,
        summaryX + summaryWidth,
        summaryY,
        { align: "right" }
      );
      summaryY += 10;
    }

    // Final total
    summaryY += 5;
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Total Amount:", summaryX, summaryY);
    doc.text(
      formatIndianPrice(
        (order.total_amount || 0) +
        (order.invoice_data?.custom_printing?.price || 0) -
        (order.discount_amount || 0)
      ),
      summaryX + summaryWidth,
      summaryY,
      { align: "right" }
    );

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    
    // Footer line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(20, pageHeight - 30, doc.internal.pageSize.width - 20, pageHeight - 30);
    
    // Footer text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      "Thank you for shopping with Custom Print",
      doc.internal.pageSize.width / 2,
      pageHeight - 20,
      { align: "center" }
    );

    // Save with formatted name
    const orderNumber = order.id.slice(-6);
    const dateStr = format(new Date(order.created_at), 'yyyy-MM-dd');
    const fileName = `CustomPrint-Invoice-${orderNumber}-${dateStr}`;
    doc.save(`${fileName}.pdf`);
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
                  <StyledBadge status={order.payment_status}>
                    {order.payment_status}
                  </StyledBadge>
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
                    <TableHeader className="w-[60%]">Order Details</TableHeader>
                    <TableHeader className="text-right">Amount</TableHeader>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.invoice_data?.items?.map((item) => {
                    const itemPrice = item.products?.price || 0;
                    const itemQuantity = item.quantity || 0;
                    const itemTotal = itemPrice * itemQuantity;

                    return (
                      <TableRow key={`${item.products?.id}-${item.size}-${item.color}`}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {item.products?.title}
                              <span className="text-gray-500 ml-2">× {itemQuantity}</span>
                            </div>
                            <div className="text-sm text-gray-500 space-x-2">
                              {item.size && <span>Size: {item.size}</span>}
                              {item.color && <span>• Color: {item.color}</span>}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-medium text-gray-900">
                            ₹{itemTotal.toLocaleString('en-IN')}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {/* Summary Section */}
                  <TableRow className="bg-gray-50">
                    <TableCell className="text-right font-medium">
                      Subtotal
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{order.total_amount?.toLocaleString('en-IN') || 0}
                    </TableCell>
                  </TableRow>

                  {order.discount_amount > 0 && (
                    <TableRow className="bg-gray-50">
                      <TableCell className="text-right font-medium text-green-600">
                        Discount Applied
                      </TableCell>
                      <TableCell className="text-right font-medium text-green-600">
                        -₹{order.discount_amount.toLocaleString('en-IN')}
                      </TableCell>
                    </TableRow>
                  )}

                  <TableRow className="bg-gray-100 border-t-2 border-gray-200">
                    <TableCell className="text-right font-bold text-lg">
                      Total Amount
                    </TableCell>
                    <TableCell className="text-right font-bold text-lg">
                      ₹{((order.total_amount || 0) - 
                         (order.discount_amount || 0)
                        ).toLocaleString('en-IN')}
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
