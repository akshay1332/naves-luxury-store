import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDebounce } from './useDebounce';

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

export const useSearch = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = useCallback(async (query: string | undefined) => {
    // Handle undefined or empty query
    if (!query || typeof query !== 'string') {
      setSearchResults([]);
      return;
    }

    const trimmedQuery = query.trim();
    if (trimmedQuery === '') {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`title.ilike.%${trimmedQuery}%,description.ilike.%${trimmedQuery}%`)
        .limit(5);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const debouncedSearch = useDebounce(performSearch, 300);

  return {
    searchResults,
    isSearching,
    search: debouncedSearch
  };
}; 