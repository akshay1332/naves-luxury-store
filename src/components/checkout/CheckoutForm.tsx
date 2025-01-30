import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Truck, CreditCard, Upload, Link as LinkIcon, AlertCircle } from "lucide-react";

interface CheckoutFormData {
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: "card" | "upi" | "cod";
  wantCustomDesign: boolean;
  customDesignType: "upload" | "link" | null;
  customDesignFile?: File | null;
  customDesignLink?: string;
  specialInstructions?: string;
}

interface CheckoutFormProps {
  formData: CheckoutFormData;
  setFormData: React.Dispatch<React.SetStateAction<CheckoutFormData>>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  uploadProgress: number;
}

export function CheckoutForm({
  formData,
  setFormData,
  handleFileChange,
  uploadProgress,
}: CheckoutFormProps) {
  return (
    <>
      {/* Shipping Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Shipping Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.shippingAddress.fullName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  shippingAddress: {
                    ...prev.shippingAddress,
                    fullName: e.target.value,
                  },
                }))
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.shippingAddress.email}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  shippingAddress: {
                    ...prev.shippingAddress,
                    email: e.target.value,
                  },
                }))
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.shippingAddress.phone}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  shippingAddress: {
                    ...prev.shippingAddress,
                    phone: e.target.value,
                  },
                }))
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.shippingAddress.address}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  shippingAddress: {
                    ...prev.shippingAddress,
                    address: e.target.value,
                  },
                }))
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.shippingAddress.city}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  shippingAddress: {
                    ...prev.shippingAddress,
                    city: e.target.value,
                  },
                }))
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Select
              value={formData.shippingAddress.state}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  shippingAddress: {
                    ...prev.shippingAddress,
                    state: value,
                  },
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maharashtra">Maharashtra</SelectItem>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="karnataka">Karnataka</SelectItem>
                <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                <SelectItem value="gujarat">Gujarat</SelectItem>
                <SelectItem value="west-bengal">West Bengal</SelectItem>
                <SelectItem value="rajasthan">Rajasthan</SelectItem>
                <SelectItem value="punjab">Punjab</SelectItem>
                <SelectItem value="kerala">Kerala</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="zipCode">PIN Code</Label>
            <Input
              id="zipCode"
              value={formData.shippingAddress.zipCode}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  shippingAddress: {
                    ...prev.shippingAddress,
                    zipCode: e.target.value,
                  },
                }))
              }
              required
            />
          </div>
        </div>
      </Card>

      {/* Payment Method */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Method
        </h2>
        <RadioGroup
          value={formData.paymentMethod}
          onValueChange={(value: "card" | "upi" | "cod") =>
            setFormData((prev) => ({ ...prev, paymentMethod: value }))
          }
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card">Credit/Debit Card</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="upi" id="upi" />
            <Label htmlFor="upi">UPI</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cod" id="cod" />
            <Label htmlFor="cod">Cash on Delivery (COD)</Label>
          </div>
        </RadioGroup>
      </Card>

      {/* Custom Design */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Custom Design
          </h2>
          <Switch
            checked={formData.wantCustomDesign}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({
                ...prev,
                wantCustomDesign: checked,
                customDesignType: checked ? prev.customDesignType : null,
              }))
            }
          />
        </div>

        <AnimatePresence>
          {formData.wantCustomDesign && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <RadioGroup
                value={formData.customDesignType || ""}
                onValueChange={(value: "upload" | "link") =>
                  setFormData((prev) => ({
                    ...prev,
                    customDesignType: value,
                    customDesignFile: null,
                    customDesignLink: "",
                  }))
                }
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upload" id="upload" />
                  <Label htmlFor="upload">Upload Image</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="link" id="link" />
                  <Label htmlFor="link">Provide Image Link</Label>
                </div>
              </RadioGroup>

              {formData.customDesignType === "upload" && (
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    Maximum file size: 2MB
                  </p>
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-cyan-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              )}

              {formData.customDesignType === "link" && (
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 text-gray-500" />
                  <Input
                    type="url"
                    placeholder="Paste image URL here"
                    value={formData.customDesignLink}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        customDesignLink: e.target.value,
                      }))
                    }
                  />
                </div>
              )}

              <div>
                <Label htmlFor="instructions">Special Instructions</Label>
                <Textarea
                  id="instructions"
                  placeholder="Add any special instructions for your custom design..."
                  value={formData.specialInstructions}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      specialInstructions: e.target.value,
                    }))
                  }
                  className="h-24"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </>
  );
} 