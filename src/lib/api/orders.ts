import { supabase } from "@/integrations/supabase/client";
import { Order, OrderStatus } from "@/types/orders";
import { CustomDesign, CustomDesignInput } from "@/types/custom-design";

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  notes?: string
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select()
    .single();

  if (orderError) throw orderError;

  // Create status history entry
  const { error: historyError } = await supabase
    .from("order_status_history")
    .insert({
      order_id: orderId,
      status,
      notes,
      changed_by: user.id
    });

  if (historyError) throw historyError;

  // Create notification for user
  const { error: notificationError } = await supabase
    .from("notifications")
    .insert({
      user_id: order.user_id,
      title: "Order Status Updated",
      message: `Your order #${order.invoice_number} status has been updated to ${status}`,
      type: "order_update"
    });

  if (notificationError) throw notificationError;

  return order;
}

export async function createCustomDesign(
  orderId: string,
  design: CustomDesignInput
): Promise<CustomDesign> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  let fileUrl = "";

  if ("file" in design) {
    const fileName = `${orderId}/${design.file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("custom-designs")
      .upload(fileName, design.file);

    if (uploadError) throw uploadError;
    fileUrl = uploadData.path;
  } else {
    fileUrl = design.url;
  }

  const { data, error } = await supabase
    .from("custom_designs")
    .insert({
      order_id: orderId,
      user_id: user.id,
      design_type: "file" in design ? "upload" : "link",
      file_url: fileUrl,
      original_filename: "file" in design ? design.file.name : undefined,
      file_size: "file" in design ? design.file.size : undefined,
      mime_type: "file" in design ? design.file.type : undefined,
      instructions: design.instructions
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getOrderWithDetails(orderId: string): Promise<Order> {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      custom_designs (*),
      order_status_history (
        status,
        notes,
        changed_by,
        created_at
      )
    `)
    .eq("id", orderId)
    .single();

  if (error) throw error;
  return data;
}

export async function getOrderStatusHistory(orderId: string) {
  const { data, error } = await supabase
    .from("order_status_history")
    .select(`
      *,
      changed_by_user:changed_by (
        email,
        full_name
      )
    `)
    .eq("order_id", orderId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
} 