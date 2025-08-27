"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

const projectData = [
  {
    title: "Vaping Sidewalk",
    subTitle: "E-commerce Website",
    img: "/projects-img/vaping.png",
    video: "/vid/vaping-sidewalk-vid.mov",
    description:
      "Vaping Sidewalk is an e-commerce website designed for browsing, shopping, and purchasing vaping products online.",
    projectUrl: "https://vapingsidewalk-client.onrender.com/",
  },
  {
    title: "SentiAI",
    img: "/projects-img/senti-ai.png",
    subTitle: "Mental Health Companion",
    video: "/vid/senti-vid.mov",
    description:
      "SentiAI is a mental health companion app that offers supportive conversations, helping users reflect, manage emotions, and feel heard.",
    projectUrl: "https://senti-app-teal.vercel.app/",
  },
  {
    title: "TutorAI",
    img: "/projects-img/tutor-ai.png",
    subTitle: "Learning Platform",
    video: "/vid/tutor-ai-vid.mov",
    description:
      "TutorAI is a learning app with an AI voice companion that teaches, answers questions, and makes lessons interactive.",
    projectUrl: "https://tutor-ai-saas.vercel.app/",
  },
  {
    title: "Delicia",
    img: "/projects-img/delicia.png",
    subTitle: "Recipe App",
    video: "",
    description:
      "Delicia is a recipe app that lets users discover, save, and explore a variety of dishes with easy-to-follow instructions.",
    projectUrl: "https://delicia-recipes.vercel.app/",
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
      <h1 className="text-[#BDBDBD] font-semibold text-base pb-8 md:pb-16 lg:pb-24">
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
                <div className="w-full md:w-6/12 mx-auto relative overflow-hidden rounded-xl md:rounded-2xl shadow-lg aspect-video">
                  {project.video ? (
                    <video
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    >
                      <source src={project.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
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
