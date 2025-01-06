import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { User } from "lucide-react";

interface ProfileFormProps {
  profile: {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    phone_number: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
  };
  onProfileUpdate: () => void;
}

export const ProfileForm = ({ profile, onProfileUpdate }: ProfileFormProps) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile.full_name || "",
    phoneNumber: profile.phone_number || "",
    address: profile.address || "",
    city: profile.city || "",
    state: profile.state || "",
    country: profile.country || "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAvatarFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let avatarUrl = profile.avatar_url;
    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop();
      const filePath = `${profile.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile);

      if (uploadError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to upload avatar.",
        });
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      avatarUrl = publicUrl;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: formData.fullName,
        avatar_url: avatarUrl,
        phone_number: formData.phoneNumber,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile.",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Profile updated successfully.",
    });
    setEditing(false);
    onProfileUpdate();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <Button
          variant="outline"
          onClick={() => setEditing(!editing)}
        >
          {editing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      {editing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Avatar</label>
            <div className="flex items-center gap-4">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name || "Avatar"}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <Input
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <Input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Address</label>
            <Input
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter your address"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <Input
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter your city"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">State</label>
              <Input
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Enter your state"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Country</label>
            <Input
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="Enter your country"
            />
          </div>

          <Button type="submit">Save Changes</Button>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name || "Avatar"}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold">
                {profile.full_name || "No name set"}
              </h2>
              <p className="text-gray-500">{profile.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p>{profile.phone_number || "Not set"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Address</p>
              <p>{profile.address || "Not set"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">City</p>
              <p>{profile.city || "Not set"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">State</p>
              <p>{profile.state || "Not set"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Country</p>
              <p>{profile.country || "Not set"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};