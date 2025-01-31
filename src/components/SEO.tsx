import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
}

export function SEO({ 
  title = 'Custom Print - Premium Custom Clothing Printing Services',
  description = 'Get high-quality custom printed hoodies, t-shirts, and apparel. Professional clothing printing service with unique designs, premium materials, and fast delivery.',
  keywords = [
    'custom print',
    'custom clothing',
    'custom hoodies',
    'custom t-shirts',
    'clothing printing',
    'custom apparel printing',
    'premium custom clothing',
    'custom printed hoodies',
    'custom printed t-shirts',
    'personalized clothing',
    'custom clothing design',
    'bulk clothing printing',
    'custom sportswear',
    'custom fashion',
    'print on demand',
    'custom merchandise',
    'custom branded clothing',
    'custom printing service'
  ],
  image = '/og-image.jpg',
  url = 'https://customprint.com'
}: SEOProps) {
  const canonicalUrl = url.endsWith('/') ? url.slice(0, -1) : url;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Custom Print" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#00BFA5" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ClothingStore",
          "name": "Custom Print",
          "description": description,
          "image": image,
          "url": url,
          "telephone": "+1-234-567-8900",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Your Street Address",
            "addressLocality": "Your City",
            "addressRegion": "Your State",
            "postalCode": "Your Postal Code",
            "addressCountry": "Your Country"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "YOUR_LATITUDE",
            "longitude": "YOUR_LONGITUDE"
          },
          "priceRange": "$$",
          "openingHours": "Mo-Sa 09:00-18:00",
          "paymentAccepted": ["Cash", "Credit Card", "Debit Card"],
          "currenciesAccepted": "INR"
        })}
      </script>
    </Helmet>
  );
} 