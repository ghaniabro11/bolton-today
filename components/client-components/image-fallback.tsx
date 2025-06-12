import React from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

type ImageWithFallbackProps = {
  src: string | null | undefined;
  rounded?: boolean;
  layout?: "fill" | "fixed" | "intrinsic" | "responsive"; // Add layout prop
  caption?: string;
} & Omit<any, "src">;

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = "Image",
  className,
  width = 100,
  height = 100,
  rounded = true,
  caption,
  layout, // Add layout prop
  ...props
}) => {
  const isValidSrc = typeof src === "string" && src.trim().length > 0;
  const safeSrc = isValidSrc ? src! : "/image_fallback.svg";

  return (
    <div className={cn("overflow-hidden", className)}>
      <div
        className={cn(
          // " inline-block transition-transform duration-300 hover:scale-105 size-fit",

          rounded && "",
          className
        )}
        // style={{ width, height }}
      >
        <Image
          src={safeSrc}
          alt={alt}
          {...(layout ? { layout } : { width, height })} // Conditionally include width/height or layout
          className="object-cover w-full h-full"
          {...props}
          priority
        />
        <p>{caption}</p>
      </div>
    </div>
  );
};
