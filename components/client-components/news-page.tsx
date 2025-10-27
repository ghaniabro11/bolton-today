import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import PageGridWrapper from "./grid-wrapper";
import { formatDate } from "@/utils/date";
import "./content.css";
import AdUnit from "../AdUnit";
import AdBanner from "../AdBanner";

interface NewDetailPageProps {
  data: {
    title?: string;
    categoryName?: string;
    categorySlug?: string;
    authorName?: string;
    authorSlug?: string;
    publishDate?: string;
    featureImage?: string;
    featureImageTitle?: string;
    featureImageCaption?: string;
    details?: string;
  };
}

export default function NewDetailPage({ data }: NewDetailPageProps) {
  return (
    <>
      <PageGridWrapper>
        <main className=" px-4  space-y-6">
          <div className="text-sm text-gray-500 space-x-2">
            <Link href="/" className="hover:underline cursor-pointer">
              Home
            </Link>
            <span>/</span>
            <Link
              className="text-primary font-semibold"
              href={`/${data?.categorySlug ?? ""}`.replace(/\/\/+/g, "/")}
            >
              {data?.categoryName ?? ""}
            </Link>
          </div>

          <h1 className="text-5xl text-[#333] font-playfair-display font-semibold">
            {data?.title ?? ""}
          </h1>

          <p className="text-sm text-gray-600 mb-2! mt-0!">
            In{" "}
            <Link href={`/${data?.categorySlug ?? ""}`}>
              <span className=" text-gray-400 text-base font-medium">
                {data?.categoryName ?? ""}
              </span>
            </Link>{" "}
            by{" "}
            <Link href={`/author/${data?.authorSlug ?? ""}`}>
              <span className="font-medium text-gray-400 text-base">
                {data?.authorName ?? ""}
              </span>
            </Link>{" "}
            – {formatDate(data?.publishDate ?? "")}
          </p>

          <Separator />

          <div className="relative w-full aspect-video   mb-1!">
            {data?.featureImage && (
              <>
                <Image
                  src={`${data?.featureImage ?? ""}`}
                  alt={`${data?.featureImageTitle ?? null}`}
                  layout="fill"
                  objectFit="cover"
                />
              </>
            )}
          </div>
          <p className=" my-0!">{data?.featureImageCaption ?? ""}</p>

          {data?.details && (
            <div
              className="entry-content overflow-auto mt-7"
              dangerouslySetInnerHTML={{ __html: data?.details ?? "" }}
            />
          )}
          <AdBanner />
        </main>
      </PageGridWrapper>
    </>
  );
}
