"use client";
import React from "react";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
import Link from "next/link";

const Header = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex max-lg:flex-col flex-row justify-between lg:w-2/3 lg:min-h-[600px] mx-auto items-start text-2xl py-12">
        <Navbar />

        <div className="flex flex-col gap-6 pt-16 lg:pt-0 lg:w-1/2 ">
          <motion.h2
            className="text-[#bdbdbd] text-left leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
          >
            <span className="text-white font-semibold">
              Passionate Web Developer
            </span>{" "}
            who loves turning ideas into interactive, user-friendly digital
            experiences with a focus on clean code and modern design.
          </motion.h2>

          <Link href="#contact-section" scroll={false}>
            <motion.h3
              className="text-white font-semibold max-sm:hidden md:block "
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Get in touch
            </motion.h3>
          </Link>
        </div>
      </div>
    </motion.section>
  );
};

export default Header;
