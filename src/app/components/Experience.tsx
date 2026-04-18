"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase } from "lucide-react";

interface ExperienceItem {
  role: string;
  company: string;
  location: string;
  dateRange: string;
  tags: string[];
  bullets: string[];
}

const experiences: ExperienceItem[] = [
  {
    role: "Frontend Developer",
    company: "Tito Solutions",
    location: "Remote",
    dateRange: "January 2025 - Present",
    tags: ["Next.js", "TypeScript", "Supabase", "Zustand", "React Native", "Tailwind CSS", "ShadCN"],
    bullets: [
      "Maintained and enhanced a production-scale SaaS platform using Next.js, TypeScript, Supabase, and Zustand.",
      "Revamped UI with Tailwind CSS and ShadCN, replacing MUI for better design and performance.",
      "Collaborated using Agile methodologies with GitHub, Jira, and Vercel, contributing to sprint planning, code reviews, and continuous deployment.",
      "Developed and maintained the GaniTable mobile ordering system using React Native, handling order flows, UI implementation, and integration with backend services.",
    ],
  },
  {
    role: "Software Engineer",
    company: "AFS (Accelerated Fleet Services)",
    location: "Remote",
    dateRange: "September 2025 - February 2026",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "React Native", "PostgreSQL"],
    bullets: [
      "Led frontend development using Next.js, React, TypeScript, Tailwind CSS, and ShadCN, building a responsive and scalable fleet management platform.",
      "Collaborated with backend developers and clients, implementing features with Node.js, Express, and PostgreSQL, including service orders, inventory, and technician management.",
      "Developed a Voice AI Copilot using React Native and improved performance using Zustand and React Query.",
    ],
  },
  {
    role: "Software Developer",
    company: "Freelance (Web & Mobile)",
    location: "Remote",
    dateRange: "May 2023 - December 2024",
    tags: ["React", "Next.js", "React Native", "Node.js", "Express", "Tailwind CSS"],
    bullets: [
      "Designed and built custom web and mobile applications using React, Next.js, React Native, Node.js, Express, and Tailwind CSS, tailored to client needs.",
      "Managed projects end-to-end, from requirements gathering to deployment and client handoff.",
      "Delivered responsive, intuitive, and user-friendly interfaces across multiple projects.",
    ],
  },
  {
    role: "SAP ABAP Developer Intern",
    company: "Accenture Philippines",
    location: "On-site",
    dateRange: "Internship",
    tags: ["SAP", "ABAP"],
    bullets: [
      "Completed an internship as an SAP ABAP Programmer, assisting in developing, testing, and maintaining SAP programs.",
    ],
  },
];

const ExperienceCard = ({
  exp,
  index,
}: {
  exp: ExperienceItem;
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative pl-8 md:pl-12 pb-12 last:pb-0 group"
    >
      {/* Timeline line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-[#EDFF21] to-[#EDFF21]/10 group-last:bg-gradient-to-b group-last:from-[#EDFF21] group-last:to-transparent" />

      {/* Timeline dot */}
      <div className="absolute left-0 top-1 -translate-x-1/2 w-3 h-3 rounded-full bg-[#EDFF21] shadow-[0_0_12px_rgba(237,255,33,0.5)]" />

      {/* Card */}
      <div className="bg-[#1a1a1f] border border-[#2a2a30] rounded-2xl p-6 hover:border-[#EDFF21]/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(237,255,33,0.05)]">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
          <div>
            <h3 className="text-white text-xl font-semibold">{exp.role}</h3>
            <p className="text-[#BDBDBD] text-sm">{exp.company}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[#EDFF21] text-xs font-semibold uppercase tracking-wider">
              {exp.dateRange}
            </p>
            <p className="text-[#8B8B8B] text-xs">{exp.location}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {exp.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-medium rounded-full bg-[#EDFF21]/10 text-[#EDFF21] border border-[#EDFF21]/20"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Bullets */}
        <ul className="space-y-2">
          {exp.bullets.map((bullet, i) => (
            <li
              key={i}
              className="text-[#BDBDBD] text-sm leading-relaxed flex gap-2"
            >
              <span className="text-[#EDFF21] mt-1 shrink-0">&#8226;</span>
              {bullet}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

const Experience = () => {
  return (
    <div className="flex flex-col gap-16">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1f] border border-[#2a2a30] rounded-full">
          <Briefcase size={16} className="text-[#EDFF21]" />
          <span className="text-[#BDBDBD] text-sm font-semibold uppercase tracking-wider">
            Career Path
          </span>
        </div>
      </div>

      <div>
        <h2 className="text-white text-3xl md:text-4xl font-bold mb-2">
          Experience
        </h2>
        <p className="text-[#8B8B8B] text-base mb-10">
          Recent roles and the systems I've been trusted to build.
        </p>

        {/* Timeline */}
        <div className="relative">
          {experiences.map((exp, i) => (
            <ExperienceCard key={exp.company} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experience;
