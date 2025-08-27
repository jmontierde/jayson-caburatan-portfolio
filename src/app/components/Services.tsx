"use client";
import React from "react";

const Services = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-12">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl text-white">🎨 UI/UX Design</h2>
        <p className="text-base text-[#BDBDBD]">
          Intuitive and user-friendly interfaces designed to provide smooth user
          experiences across all devices.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl text-white">⚡ Frontend Development</h2>
        <p className="text-base text-[#BDBDBD]">
          Pixel-perfect, interactive, and optimized frontends using React,
          Next.js, and modern frameworks.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl text-white">🛠 Backend Development</h2>
        <p className="text-base text-[#BDBDBD]">
          Secure and reliable backend systems with APIs and databases tailored
          to your project needs.
        </p>
      </div>
    </div>
  );
};

export default Services;
