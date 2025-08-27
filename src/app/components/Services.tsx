"use client";
import { div } from "motion/react-client";
import React from "react";

const Services = () => {
  return (
    <div className="flex flex-col gap-12 text-2xl">
      <h1 className="text-[#BDBDBD] text-lg font-semibold">Services</h1>
      <div className="flex flex-col md:flex-row items-center justify-center gap-12">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl text-white">🎨 UI/UX Design</h2>
          <p className="text-base text-[#BDBDBD]">
            Clean, modern, and easy-to-use designs that make your website or app
            enjoyable on any device.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl text-white">⚡Frontend Development</h2>
          <p className="text-base text-[#BDBDBD]">
            Fast, responsive, and interactive websites built with React,
            Next.js, and the latest tools.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl text-white">🛠 Backend Development</h2>
          <p className="text-base text-[#BDBDBD]">
            Secure and scalable backends with custom APIs and databases built to
            fit your needs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Services;
