"use client";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

type Service = { title: string; description: string };

const fallbackServices: Service[] = [
  {
    title: "🎨 UI/UX Design",
    description:
      "Clean, modern, and easy-to-use designs that make your website or app enjoyable on any device.",
  },
  {
    title: "⚡Frontend Development",
    description:
      "Fast, responsive, and interactive websites built with React, Next.js, and the latest tools.",
  },
  {
    title: "🛠 Backend Development",
    description:
      "Secure and scalable backends with custom APIs and databases built to fit your needs.",
  },
];

const Services = () => {
  const remote = useQuery(api.services.list);
  const services: Service[] = remote && remote.length > 0 ? remote : fallbackServices;

  return (
    <div className="flex flex-col gap-12 text-2xl">
      <h1 className="text-[#BDBDBD] text-lg font-semibold">Services</h1>
      <div className="flex flex-col md:flex-row items-center justify-center gap-12">
        {services.map((s) => (
          <div key={s.title} className="flex flex-col gap-2">
            <h2 className="text-2xl text-white">{s.title}</h2>
            <p className="text-base text-[#BDBDBD]">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
