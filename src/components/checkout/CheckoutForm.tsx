import React, { useState } from "react";
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
import { cn } from "@/lib/utils";

const indianStates = [
  "Andhra Pradesh",
  "Delhi",
  "Gujarat",
  "Haryana",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal"
] as const;

interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface CheckoutFormData {
  shippingAddress: ShippingAddress;
  paymentMethod: "card" | "upi" | "cod";
  wantCustomDesign: boolean;
  customDesignType: "upload" | "link" | null;
  customDesignFile?: File | null;
  customDesignLink?: string;
  specialInstructions?: string;
}

interface CheckoutFormProps {
  formData: CheckoutFormData;
  setFormData: (data: CheckoutFormData) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadProgress: number;
  loading?: boolean;
}

export function CheckoutForm({
  formData,
  setFormData,
  handleFileChange,
  uploadProgress,
  loading,
}: CheckoutFormProps) {
  const updateShippingAddress = (field: keyof ShippingAddress, value: string) => {
    setFormData({
      ...formData,
      shippingAddress: {
        ...formData.shippingAddress,
        [field]: value
      }
    });
  };

  const updatePaymentMethod = (value: "card" | "upi" | "cod") => {
    setFormData({
      ...formData,
      paymentMethod: value
    });
  };

  const updateCustomDesignType = (value: "upload" | "link") => {
    setFormData({
      ...formData,
      customDesignType: value,
      customDesignFile: null,
      customDesignLink: ""
    });
  };

  return (
    <form className="space-y-8">
      {/* Shipping Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Shipping Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.shippingAddress.fullName}
              onChange={(e) => updateShippingAddress("fullName", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.shippingAddress.email}
              onChange={(e) => updateShippingAddress("email", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.shippingAddress.phone}
              onChange={(e) => updateShippingAddress("phone", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.shippingAddress.address}
              onChange={(e) => updateShippingAddress("address", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.shippingAddress.city}
              onChange={(e) => updateShippingAddress("city", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select
              value={formData.shippingAddress.state}
              onValueChange={(value) => updateShippingAddress("state", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {indianStates.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">PIN Code</Label>
            <Input
              id="zipCode"
              value={formData.shippingAddress.zipCode}
              onChange={(e) => updateShippingAddress("zipCode", e.target.value)}
              required
              maxLength={6}
              pattern="[0-9]*"
            />
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Payment Method</h3>
        <RadioGroup
          value={formData.paymentMethod}
          onValueChange={updatePaymentMethod}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className={cn(
            "flex items-center space-x-2 rounded-lg border p-4",
            formData.paymentMethod === "card" && "border-rose-500"
          )}>
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card">Credit/Debit Card</Label>
          </div>
          
          <div className={cn(
            "flex items-center space-x-2 rounded-lg border p-4",
            formData.paymentMethod === "upi" && "border-rose-500"
          )}>
            <RadioGroupItem value="upi" id="upi" />
            <Label htmlFor="upi">UPI</Label>
          </div>
          
          <div className={cn(
            "flex items-center space-x-2 rounded-lg border p-4",
            formData.paymentMethod === "cod" && "border-rose-500"
          )}>
            <RadioGroupItem value="cod" id="cod" />
            <Label htmlFor="cod">Cash on Delivery</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Custom Design */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Custom Design</h3>
          <Switch
            checked={formData.wantCustomDesign}
            onCheckedChange={(checked) => setFormData({
              ...formData,
              wantCustomDesign: checked,
              customDesignType: checked ? "upload" : null
            })}
          />
        </div>

        {formData.wantCustomDesign && (
          <div className="space-y-4">
            <RadioGroup
              value={formData.customDesignType || "upload"}
              onValueChange={updateCustomDesignType}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className={cn(
                "flex items-center space-x-2 rounded-lg border p-4",
                formData.customDesignType === "upload" && "border-rose-500"
              )}>
                <RadioGroupItem value="upload" id="upload" />
                <Label htmlFor="upload">Upload Design</Label>
              </div>
              
              <div className={cn(
                "flex items-center space-x-2 rounded-lg border p-4",
                formData.customDesignType === "link" && "border-rose-500"
              )}>
                <RadioGroupItem value="link" id="link" />
                <Label htmlFor="link">Design Link</Label>
              </div>
            </RadioGroup>

            {formData.customDesignType === "upload" && (
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                  disabled={loading}
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
                  placeholder="Enter design link"
                  value={formData.customDesignLink}
                  onChange={(e) => setFormData({
                    ...formData,
                    customDesignLink: e.target.value
                  })}
                  disabled={loading}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="instructions">Special Instructions</Label>
              <Textarea
                id="instructions"
                placeholder="Any specific instructions for your custom design..."
                value={formData.specialInstructions}
                onChange={(e) => setFormData({
                  ...formData,
                  specialInstructions: e.target.value
                })}
                disabled={loading}
              />
            </div>
          </div>
        )}
      </div>
    </form>
  );
} 