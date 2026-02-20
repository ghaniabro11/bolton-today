import { cn } from "@/lib/utils";
import Image from "next/image";

export const Instagram = ({ className }: { className?: string }) => {
  return (
    <Image
      src={"/instagram.svg"}
      className={cn("object-contain", className)}
      priority
      alt="muckrack logo"
      height={100}
      width={100}
    />
  );
};
