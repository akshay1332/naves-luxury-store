import { Star } from "lucide-react";

interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
}

export function Rating({ value, onChange, readonly = false }: RatingProps) {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          className={`${
            rating <= value ? "text-yellow-400" : "text-gray-300"
          } ${!readonly && "hover:text-yellow-400"}`}
          onClick={() => !readonly && onChange?.(rating)}
          disabled={readonly}
        >
          <Star className="h-5 w-5 fill-current" />
        </button>
      ))}
    </div>
  );
}