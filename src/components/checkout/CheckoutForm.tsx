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
import { Truck, CreditCard, Upload, Link as LinkIcon, AlertCircle, CheckCircle, Image as ImageIcon, FileText, File as FileIcon, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { CustomPrintingOptions } from "./CustomPrintingOptions";

// Update the Indian states list with all 28 states and 8 union territories
const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  // Union Territories
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
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

interface CustomPrintingOptionsType {
  small_locations: {
    left_chest: number;
    center_chest: number;
    right_chest: number;
    back: number;
  };
  medium_locations: {
    front: number;
    back: number;
    both: number;
  };
  large_locations: {
    full_front: number;
    full_back: number;
    both: number;
  };
  across_chest: number;
}

interface Product {
  id: string;
  title: string;
  price: number;
  allows_custom_printing?: boolean;
  custom_printing_price?: number;
  custom_printing_options?: CustomPrintingOptionsType;
  printing_guide?: {
    image_url: string;
    description: string;
    updated_at?: string;
  };
}

interface CheckoutFormData {
  shippingAddress: ShippingAddress;
  paymentMethod: "card" | "upi" | "cod";
  wantCustomDesign: boolean;
  customDesignType: "upload" | "link" | null;
  customDesignFile?: File | null;
  customDesignFileType?: 'image' | 'document' | null;
  customDesignLink?: string;
  specialInstructions?: string;
  wantsCustomPrinting: boolean;
  customDesignPreview?: string | null;
  printingSize: 'Small' | 'Medium' | 'Large' | 'Across Chest' | null;
  printingLocations: string[];
}

interface CheckoutFormProps {
  formData: CheckoutFormData;
  setFormData: (data: CheckoutFormData) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadProgress: number;
  loading?: boolean;
  product?: Product;
  updateTotalPrice: (price: number, productPrice: number) => void;
}

// Add this type for accepted file types
const ACCEPTED_FILE_TYPES = ".pdf,.doc,.docx,image/*";

// Add file type validation
const ACCEPTED_MIMES = {
  'image': ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  'document': ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Add file validation function
const validateFile = (file: File) => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "File size exceeds 5MB limit"
    };
  }

  // Check file type
  const isImage = ACCEPTED_MIMES.image.includes(file.type);
  const isDocument = ACCEPTED_MIMES.document.includes(file.type);

  if (!isImage && !isDocument) {
    return {
      valid: false,
      error: "Invalid file type. Please upload an image, PDF, or DOC file"
    };
  }

  return {
    valid: true,
    type: isImage ? 'image' : 'document'
  };
};

// Add these helper functions at the top
const getFileCategory = (fileType: string) => {
  if (ACCEPTED_MIMES.image.includes(fileType)) return 'images';
  if (ACCEPTED_MIMES.document.includes(fileType)) return 'documents';
  return 'others';
};

const getFileIcon = (fileType: string) => {
  if (ACCEPTED_MIMES.image.includes(fileType)) {
    return <ImageIcon className="h-5 w-5" />;
  }
  if (fileType === 'application/pdf') {
    return <FileText className="h-5 w-5 text-red-500" />;
  }
  if (ACCEPTED_MIMES.document.includes(fileType)) {
    return <FileIcon className="h-5 w-5 text-blue-500" />;
  }
  return <FileIcon className="h-5 w-5" />;
};

