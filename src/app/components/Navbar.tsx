"use client";
import { motion } from "motion/react";
import Image from "next/image";

const navLinks = [
  { label: "Projects", href: "projects" },
  { label: "Services", href: "services" },
  { label: "Experience", href: "experience" },
  { label: "Contact", href: "contact" },
];

const Navbar = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 80; // navbar height + spacing
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] md:w-2/3"
    >
      <div className="flex justify-between items-center px-6 py-4 rounded-2xl bg-[#101014] border border-white/10">
        <div className="flex gap-3 items-center text-white">
          <Image
            src="/projects-img/logo.png"
            alt="Logo"
            width={36}
            height={36}
            className="w-9 h-9 rounded-lg object-cover"
          />
          <span className="font-semibold text-base px-3">Jayson Caburatan</span>
        </div>

        <nav className="hidden md:flex items-center gap-0.5 bg-white/5 rounded-xl p-1">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="px-4 py-1.5 text-sm text-[#8B8B8B] hover:text-white rounded-lg hover:bg-white/10 transition-all duration-300 cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Mobile - just show Get in touch */}
        <button
          className="md:hidden relative group cursor-pointer"
          onClick={() => scrollTo("contact")}
        >
          <span className="text-white text-base font-semibold">
            Get in touch
          </span>
        </button>
      </div>
    </motion.div>
  );
};

export default Navbar;
