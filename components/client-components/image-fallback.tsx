import React from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

type ImageWithFallbackProps = {
  src: string | null | undefined;
  rounded?: boolean;
  alt?: string;
  /** Use fill for responsive containers; omit for fixed width/height */
  layout?: "fill" | "fixed" | "intrinsic" | "responsive";
  caption?: string;
  /** Only set true for LCP / above-the-fold images to avoid loading all images eagerly */
  priority?: boolean;
  /** Hint for responsive image width (e.g. "100vw", "(max-width: 768px) 100vw, 33vw") - improves savings */
  sizes?: string;
  /** 1–100; lower = smaller files. Default 72 for better LCP/image delivery. */
  quality?: number;
} & Omit<ImageProps, "src" | "alt">;

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = "Image",
  className,
  width = 100,
  height = 100,
  rounded = true,
  caption,
  layout,
  priority = false,
  sizes,
  quality = 72,
  ...props
}) => {
  const isValidSrc = typeof src === "string" && src.trim().length > 0;
  const safeSrc = isValidSrc ? src! : "/image_fallback.svg";
  const useFill = layout === "fill";

  return (
    <div className={cn("overflow-hidden", className)}>
      <div className={cn(rounded && "", className)}>
        <Image
          src={safeSrc}
          alt={alt}
          {...(useFill
            ? { fill: true, sizes: sizes ?? "100vw" }
            : { width, height })}
          className="object-cover w-full h-full"
          priority={priority}
          quality={quality}
          {...props}
        />
        {caption ? <p>{caption}</p> : null}
      </div>
    </div>
  );
};
