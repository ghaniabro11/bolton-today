import Image from "next/image";

export const Muckrack = () => {
    return (
      <Image
        src={"/mukrack.webp"}
        className="object-contain rounded-full"
        priority
        alt="muckrack logo"
        height={100}
        width={100}
      />
    );
  };
  