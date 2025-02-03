import React from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Order } from "@/types/orders";

interface OrderDetailsProps {
  order: Order;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Order Details</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeader>Product</TableHeader>
            <TableHeader>Quantity</TableHeader>
            <TableHeader>Price at Time</TableHeader>
            <TableHeader>Total</TableHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          {order.invoice_data?.items.map((item) => (
            <TableRow key={item.product.id}>
              <TableCell>{item.product.title}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.product.price}</TableCell>
              <TableCell>{item.product.price * item.quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderDetails;
