import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export async function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function createRazorpayOrder(amount: number, orderId: string) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
    body: { amount, orderId }
  });

  if (error) throw error;
  return data;
}

export function initializeRazorpayPayment(options: any) {
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay(options);
    rzp.on('payment.success', (response: any) => resolve(response));
    rzp.on('payment.error', (error: any) => reject(error));
    rzp.open();
  });
}