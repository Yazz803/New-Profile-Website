import { Slide } from "../animation/Slide";
import Image from "next/image";
import { Metadata } from "next";
import PageHeading from "@/app/components/shared/PageHeading";
import { constant_data } from "@/constants";

const images = [
  {
    id: "1",
    src: `${constant_data.base_url_fe}/images/photos1.png`,
  },
  {
    id: "2",
    src: `${constant_data.base_url_fe}/images/photos2.png`,
  },
  {
    id: "3",
    src: `${constant_data.base_url_fe}/images/photos4.jpg`,
  },
];

export const metadata: Metadata = {
  title: "Photos | Muhammad Yazid Akbar",
  metadataBase: new URL(`${constant_data.base_url_fe}/photos`),
  description: "Explore photos taken by Muhammad Yazid Akbar",
  openGraph: {
    title: "Photos | Muhammad Yazid Akbar",
    url: `/${constant_data.base_url_fe}photos`,
    description: "Explore photos taken by Muhammad Yazid Akbar",
    images:
      "https://res.cloudinary.com/victoreke/image/upload/v1692635149/victoreke/photos.png",
  },
};

export default function Photos() {
  return (
    <main className="max-w-7xl mx-auto md:px-16 px-6 lg:mt-32 mt-20">
      <PageHeading title="Photos" description="Foto Random" />
      <figure className="my-6">
        <Slide delay={0.12} className="flex flex-wrap gap-2">
          {images.map((image) => (
            <Image
              key={image.id}
              src={image.src}
              alt="playing guitar"
              width={350}
              height={800}
              className="dark:bg-primary-bg bg-secondary-bg object-contain"
            />
          ))}
        </Slide>
      </figure>
    </main>
  );
}
