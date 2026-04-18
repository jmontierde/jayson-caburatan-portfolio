"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";

const socials = [
  {
    icon: Github,
    href: "https://github.com/jmontierde",
    label: "GitHub",
  },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/jayson-caburatan",
    label: "LinkedIn",
  },
  {
    icon: Mail,
    href: "mailto:caburatanjayson92@gmail.com",
    label: "Email",
  },
];

const Header = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex flex-col lg:w-2/3 mx-auto text-2xl pt-28 pb-12 gap-12">
        {/* Hero content */}
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 pt-4">
          {/* Left - Image */}
          <motion.div
            className="relative shrink-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          >
            <div className="w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden border-2 border-[#EDFF21]/30 shadow-[0_0_30px_rgba(237,255,33,0.15)]">
              <Image
                src="/me.png"
                alt="Jayson Caburatan"
                width={208}
                height={208}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-[3px] border-[#101014]" />
          </motion.div>

          {/* Right - Info */}
          <div className="flex flex-col gap-5 text-center md:text-left">
            <motion.div
              className="flex flex-col sm:flex-row items-center md:items-start gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Available for work
              </span>
              <span className="flex items-center gap-1 text-[#8B8B8B] text-xs">
                <MapPin size={12} />
                Philippines
              </span>
            </motion.div>

            <motion.h2
              className="text-[#bdbdbd] leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.7 }}
            >
              <span className="text-white font-semibold">
                I&apos;m a passionate Fullstack Developer
              </span>{" "}
              who enjoys transforming ideas into interactive and user-friendly
              digital experiences. I aim to build applications that are not only
              functional but also intuitive and visually engaging.
            </motion.h2>

            <motion.div
              className="flex flex-wrap justify-center md:justify-start gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.9 }}
            >
              {["React", "Next.js", "TypeScript", "React Native", "Node.js", "Supabase", "Convex", "Zustand" ,"PostgreSQL"].map(
                (tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-white/5 text-[#BDBDBD] border border-white/10"
                  >
                    {tech}
                  </span>
                )
              )}
            </motion.div>

            <motion.div
              className="flex items-center justify-center md:justify-start gap-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 1 }}
            >
              <Link
                href="#contact"
                scroll={false}
                className="relative group cursor-pointer inline-block w-fit"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("contact");
                  if (!el) return;
                  const top = el.getBoundingClientRect().top + window.scrollY - 80;
                  window.scrollTo({ top, behavior: "smooth" });
                }}
              >
                <span className="text-white font-semibold text-2xl">
                  Get in touch
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full" />
                </span>
              </Link>

              <div className="flex items-center gap-3">
                {socials.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#8B8B8B] hover:text-[#EDFF21] hover:border-[#EDFF21]/30 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon size={16} />
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Header;
