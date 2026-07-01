"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { GraduationCap, Award } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface Recognition {
  title: string;
  description: string;
  year: string;
}

const fallbackEducation = {
  degree: "Bachelor of Science in Information Technology",
  school: "STI College Caloocan",
  location: "Caloocan, Philippines",
  honors: ["Magna Cum Laude", "CGWA: 1.30"],
};

const fallbackRecognitions: Recognition[] = [
  {
    title: "Magna Cum Laude",
    description: "Graduated with high academic distinction",
    year: "2024",
  },
  {
    title: "Consistent President's Lister",
    description: "CGWA: 1.30",
    year: "2020 - 2024",
  },
];

const Education = () => {
  const eduRef = useRef(null);
  const isInView = useInView(eduRef, { once: true, margin: "-50px" });

  const remoteEdu = useQuery(api.education.get);
  const remoteRec = useQuery(api.recognitions.list);

  const edu = remoteEdu ?? fallbackEducation;
  const recognitions: Recognition[] =
    remoteRec && remoteRec.length > 0 ? remoteRec : fallbackRecognitions;

  return (
    <div className="flex flex-col gap-6 mt-10">
      <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1f] border border-[#2a2a30] rounded-full w-fit">
        <GraduationCap size={16} className="text-[#EDFF21]" />
        <span className="text-[#BDBDBD] text-sm font-semibold uppercase tracking-wider">
          Education
        </span>
      </div>

      <motion.div
        ref={eduRef}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="bg-[#1a1a1f] border border-[#2a2a30] rounded-2xl p-6"
      >
        <h3 className="text-white text-xl font-bold mb-1">{edu.degree}</h3>
        <p className="text-[#BDBDBD] text-sm">{edu.school}</p>
        <p className="text-[#8B8B8B] text-xs mt-0.5">{edu.location}</p>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          {edu.honors.map((h, i) => (
            <span
              key={h}
              className={
                i === 0
                  ? "px-3 py-1 text-xs font-medium rounded-full bg-[#EDFF21]/10 text-[#EDFF21] border border-[#EDFF21]/20"
                  : "px-3 py-1 text-xs font-medium rounded-full bg-white/5 text-[#BDBDBD] border border-white/10"
              }
            >
              {h}
            </span>
          ))}
        </div>
      </motion.div>

      <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1f] border border-[#2a2a30] rounded-full w-fit">
        <Award size={16} className="text-[#EDFF21]" />
        <span className="text-[#BDBDBD] text-sm font-semibold uppercase tracking-wider">
          Recognition
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {recognitions.map((item, i) => (
          <motion.div
            key={`${item.title}-${i}`}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-[#1a1a1f] border border-[#2a2a30] rounded-2xl p-4 hover:border-[#EDFF21]/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[#EDFF21]/40 text-xs font-mono">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[#EDFF21] text-xs font-semibold uppercase tracking-wider">
                {item.year}
              </span>
            </div>
            <h4 className="text-white font-semibold text-sm">{item.title}</h4>
            <p className="text-[#8B8B8B] text-xs mt-0.5">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Education;
