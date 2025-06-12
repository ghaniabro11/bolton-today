import { Metadata } from "next";

type SEOOptions = {
  title: string;
  description: string;
  keywords: string[];
  canonical?: string;
};
// ... existing code ...
export const generateMetadata = ({
  title,
  description,
  keywords,
  canonical,
}: SEOOptions): Metadata => {
  return {
    title,
    description,
    keywords,
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-video-preview": -1,
      "max-image-preview": "large",
    },
    alternates: {
      canonical: canonical || undefined,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [
        {
          url: `https://boltontoday.co.uk/bolton_logo.svg`, // Replace with your image URL
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      title,
      description,
    },
  };
};
// ... existing code ...
