import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export async function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK');
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export async function createRazorpayOrder(amount: number, orderId: string) {
  try {
    const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
      body: { amount, orderId }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Failed to create payment order');
  }
}

export function initializeRazorpayPayment(options: any): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.success', resolve);
      rzp.on('payment.error', reject);
      rzp.open();
    } catch (error) {
      reject(error);
    }
  });
}