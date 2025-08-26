"use client";
import { CircleUser } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import React from "react";

const Navbar = () => {
  return (
    <div className="flex justify-between  max-sm:items-center w-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
        className="flex gap-6 items-center text-lg w-full  md:max-w-1/2 text-white"
      >
        <Image
          src="/me.png"
          alt="Logo"
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover"
        />
        Jayson Caburatan
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
        className="text-white text-lg text-right w-full font-semibold max-sm:block md:hidden "
      >
        Get in touch
      </motion.h3>
    </div>
  );
};

export default Navbar;
