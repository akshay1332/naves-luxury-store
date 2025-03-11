const calculatePrintingPrice = React.useCallback(() => {
  if (!formData.wantsCustomPrinting || !product?.custom_printing_options) return 0;

  let basePrice = 0;
  const options = product.custom_printing_options;

  if (formData.printingSize === 'Small' && formData.printingLocations[0]) {
    const location = formData.printingLocations[0] as keyof typeof options.small_locations;
    basePrice = options.small_locations[location];
  } else if (formData.printingSize === 'Medium' && formData.printingLocations[0]) {
    const location = formData.printingLocations[0] as keyof typeof options.medium_locations;
    basePrice = options.medium_locations[location];
  } else if (formData.printingSize === 'Large' && formData.printingLocations[0]) {
    const location = formData.printingLocations[0] as keyof typeof options.large_locations;
    basePrice = options.large_locations[location];
  } else if (formData.printingSize === 'Across Chest') {
    basePrice = options.across_chest;
  }

  // Return the base price (per item)
  return basePrice;
}, [formData.printingSize, formData.printingLocations, formData.wantsCustomPrinting, product]);

// Update useEffect to pass the base price
React.useEffect(() => {
  const basePrice = calculatePrintingPrice();
  updateTotalPrice(basePrice); // Pass the base price, parent component will multiply by quantity
}, [calculatePrintingPrice, updateTotalPrice]);
