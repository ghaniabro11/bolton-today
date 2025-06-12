import { cn } from "@/lib/utils"; // Adjust this path if needed
import React from "react";

type Variant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div" | "span";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
  weight?: "400" | "500" | "600" | "700" | "800" | "900" | "variable"; // Update the type
}

const variantMap: Record<Variant, string> = {
  h1: "text-4xl font-bold tracking-tight my-0!",
  h2: "text-3xl font-semibold tracking-tight my-0!",
  h3: "text-2xl font-semibold tracking-tight my-0!",
  h4: "text-xl font-medium my-0!",
  h5: "text-lg font-medium my-0!",
  h6: "text-base font-medium my-0!",
  p: "text-base my-0!",
  div: "text-base",
  span: "text-sm",
};

export const Typography: React.FC<TypographyProps> = ({
  variant = "p",
  className,
  children,
  weight = "500",
  ...props
}) => {
  const Component = variant as React.ElementType;

  return (
    <Component
      className={cn(variantMap[variant], className, "font-inter")}
      {...props}
    >
      {children}
    </Component>
  );
};
