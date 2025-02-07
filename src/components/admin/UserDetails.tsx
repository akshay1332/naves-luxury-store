import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Mail, Phone, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface UserDetailsProps {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  phone_number?: string;
  shipping_addresses?: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }[];
  orders?: {
    id: string;
    invoice_number: string;
    created_at: string;
    total_amount: number;
    status: string;
  }[];
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

export function UserDetails({ userId, open, onOpenChange }: UserDetailsProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId && open) {
      fetchUserProfile(userId);
    }
  }, [userId, open]);

  const fetchUserProfile = async (id: string) => {
    try {
      setLoading(true);
      
      // Fetch user profile with specific fields
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          phone_number,
          address,
          city,
          state,
          country,
          created_at,
          updated_at
        `)
        .eq('id', id)
        .single();

      if (userError) throw userError;

      // Fetch user's orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('id, invoice_number, created_at, total_amount, status')
        .eq('user_id', id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      setUserProfile({
        ...userData,
        orders: ordersData
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add formatCurrency function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
      .replace('₹', '₹ '); // Add space after rupee symbol
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="sticky top-0 bg-white z-10 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Customer Details
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : userProfile ? (
          <div className="space-y-6 p-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{userProfile?.full_name || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="break-all">{userProfile?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{userProfile?.phone_number || 'Not provided'}</span>
                </div>
              </div>
            </div>

            {/* Shipping Addresses */}
            {userProfile.shipping_addresses && userProfile.shipping_addresses.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Shipping Addresses</h3>
                <div className="space-y-4">
                  {userProfile.shipping_addresses.map((address, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 rounded-md border">
                      <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                      <div>
                        <p>{address.address}</p>
                        <p>{address.city}, {address.state} {address.zipCode}</p>
                        <p>{address.country}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order History - Updated with Indian currency */}
            {userProfile.orders && userProfile.orders.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Order History</h3>
                <ScrollArea className="h-[200px] rounded-md border">
                  <div className="p-4">
                    <table className="w-full">
                      <thead>
                        <tr className="text-sm text-gray-500">
                          <th className="text-left pb-2">Invoice #</th>
                          <th className="text-left pb-2">Date</th>
                          <th className="text-left pb-2">Status</th>
                          <th className="text-right pb-2">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userProfile.orders.map((order) => (
                          <tr key={order.id} className="border-t">
                            <td className="py-2">{order.invoice_number}</td>
                            <td className="py-2">
                              {new Date(order.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-2">
                              <span className="capitalize">{order.status}</span>
                            </td>
                            <td className="py-2 text-right font-medium">
                              {formatCurrency(order.total_amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            User not found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 