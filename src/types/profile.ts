export interface ProfileData {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean | null;
  created_at: string;
  updated_at: string;
  phone_number: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  notification_preferences: Record<string, unknown> | null;
}