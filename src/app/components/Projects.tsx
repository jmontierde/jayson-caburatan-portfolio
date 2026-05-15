"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

const projectData = [
  {
    title: "Sellora",
    img: "/projects-img/sellora.png",
    subTitle: "E-commerce Website",
    video: "",
    description:
      "Sellora is a SaaS ecommerce platform I built that helps merchants launch online stores powered by AI — featuring AI copywriting, smart chatbots, real-time analytics, and conversion-optimized storefronts.",
    projectUrl: "https://sellora-app.vercel.app",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Clerk Auth", "Convex", "Vercel"],
  },  
  {
    title: "Spend Wise",
    img: "/projects-img/spend-wise-web.png",
    mobileImg: "/projects-img/spend-wise-mobile.png",
    subTitle: "Expense Tracker",
    video: "",
    description:
      "SpendWise is an expense tracking app that helps users manage their budget, track spending, and gain insights into their financial habits.",
    projectUrl: "https://spend-wise-web-rho.vercel.app",
    techStack: ["React", "Redux", "TypeScript", "React Native", "Convex", "Clerk", "OAuth", "OpenAI", "Tailwind CSS"],
  },

  {
    title: "TutorAI",
    img: "/projects-img/tutor-ai.png",
    subTitle: "Learning Platform",
    video: "/vid/tutor-ai-vid.mov",
    description:
      "TutorAI is a learning app with an AI voice companion that teaches, answers questions, and makes lessons interactive.",
    projectUrl: "https://tutor-ai-saas.vercel.app/",
    techStack: ["Next.js", "TypeScript", "Vapi AI", "Supabase", "PostgreSQL", "Tailwind CSS", "Vercel"],
  },
  {
    title: "SentiAI",
    img: "/projects-img/senti-ai.png",
    subTitle: "Mental Health Companion",
    video: "/vid/senti-vid.mov",
    description:
      "SentiAI is a mental health companion app that offers supportive conversations, helping users reflect, manage emotions, and feel heard.",
    projectUrl: "https://senti-app-teal.vercel.app/",
    techStack: ["Next.js", "TypeScript", "OpenAI API", "Tailwind CSS", "Vercel"],
  },
  {
    title: "Vaping Sidewalk",
    subTitle: "E-commerce Website",
    img: "/projects-img/vaping.png",
    video: "/vid/vaping-sidewalk-vid.mov",
    description:
      "Vaping Sidewalk is an e-commerce website designed for browsing, shopping, and purchasing vaping products online.",
    projectUrl: "https://vapingsidewalk-client.onrender.com/",
    techStack: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "MUI"],
  },
];

const Projects = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  return (
    <div className="md:max-w-8/12 mx-auto z-50 px-4 sm:px-6 lg:px-8">
      <h1 className="text-[#BDBDBD] font-semibold text-lg pb-8 md:pb-16 lg:pb-24">
        Projects
      </h1>
      <main className="flex flex-col items-center justify-between gap-16 md:gap-24 lg:gap-[30vh]">
        {projectData.map((project, idx) => {
          const [ref, inView] = useInView({
            triggerOnce: true,
            threshold: isMobile ? 0.2 : 0.5,
          });

          return (
            <motion.section
              key={project.title}
              ref={ref}
              initial={{ opacity: 0, y: 70 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: "easeOut" }}
              className="w-full"
            >
              <div
                className={`flex ${
                  idx % 2 === 1 ? "md:flex-row-reverse" : ""
                } flex-col-reverse md:flex-row gap-6 md:gap-12 lg:gap-24`}
              >
                <div className="flex flex-col md:w-6/12 justify-center">
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[40px] font-bold">
                    {project.title}
                  </h2>
                  <h3 className="text-[#777171] text-base sm:text-lg font-normal">
                    {project.subTitle}
                  </h3>
                  <p className="text-[#777171] text-base sm:text-lg font-normal py-3 md:py-4 lg:py-6">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 pb-4 md:pb-6">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-sm font-medium bg-[#f0f0f0] text-[#555] rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group cursor-pointer inline-block w-fit"
                  >
                    <h5 className="text-lg sm:text-xl md:text-2xl font-bold">
                      View Project
                      <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
                    </h5>
                  </Link>
                </div>
                <div className={`w-full md:w-6/12 mx-auto relative md:self-center ${project.mobileImg ? "" : project.video ? "rounded-xl md:rounded-2xl shadow-lg overflow-hidden" : "overflow-hidden rounded-xl md:rounded-2xl shadow-lg aspect-video"}`}>
                  {project.video ? (
                    <video
                      className="w-full block"
                      autoPlay
                      loop
                      muted
                      playsInline
                    >
                      <source src={project.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : project.mobileImg ? (
                    <>
                      <div className="relative w-full aspect-video overflow-hidden rounded-xl md:rounded-2xl shadow-lg">
                        <Image
                          src={project.img}
                          alt={project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] aspect-[9/19] overflow-hidden rounded-xl md:rounded-2xl shadow-2xl border-[3px] border-white/20 z-10">
                        <Image
                          src={project.mobileImg}
                          alt={`${project.title} mobile`}
                          fill
                          sizes="(max-width: 768px) 28vw, 14vw"
                          className="object-cover"
                        />
                      </div>
                    </>
                  ) : (
                    <Image
                      src={project.img}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      priority={idx === 0}
                    />
                  )}
                </div>
              </div>
            </motion.section>
          );
        })}
      </main>
    </div>
  );
};

export default Projects;
