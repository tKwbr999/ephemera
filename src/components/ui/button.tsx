import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./button-variants";

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantProps {
  asChild?: boolean;
  href?: string; // aタグ用のプロパティを追加
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, href, ...props }, ref) => {
    // hrefがある場合はリンクとして扱う
    const Comp: React.ElementType = asChild ? Slot : href ? "a" : "button";
    
    // hrefがある場合はリンク用のプロパティを追加
    const linkProps = href ? { href } : {};
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...linkProps}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
