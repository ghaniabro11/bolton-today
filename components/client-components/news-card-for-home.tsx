import Image from "next/image";

type CardProps = {
  title: string;
  description: string;
  featureImage: {
    filePath: string;
    title: string;
    caption: string;
  };
};

export function ArticleCard({ title, description, featureImage }: CardProps) {
  return (
    <div className="max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white border hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-full h-48">
        <Image
          src={featureImage.filePath.replace(/\\/g, "/")}
          alt={featureImage.title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-2xl"
        />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
        <p className="text-sm text-gray-600">{description.slice(0, 120)}...</p>
      </div>
    </div>
  );
}