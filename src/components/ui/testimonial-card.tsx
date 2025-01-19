import { cn } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

export interface TestimonialAuthor {
  name: string
  handle: string
  avatar: string
}

export interface TestimonialCardProps {
  author: TestimonialAuthor
  text: string
  href?: string
  className?: string
}

export function TestimonialCard({ 
  author,
  text,
  href,
  className
}: TestimonialCardProps) {
  const Card = href ? 'a' : 'div'
  
  return (
    <Card
      {...(href ? { href } : {})}
      className={cn(
        "flex flex-col rounded-lg border-t",
        "bg-gradient-to-b from-luxury-pearl to-luxury-champagne",
        "p-4 text-start sm:p-6",
        "hover:from-luxury-cream hover:to-luxury-pearl",
        "max-w-[320px] sm:max-w-[320px]",
        "transition-colors duration-300 shadow-lg",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 ring-2 ring-luxury-gold">
          <AvatarImage src={author.avatar} alt={author.name} />
        </Avatar>
        <div className="flex flex-col items-start">
          <h3 className="text-md font-serif font-semibold leading-none text-secondary">
            {author.name}
          </h3>
          <p className="text-sm text-primary-dark">
            {author.handle}
          </p>
        </div>
      </div>
      <p className="sm:text-md mt-4 text-sm text-secondary-light italic">
        {text}
      </p>
    </Card>
  )
}