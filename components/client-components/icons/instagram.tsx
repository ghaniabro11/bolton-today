import Image from "next/image";

export const Instagram = () => {
    return (
      <Image
        src={"/instagram.svg"}
        className="object-contain"
        priority
        alt="muckrack logo"
        height={100}
        width={100}
      />
    );
  };