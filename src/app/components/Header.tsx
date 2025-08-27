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
              I’m a passionate Web Developer
            </span>{" "}
            who enjoys transforming ideas into interactive and user-friendly
            digital experiences. I aim to build applications that are not only
            functional but also intuitive and visually engaging.
          </motion.h2>

          <Link
            href="#contact-section"
            scroll={false}
            className="relative group cursor-pointer inline-block w-fit"
          >
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
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </motion.h3>
          </Link>

          {/* <Link
            href={project.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative group cursor-pointer inline-block w-fit"
          >
            <h5 className="text-lg sm:text-xl md:text-2xl font-bold">
              View Project
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
            </h5>
          </Link> */}
        </div>
      </div>
    </motion.section>
  );
};

export default Header;
