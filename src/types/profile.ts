export interface ProfileData {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  is_admin: boolean | null;
  notification_preferences: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}