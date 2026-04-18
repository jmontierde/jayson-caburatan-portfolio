"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GraduationCap, Award } from "lucide-react";

interface Recognition {
  title: string;
  description: string;
  year: string;
}

const recognitions: Recognition[] = [
  {
    title: "Best in IT Student Internship",
    description: "Academic distinction from PLV",
    year: "2024",
  },
  {
    title: "2x Web Designing 2nd Placer",
    description: "Competitive design recognition",
    year: "2023",
  },
  {
    title: "Dean's Lister",
    description: "Maintained a 1.3 and 1.49 GWA",
    year: "2023 - 2024",
  },
];

const Education = () => {
  const eduRef = useRef(null);
  const isInView = useInView(eduRef, { once: true, margin: "-50px" });

  return (
    <div className="flex flex-col gap-6">
      {/* Section Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1f] border border-[#2a2a30] rounded-full w-fit">
        <GraduationCap size={16} className="text-[#EDFF21]" />
        <span className="text-[#BDBDBD] text-sm font-semibold uppercase tracking-wider">
          Education
        </span>
      </div>

      {/* Education Card */}
      <motion.div
        ref={eduRef}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="bg-[#1a1a1f] border border-[#2a2a30] rounded-2xl p-5"
      >
        <h3 className="text-white text-lg font-bold mb-1">
          Bachelor of Science in Information Technology
        </h3>
        <p className="text-[#BDBDBD] text-sm">
          Pamantasan ng Lungsod ng Valenzuela (PLV)
        </p>
        <p className="text-[#8B8B8B] text-xs mt-0.5">
          Valenzuela, Philippines
        </p>
      </motion.div>

      {/* Recognition Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1f] border border-[#2a2a30] rounded-full w-fit">
        <Award size={16} className="text-[#EDFF21]" />
        <span className="text-[#BDBDBD] text-sm font-semibold uppercase tracking-wider">
          Recognition
        </span>
      </div>

      {/* Recognition Cards */}
      <div className="flex flex-col gap-3">
        {recognitions.map((item, i) => (
          <motion.div
            key={item.title}
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
