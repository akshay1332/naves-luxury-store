import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface ShippingAddressFormProps {
  shippingAddress: ShippingAddress;
  setShippingAddress: (address: ShippingAddress) => void;
}

export const ShippingAddressForm = ({
  shippingAddress,
  setShippingAddress,
}: ShippingAddressFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Shipping Address
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Full Name"
          value={shippingAddress.fullName}
          onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
          required
        />
        <Input
          placeholder="Address"
          value={shippingAddress.address}
          onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="City"
            value={shippingAddress.city}
            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
            required
          />
          <Input
            placeholder="State"
            value={shippingAddress.state}
            onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="ZIP Code"
            value={shippingAddress.zipCode}
            onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
            required
          />
          <Input
            placeholder="Country"
            value={shippingAddress.country}
            onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
            required
          />
        </div>
      </CardContent>
    </Card>
  );
};