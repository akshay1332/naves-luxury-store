import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

interface CustomPrintingOptionsProps {
  selectedSize: 'Small' | 'Medium' | 'Large' | 'Across Chest' | null;
  selectedLocations: string[];
  onSizeChange: (size: 'Small' | 'Medium' | 'Large' | 'Across Chest') => void;
  onLocationChange: (locations: string[]) => void;
  printingOptions: CustomPrintingOptionsType;
}

export function CustomPrintingOptions({
  selectedSize,
  selectedLocations,
  onSizeChange,
  onLocationChange,
  printingOptions
}: CustomPrintingOptionsProps) {
  const getLocationOptions = () => {
    switch (selectedSize) {
      case 'Small':
        return [
          { id: 'left_chest', label: 'Left Chest', price: printingOptions.small_locations.left_chest },
          { id: 'center_chest', label: 'Center Chest', price: printingOptions.small_locations.center_chest },
          { id: 'right_chest', label: 'Right Chest', price: printingOptions.small_locations.right_chest },
          { id: 'back', label: 'Back', price: printingOptions.small_locations.back },
        ];
      case 'Medium':
        return [
          { id: 'front', label: 'Front', price: printingOptions.medium_locations.front },
          { id: 'back', label: 'Back', price: printingOptions.medium_locations.back },
          { id: 'both', label: 'Both', price: printingOptions.medium_locations.both },
        ];
      case 'Large':
        return [
          { id: 'full_front', label: 'Full Front', price: printingOptions.large_locations.full_front },
          { id: 'full_back', label: 'Full Back', price: printingOptions.large_locations.full_back },
          { id: 'both', label: 'Both', price: printingOptions.large_locations.both },
        ];
      default:
        return [];
    }
  };

  const handleLocationSelect = (locationId: string) => {
    // For single location selection
    onLocationChange([locationId]);
  };

  return (
    <div className="space-y-6">
      {/* Size Selection */}
      <div className="space-y-4">
        <Label className="text-base">Select Size</Label>
        <RadioGroup
          value={selectedSize || ''}
          onValueChange={(value) => 
            onSizeChange(value as 'Small' | 'Medium' | 'Large' | 'Across Chest')
          }
          className="grid grid-cols-2 gap-4"
        >
          <Label
            htmlFor="small"
            className={cn(
              "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 [&:has([data-state=checked])]:border-primary cursor-pointer",
              selectedSize === 'Small' && "border-primary"
            )}
          >
            <RadioGroupItem value="Small" id="small" className="sr-only" />
            <span className="text-sm font-medium">Small</span>
          </Label>
          <Label
            htmlFor="medium"
            className={cn(
              "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 [&:has([data-state=checked])]:border-primary cursor-pointer",
              selectedSize === 'Medium' && "border-primary"
            )}
          >
            <RadioGroupItem value="Medium" id="medium" className="sr-only" />
            <span className="text-sm font-medium">Medium</span>
          </Label>
          <Label
            htmlFor="large"
            className={cn(
              "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 [&:has([data-state=checked])]:border-primary cursor-pointer",
              selectedSize === 'Large' && "border-primary"
            )}
          >
            <RadioGroupItem value="Large" id="large" className="sr-only" />
            <span className="text-sm font-medium">Large</span>
          </Label>
          <Label
            htmlFor="across"
            className={cn(
              "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 [&:has([data-state=checked])]:border-primary cursor-pointer",
              selectedSize === 'Across Chest' && "border-primary"
            )}
          >
            <RadioGroupItem value="Across Chest" id="across" className="sr-only" />
            <span className="text-sm font-medium">Across Chest</span>
          </Label>
        </RadioGroup>
      </div>

      {/* Location Selection */}
      {selectedSize && selectedSize !== 'Across Chest' && (
        <div className="space-y-4">
          <Label className="text-base">Select Location</Label>
          <RadioGroup
            value={selectedLocations[0] || ''}
            onValueChange={handleLocationSelect}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {getLocationOptions().map((option) => (
              <Label
                key={option.id}
                htmlFor={option.id}
                className={cn(
                  "flex flex-col justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 [&:has([data-state=checked])]:border-primary cursor-pointer",
                  selectedLocations.includes(option.id) && "border-primary"
                )}
              >
                <RadioGroupItem value={option.id} id={option.id} className="sr-only" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{option.label}</span>
                  <span className="text-sm text-gray-500">₹{option.price}</span>
                </div>
              </Label>
            ))}
          </RadioGroup>
        </div>
      )}

      {selectedSize === 'Across Chest' && (
        <div className="mt-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Across Chest Printing</Label>
              <p className="text-sm text-gray-500">₹{printingOptions.across_chest}</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
} 