import { Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { formatIndianPrice } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  price: number;
  category: string | null;
  images: string[] | null;
  style_category: string | null;
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 200);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (debouncedQuery.length < 1) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const searchTerm = debouncedQuery.toLowerCase();
        
        const { data, error } = await supabase
          .from('products')
          .select('id, title, price, category, images, style_category')
          .or(
            `title.ilike.%${searchTerm}%,` +
            `category.ilike.%${searchTerm}%,` +
            `style_category.ilike.%${searchTerm}%`
          )
          .limit(12);

        if (error) throw error;
        
        const sortedResults = data.sort((a, b) => {
          const getRelevanceScore = (item: typeof data[0]) => {
            let score = 0;
            const title = item.title?.toLowerCase() || '';
            const category = item.category?.toLowerCase() || '';
            const styleCategory = item.style_category?.toLowerCase() || '';
            
            if (title === searchTerm) score += 100;
            if (category === searchTerm) score += 80;
            if (styleCategory === searchTerm) score += 80;
            
            if (title.startsWith(searchTerm)) score += 50;
            if (category?.startsWith(searchTerm)) score += 40;
            if (styleCategory?.startsWith(searchTerm)) score += 40;
            
            if (title.includes(searchTerm)) score += 25;
            if (category?.includes(searchTerm)) score += 20;
            if (styleCategory?.includes(searchTerm)) score += 20;
            
            return score;
          };

          return getRelevanceScore(b) - getRelevanceScore(a);
        });

        setResults(sortedResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchProducts();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [debouncedQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setShowResults(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-[600px]">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <Search 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-900" 
            size={20} 
          />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            placeholder="Search for products, brands and more"
            className={cn(
              "w-full h-11 pl-12 pr-4",
              "rounded-lg border-2 border-gray-900",
              "bg-white",
              "text-sm text-gray-900 placeholder:text-gray-500",
              "focus:outline-none focus:border-gray-900 focus:ring-0",
              "transition-all duration-200"
            )}
          />
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && (query.length >= 1 || results.length > 0) && (
        <div className={cn(
          "absolute top-full left-0 right-0 mt-2",
          "bg-white rounded-lg shadow-xl border border-gray-200",
          "max-h-[400px] overflow-y-auto z-50"
        )}>
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result) => (
                <Link
                  key={result.id}
                  to={`/products/${result.id}`}
                  onClick={() => setShowResults(false)}
                  className={cn(
                    "flex items-center gap-4 p-3 hover:bg-gray-50",
                    "transition-colors duration-200"
                  )}
                >
                  <img
                    src={result.images?.[0]}
                    alt={result.title}
                    className="w-12 h-12 object-cover rounded-md bg-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 truncate">
                      {result.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {result.category}
                      {result.style_category && ` • ${result.style_category}`}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatIndianPrice(result.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : query.length >= 1 && (
            <div className="p-4 text-center text-gray-500">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
} 