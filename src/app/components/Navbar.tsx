"use client";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="flex justify-between  max-lg:items-center w-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
        className="flex gap-6 items-center text-lg w-full  lg:max-w-1/2 text-white"
      >
        {/* <Image
          src="/me.png"
          alt="Logo"
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover"
        /> */}
        <Image
          src="/projects-img/logo.png"
          alt="Logo"
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover"
        />
        Jayson Caburatan
      </motion.div>

      <div className="w-full flex justify-end">
        <Link
          href="#contact-section"
          scroll={false}
          className="relative group cursor-pointer inline-block w-fit"
        >
          <motion.h3
            className="text-white text-lg text-right w-full font-semibold max-lg:block lg:hidden "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Get in touch
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </motion.h3>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
