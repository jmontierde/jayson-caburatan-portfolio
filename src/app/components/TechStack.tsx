'use client";';

import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";

const reviews = [
  {
    name: "TypeScript",
    img: "/typescript-icon.svg",
  },
  {
    name: "React",
    img: "/react.svg",
  },
  {
    name: "Next.js",
    img: "/nextjs-icon.svg",
  },
  {
    name: "Javascript",
    img: "/javascript.svg",
  },
  {
    name: "Node.js",
    img: "/nodejs-icon.svg",
  },
  {
    name: "PostgreSQL",
    img: "/postgresql.svg",
  },
  {
    name: "MySQL",
    img: "/mysql.svg",
  },
  {
    name: "MongoDB",
    img: "/mongodb.svg",
  },
  {
    name: "HTML",
    img: "/html-5.svg",
  },
  {
    name: "CSS",
    img: "/css-3.svg",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({ img, name }: { img: string; name: string }) => {
  return (
    <figure
      className={cn(
        "relative h-full w-32 cursor-pointer overflow-hidden rounded-xl border p-3",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row justify-center items-center gap-2">
        <img className="w-10 h-10 object-contain " alt={name} src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-white">
            {name}
          </figcaption>
        </div>
      </div>
    </figure>
  );
};

export function TechStack() {
  return (
    <div className="relative flex max-w-8/12 mx-auto flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.name} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.name} {...review} />
        ))}
      </Marquee>

      {/* <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div> */}
      {/* <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div> */}
    </div>
  );
}