export function CheckoutForm({
  formData,
  setFormData,
  handleFileChange,
  uploadProgress,
  loading,
  product,
  updateTotalPrice,
}: CheckoutFormProps) {
  const { toast } = useToast();

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
      customDesignFileType: null,
      customDesignLink: ""
    });
  };

  // Update file handling
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file);
    
    if (!validation.valid) {
      toast({
        variant: "destructive",
        title: "Error",
        description: validation.error
      });
      e.target.value = '';
      return;
    }

    try {
      // Create a preview URL for images
      const previewUrl = validation.type === 'image' 
        ? URL.createObjectURL(file)
        : null;

      // Update form with file info
      setFormData({
        ...formData,
        customDesignFile: file,
        customDesignFileType: validation.type as 'image' | 'document',
        customDesignPreview: previewUrl
      });

      // Call the parent handler
      handleFileChange(e);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process the file"
      });
      e.target.value = '';
    }
  };

  // Update the file preview section
  const FilePreview = ({ file, previewUrl }: { file: File, previewUrl: string | null }) => {
    const fileSize = (file.size / (1024 * 1024)).toFixed(2); // Convert to MB
    
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-start gap-4">
          {previewUrl ? (
            // Image preview
            <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            // Document icon
            <div className="w-20 h-20 rounded-lg border bg-white flex items-center justify-center">
              {getFileIcon(file.type)}
            </div>
          )}
          
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              {file.name}
              <CheckCircle className="h-4 w-4 text-green-500" />
            </h4>
            <div className="mt-1 text-sm text-gray-500 space-y-1">
              <p>Type: {file.type}</p>
              <p>Size: {fileSize} MB</p>
            </div>
            <button
              onClick={() => {
                if (previewUrl) {
                  window.open(previewUrl, '_blank');
                }
              }}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              disabled={!previewUrl}
            >
              <Eye className="h-4 w-4" />
              {previewUrl ? 'Preview' : 'No preview available'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const calculatePrintingPrice = React.useCallback(() => {
    if (!formData.wantsCustomPrinting || !product?.custom_printing_options) return 0;

    let totalPrice = 0;
    const options = product.custom_printing_options;

    if (formData.printingSize === 'Small' && formData.printingLocations[0]) {
      const location = formData.printingLocations[0] as keyof typeof options.small_locations;
      totalPrice = options.small_locations[location];
    } else if (formData.printingSize === 'Medium' && formData.printingLocations[0]) {
      const location = formData.printingLocations[0] as keyof typeof options.medium_locations;
      totalPrice = options.medium_locations[location];
    } else if (formData.printingSize === 'Large' && formData.printingLocations[0]) {
      const location = formData.printingLocations[0] as keyof typeof options.large_locations;
      totalPrice = options.large_locations[location];
    } else if (formData.printingSize === 'Across Chest') {
      totalPrice = options.across_chest;
    }

    return totalPrice;
  }, [formData.printingSize, formData.printingLocations, formData.wantsCustomPrinting, product]);

  React.useEffect(() => {
    const price = calculatePrintingPrice();
    updateTotalPrice(price, product?.price || 0);
  }, [calculatePrintingPrice, updateTotalPrice, product?.price]);

  // Consolidate custom printing and design sections
  const renderCustomPrintingAndDesign = () => {
    if (!product?.allows_custom_printing) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Custom Printing & Design</h3>
          <Switch
            id="custom-printing"
            checked={formData.wantsCustomPrinting}
            onCheckedChange={(checked) => {
              setFormData({
                ...formData,
                wantsCustomPrinting: checked,
                wantCustomDesign: checked,
                customDesignType: checked ? "link" : null,
                printingSize: null,
                printingLocations: [],
                customDesignLink: "",
                specialInstructions: ""
              });
            }}
          />
        </div>

        {formData.wantsCustomPrinting && (
          <div className="space-y-6 border rounded-lg p-4">
            {/* Design Link Input */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-gray-500" />
                <Input
                  type="url"
                  placeholder="Enter design link (Google Drive, Dropbox, etc.)"
                  value={formData.customDesignLink}
                  onChange={(e) => setFormData({
                    ...formData,
                    customDesignLink: e.target.value
                  })}
                  disabled={loading}
                  className="bg-white"
                />
              </div>
              <p className="text-sm text-gray-500">
                Supported links: Google Drive, Dropbox, or any direct file link
              </p>
            </div>

            {/* Special Instructions */}
            <div className="space-y-2">
              <Label htmlFor="instructions">Special Instructions</Label>
              <Textarea
                id="instructions"
                placeholder="Any specific instructions for your design..."
                value={formData.specialInstructions}
                onChange={(e) => setFormData({
                  ...formData,
                  specialInstructions: e.target.value
                })}
                disabled={loading}
                className="bg-white"
              />
            </div>

            {/* Custom Printing Options */}
            <CustomPrintingOptions
              selectedSize={formData.printingSize}
              selectedLocations={formData.printingLocations}
              onSizeChange={(size) => {
                setFormData({
                  ...formData,
                  printingSize: size,
                  printingLocations: []
                });
              }}
              onLocationChange={(locations) => {
                setFormData({
                  ...formData,
                  printingLocations: locations
                });
              }}
              printingOptions={product.custom_printing_options}
            />

            {/* Printing Guide */}
            {product.printing_guide && (
              <div className="mt-6 space-y-4">
                <h4 className="font-medium">Printing Guide</h4>
                {product.printing_guide.image_url && (
                  <div className="aspect-video relative rounded-lg overflow-hidden border">
                    <img 
                      src={product.printing_guide.image_url} 
                      alt="Printing Guide" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                {product.printing_guide.description && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {product.printing_guide.description}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
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
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-[300px]">
                {indianStates.map((state) => (
                  <SelectItem 
                    key={state} 
                    value={state}
                    className="hover:bg-gray-100"
                  >
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

      {/* Custom Printing and Design Section */}
      {renderCustomPrintingAndDesign()}
    </form>
  );
} 