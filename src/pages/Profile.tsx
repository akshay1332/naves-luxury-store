import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { useTheme } from '@/hooks/useTheme';
import { theme as themeConfig } from '@/styles/theme';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  User, Mail, Phone, MapPin, Camera, 
  Edit2, Save, X, Package, Heart, Clock,
  ShoppingBag, CreditCard
} from 'lucide-react';
import { LuxuryLoader } from '@/components/LuxuryLoader';

interface ThemeProps {
  $currentTheme: 'light' | 'dark';
}

interface ProfileData {
  id: string;
  full_name: string | null;
  email: string;
  phone_number: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  is_admin: boolean | null;
  notification_preferences: Record<string, unknown> | null;
}

interface OrderData {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  order_items: {
    product_id: string;
    product: {
      title: string;
    };
  }[];
}

const PageContainer = styled(motion.div)`
  min-height: calc(100vh - 5rem);
  padding: 2rem;
  margin-top: 5rem;
  background: #ffffff;
`;

const ProfileGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: 350px 1fr;
  }
`;

const Card = styled(motion.div)`
  background: #ffffff;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #000000;
`;

const ProfileHeader = styled(Card)`
  text-align: center;
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto 1.5rem;
`;

const Avatar = styled(motion.div)<ThemeProps & { $imageUrl?: string }>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: ${props => props.$imageUrl 
    ? `url(${props.$imageUrl})`
    : props.$currentTheme === 'dark'
      ? themeConfig.dark.elevatedSurface
      : themeConfig.light.elevatedSurface};
  background-size: cover;
  background-position: center;
  border: 4px solid ${props => props.$currentTheme === 'dark'
    ? themeConfig.dark.primaryAccent
    : themeConfig.light.primaryAccent};
`;

const EditButton = styled(motion.button)<ThemeProps>`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.$currentTheme === 'dark'
    ? themeConfig.dark.primaryAccent
    : themeConfig.light.primaryAccent};
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${props => props.$currentTheme === 'dark'
    ? themeConfig.dark.shadows.default
    : themeConfig.light.shadows.default};

  &:hover {
    transform: scale(1.1);
  }
`;

const Name = styled.h1`
  color: #000000;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Email = styled.p`
  color: #000000;
  margin-bottom: 1.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
`;

const StatCard = styled(motion.div)`
  background: #ffffff;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  border: 1px solid #000000;
  
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #000000;
  }
  
  p {
    color: #000000;
    font-size: 0.875rem;
  }
`;

const Section = styled(Card)`
  h2 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: #000000;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #000000;
  border-radius: 0.5rem;
  background: #ffffff;
  color: #000000;
  
  &:focus {
    outline: none;
    border-color: #000000;
    border-width: 2px;
  }
`;

const Button = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #000000;
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background: #1a1a1a;
  }
`;

const OrderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const OrderCard = styled(motion.div)`
  background: #ffffff;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #000000;
  
  h3 {
    font-weight: 600;
    color: #000000;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #000000;
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
  }
`;

const AdminButton = styled(Button)`
  margin-top: 1rem;
  background: #000000;
  
  &:hover {
    background: #1a1a1a;
  }
`;

