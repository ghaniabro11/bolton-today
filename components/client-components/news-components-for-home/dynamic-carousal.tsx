"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Typography } from "../typography";
import Link from "next/link";

export default function OceanCityCarousel({ data }: { data: any }) {
  return (
    <div className="py-8">
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full "
      >
        <div className="flex justify-between items-end w-full py-2 gap-2">
          <div>
            <Link href={`/${data[0].categoryslug}`}>
              <div className="border-b-3 border-b-btn w-fit mt-2">
                <Typography
                  variant="h2"
                  className="text-2xl text-orange font-semibold mb-0!"
                >
                  {data[0]?.categoryname}
                </Typography>
              </div>
            </Link>
            <div
              dangerouslySetInnerHTML={{
                __html: data[0]?.categorydes ?? "<p></p>",
              }}
              className="text-gray my-0! py-0!"
            ></div>
          </div>
          <div className="space-x-2">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </div>

        <CarouselContent>
          {data?.map((item: any, i: number) => (
            <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/4 p-2  ">
              <div className="bg-white   overflow-hidden h-full p-2 space-y-2">
                <img
                  src={item?.image}
                  alt={item?.title}
                  className="w-full h-40 object-cover"
                />

                <Link href={`/${item?.categoryslug}/${item?.slug}`}>
                  <Typography
                    weight="600"
                    variant="h3"
                    className="text-base  text-start hover:text-gray text-black "
                  >
                    {item?.title ?? ""}
                  </Typography>
                </Link>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
