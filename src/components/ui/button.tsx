import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-105",
        outline: "border-2 border-border bg-transparent hover:bg-accent hover:text-accent-foreground hover:border-primary transition-all duration-300",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105 hover:glow-box",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:scale-105",
        link: "text-primary underline-offset-4 hover:underline hover:glow-text",
        neon: "bg-gradient-to-r from-primary via-secondary to-accent text-primary-foreground font-bold glow-box hover:scale-110 hover:glow-box-intense hover:animate-glow transition-all duration-500",
        "neon-outline": "border-2 border-primary bg-transparent text-primary font-semibold hover:bg-primary hover:text-primary-foreground hover:glow-box hover:scale-105 transition-all duration-300",
        "neon-pink": "bg-gradient-to-r from-neon-pink to-neon-purple text-background font-bold glow-box hover:scale-110 hover:animate-glow transition-all duration-500",
        "neon-cyan": "bg-gradient-to-r from-neon-cyan to-neon-blue text-background font-bold glow-box hover:scale-110 hover:animate-glow transition-all duration-500",
        "neon-multi": "bg-gradient-to-r from-neon-cyan via-neon-pink via-neon-purple to-neon-orange text-background font-bold glow-box-multi hover:scale-110 hover:glow-box-intense animate-shimmer bg-[length:200%_100%] transition-all duration-500",
        hero: "bg-gradient-to-r from-neon-cyan via-primary via-secondary to-neon-pink text-background font-black text-lg px-10 py-6 rounded-xl glow-box-intense hover:scale-115 hover:animate-glow hover:glow-box-multi animate-float bg-[length:300%_100%] animate-shimmer transition-all duration-700",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 text-foreground font-medium hover:bg-white/20 hover:scale-105 hover:glow-box transition-all duration-300",
        "gradient-border": "bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-purple p-[2px] rounded-md hover:scale-105 hover:animate-glow transition-all duration-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-16 rounded-xl px-12 text-lg",
        xxl: "h-20 rounded-2xl px-16 text-xl",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
