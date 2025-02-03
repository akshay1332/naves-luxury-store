import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

interface ProductResult {
  id: string;
  title: string;
  price: number;
  images: string[];
  category: string;
  description: string;
  colors?: string[];
  sizes?: string[];
  stock?: number;
  created_at?: string;
  updated_at?: string;
  is_featured?: boolean;
  is_best_seller?: boolean;
  is_new_arrival?: boolean;
  discount_price?: number;
  video_url?: string;
}

export function useSearch(query: string) {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    async function performSearch() {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        // Search in products table
        const { data: products, error } = await supabase
          .from('products')
          .select('*')
          .or(
            `title.ilike.%${query}%,` +
            `description.ilike.%${query}%,` +
            `category.ilike.%${query}%`
          )
          .limit(10);

        if (error) throw error;

        // Process and rank results
        const rankedResults = (products as ProductResult[]).map(product => {
          let relevanceScore = 0;

          // Title match (highest priority)
          if (product.title.toLowerCase().includes(query.toLowerCase())) {
            relevanceScore += 10;
            // Exact match gets higher score
            if (product.title.toLowerCase() === query.toLowerCase()) {
              relevanceScore += 5;
            }
          }

          // Category match (medium priority)
          if (product.category.toLowerCase().includes(query.toLowerCase())) {
            relevanceScore += 5;
          }

          // Description match (lower priority)
          if (product.description.toLowerCase().includes(query.toLowerCase())) {
            relevanceScore += 3;
          }

          return {
            ...product,
            relevanceScore,
            image: product.images[0] // Use first image as main image
          };
        });

        // Sort by relevance score
        rankedResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

        // Convert to SearchResult type
        const formattedResults: SearchResult[] = rankedResults.map(({ relevanceScore, images, ...product }) => ({
          ...product,
          image: images[0]
        }));

        setSearchResults(formattedResults);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }

    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return { searchResults, isSearching };
} 