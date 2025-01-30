import { cn } from "@/lib/utils";

export const LuxuryLoader = ({ className }: { className?: string }) => {
  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-white", className)}>
      <div className="relative">
        <div className="h-32 w-32 rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif text-xl text-primary animate-pulse">Custom Prints</span>
        </div>
      </div>
    </div>
  );
};