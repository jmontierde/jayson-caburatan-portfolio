"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.section className="bg-[#101014] rounded-[40px] py-6 z-10">
      <div className="w-full md:max-w-8/12 mx-auto flex flex-col gap-3 justify-center px-6 py-24 text-white">
        <h2 className="text-white font-semibold text-lg md:text-2xl">
          Let’s build something great together
        </h2>
        <h1 className="text-[#EDFF21] font-semibold text-xl md:text-[32px]">
          <Link
            href="mailto:caburatanjayson92@gmail.com"
            className="hover:underline"
          >
            caburatanjayson92@gmail.com
          </Link>{" "}
          |{" "}
          <Link
            href="https://www.facebook.com/devchiefs"
            passHref
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-xl md:text-[32px]"
          >
            DevChiefs
          </Link>
        </h1>
        <h2 className="text-[#8B8B8B] text-lg md:text-2xl">
          Got an idea in mind? Send me an email and let’s make it happen.
        </h2>
      </div>
    </motion.section>
  );
};

export default Footer;
