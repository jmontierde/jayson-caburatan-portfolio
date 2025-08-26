"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { sub, video } from "motion/react-client";
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
  return (
    <div className="md:max-w-8/12 mx-auto z-50 px-6">
      <h1 className="text-[#BDBDBD] font-semibold text-base pb-12 md:pb-24">
        Projects
      </h1>
      <main className="flex flex-col items-center justify-between gap-24 md:gap-[30vh]">
        {projectData.map((project, idx) => {
          const [ref, inView] = useInView({
            triggerOnce: true,
            threshold: 0.5,
          });
          return (
            <motion.section
              key={project.title}
              ref={ref}
              initial={{ opacity: 0, y: 70 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: "easeOut" }}
              className=""
            >
              <div className="flex max-sm:flex-col-reverse gap-6  md:gap-24 ">
                <div className="flex flex-col md:w-6/12 justify-center">
                  <h2 className="text-2xl md:text-[40px] font-bold">
                    {project.title}
                  </h2>
                  <h3 className="text-[#777171] text-lg font-normal">
                    {project.subTitle}
                  </h3>
                  <p className="text-[#777171] text-lg font-normal py-3 md:py-6">
                    {project.description}
                  </p>
                  <Link
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer"
                  >
                    <h5 className="text-2xl font-bold">View Project</h5>
                  </Link>
                </div>
                <div className="w-full md:w-6/12 mx-auto relative overflow-hidden rounded-2xl shadow-lg">
                  {project.video ? (
                    <video
                      className="w-full h-auto max-h-[400px] object-contain"
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
                      width={600}
                      height={400}
                      className="w-full h-auto max-h-[400px] object-contain"
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