const Profile = () => {
  const { theme: currentTheme } = useTheme();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    id: '',
    full_name: '',
    email: '',
    phone_number: '',
    address: '',
    city: '',
    state: '',
    country: '',
    avatar_url: '',
    created_at: '',
    updated_at: '',
    is_admin: false,
    notification_preferences: null
  });
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    wishlistCount: 0,
    reviewCount: 0
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
          .eq('id', session.user.id)
      .single();

        if (profileError) throw profileError;
        
        setProfile({
          ...profileData,
          email: session.user.email || ''
        });

        // Fetch orders with correct relationships
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            id,
            created_at,
            status,
            total_amount,
            order_items (
              product_id,
              product:products (
                title
              )
            )
          `)
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(3);

        if (ordersError) throw ordersError;
        setOrders(ordersData || []);

        // Fetch total orders count
        const { count: ordersCount, error: totalOrdersError } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', session.user.id);

        if (totalOrdersError) throw totalOrdersError;

        // Fetch wishlist count
        const { count: wishlistCount, error: wishlistError } = await supabase
          .from('wishlist')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', session.user.id);

        if (wishlistError) throw wishlistError;

        // Fetch reviews count
        const { count: reviewCount, error: reviewsError } = await supabase
          .from('reviews')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', session.user.id);

        if (reviewsError) throw reviewsError;

        setStats({
          totalOrders: ordersCount || 0,
          wishlistCount: wishlistCount || 0,
          reviewCount: reviewCount || 0
        });

      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile data',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [toast]);

  const handleSave = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          phone_number: profile.phone_number,
          address: profile.address,
          city: profile.city,
          state: profile.state,
          country: profile.country,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.user.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Profile updated successfully'
      });
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
      .replace('₹', '₹ ');
  };

  if (loading) return <LuxuryLoader />;

  return (
    <PageContainer
      $currentTheme={currentTheme}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <ProfileGrid>
        <div>
          <ProfileHeader $currentTheme={currentTheme}>
            <AvatarContainer>
              <Avatar
                $currentTheme={currentTheme}
                $imageUrl={profile.avatar_url || undefined}
                whileHover={{ scale: 1.05 }}
              />
              <EditButton
                $currentTheme={currentTheme}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Camera size={20} />
              </EditButton>
            </AvatarContainer>
            <Name $currentTheme={currentTheme}>{profile.full_name || 'No Name Set'}</Name>
            <Email $currentTheme={currentTheme}>{profile.email}</Email>
            <Button
              $currentTheme={currentTheme}
              onClick={() => setEditing(!editing)}
              whileTap={{ scale: 0.98 }}
            >
              {editing ? (
                <>
                  <X size={18} />
                  Cancel Editing
                </>
              ) : (
                <>
                  <Edit2 size={18} />
                  Edit Profile
                </>
              )}
            </Button>

            {profile.is_admin && (
              <AdminButton
                $currentTheme={currentTheme}
                onClick={() => window.location.href = '/admin'}
                whileTap={{ scale: 0.98 }}
              >
                <User size={18} />
                Admin Dashboard
              </AdminButton>
            )}

            <StatsGrid>
              <StatCard
                $currentTheme={currentTheme}
                whileHover={{ y: -5 }}
              >
                <h3>{stats.totalOrders}</h3>
                <p>Orders</p>
              </StatCard>
              <StatCard
                $currentTheme={currentTheme}
                whileHover={{ y: -5 }}
              >
                <h3>{stats.wishlistCount}</h3>
                <p>Wishlist</p>
              </StatCard>
              <StatCard
                $currentTheme={currentTheme}
                whileHover={{ y: -5 }}
              >
                <h3>{stats.reviewCount}</h3>
                <p>Reviews</p>
              </StatCard>
            </StatsGrid>
          </ProfileHeader>
        </div>

        <div className="space-y-6">
          <Section $currentTheme={currentTheme}>
            <h2>
              <User size={20} />
              Personal Information
            </h2>
            <AnimatePresence mode="wait">
              {editing ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Input
                    $currentTheme={currentTheme}
                    value={profile.full_name || ''}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    placeholder="Full Name"
                  />
                  <Input
                    $currentTheme={currentTheme}
                    value={profile.phone_number || ''}
                    onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                    placeholder="Phone Number"
                  />
                  <Input
                    $currentTheme={currentTheme}
                    value={profile.address || ''}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    placeholder="Address"
                  />
                  <Input
                    $currentTheme={currentTheme}
                    value={profile.city || ''}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    placeholder="City"
                  />
                  <Input
                    $currentTheme={currentTheme}
                    value={profile.state || ''}
                    onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                    placeholder="State"
                  />
                  <Input
                    $currentTheme={currentTheme}
                    value={profile.country || ''}
                    onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                    placeholder="Country"
                  />
                  <Button
                    $currentTheme={currentTheme}
                    onClick={handleSave}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Save size={18} />
                    Save Changes
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <Phone size={20} />
                    <span>{profile.phone_number || 'No phone number added'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={20} />
                    <span>
                      {[profile.address, profile.city, profile.state, profile.country]
                        .filter(Boolean)
                        .join(', ') || 'No address added'}
                    </span>
      </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Section>

          <Section $currentTheme={currentTheme}>
            <h2>
              <Package size={20} />
              Recent Orders
            </h2>
            <OrderGrid>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <OrderCard
                    key={order.id}
                    $currentTheme={currentTheme}
                    whileHover={{ y: -5 }}
                  >
                    <h3>Order #{order.id.slice(-6)}</h3>
                    <p>
                      {order.order_items?.[0]?.product?.title || 'Custom Product'}
                      {order.order_items?.length > 1 && 
                        ` + ${order.order_items.length - 1} more items`}
                    </p>
                    <p>Status: {order.status}</p>
                    <p className="text-lg font-semibold">{formatCurrency(order.total_amount)}</p>
                    <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                  </OrderCard>
                ))
              ) : (
                <p className="text-center col-span-full py-4">No orders yet</p>
              )}
            </OrderGrid>
          </Section>
    </div>
      </ProfileGrid>
    </PageContainer>
  );
};

export default Profile;