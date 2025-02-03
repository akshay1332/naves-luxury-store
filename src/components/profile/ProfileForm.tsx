import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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

export function ProfileForm({ user }: { user: ProfileData }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = {
        id: user.id, // Add the required id field
        full_name: e.currentTarget.full_name.value,
        phone_number: e.currentTarget.phone_number.value,
        address: e.currentTarget.address.value,
        city: e.currentTarget.city.value,
        state: e.currentTarget.state.value,
        country: e.currentTarget.country.value,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          defaultValue={user.full_name || ""}
          required
        />
      </div>
      <div>
        <Label htmlFor="phone_number">Phone Number</Label>
        <Input
          id="phone_number"
          defaultValue={user.phone_number || ""}
        />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          defaultValue={user.address || ""}
        />
      </div>
      <div>
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          defaultValue={user.city || ""}
        />
      </div>
      <div>
        <Label htmlFor="state">State</Label>
        <Input
          id="state"
          defaultValue={user.state || ""}
        />
      </div>
      <div>
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          defaultValue={user.country || ""}
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Profile"}
      </Button>
    </form>
  );
}
