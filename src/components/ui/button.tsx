import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "ghost" | "link" | "premium" | "clean"
  size?: "default" | "sm" | "lg" | "icon"
}

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium ring-offset-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-2 border-gray-900 bg-gray-900 text-white hover:bg-gray-800 hover:border-gray-800 active:scale-[0.98]",
        destructive:
          "border-2 border-red-500 bg-red-500 text-white hover:bg-red-600 hover:border-red-600 active:scale-[0.98]",
        outline:
          "border-2 border-gray-900 bg-transparent text-gray-900 hover:bg-gray-900 hover:text-white active:scale-[0.98]",
        secondary:
          "border-2 border-gray-200 bg-gray-100 text-gray-900 hover:bg-gray-200 hover:border-gray-300 active:scale-[0.98]",
        ghost:
          "border-2 border-transparent hover:bg-gray-100 active:scale-[0.98]",
        link:
          "text-gray-900 underline-offset-4 hover:underline",
        premium: 
          "border-2 border-amber-500 bg-amber-500 text-white hover:bg-amber-600 hover:border-amber-600 active:scale-[0.98]",
        clean:
          "border-2 border-transparent hover:border-gray-200 active:scale-[0.98]",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
