"use client";
import Projects from "./components/Prrojects";
import Ribbons from "./components/Ribons";
import Threads from "./components/Threads";
import FlowingMenu from "./components/FlowingMenu";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import { TechStack } from "./components/TechStack";
import Footer from "./components/Footer";
import { motion } from "motion/react";

export default function Home() {
  const demoItems = [
    {
      link: "#",
      text: "Vaping Sidewalk",
      image: "/projects-img/vaping.png",
    },
    {
      link: "#",
      text: "SentiAI",
      image: "/projects-img/senti-ai1.png",
    },
    {
      link: "#",
      text: "TutorAI",
      image: "/projects-img/tutor-ai.png",
    },
    {
      link: "#",
      text: "Delicia",
      image: "/projects-img/delicia.png",
    },
  ];

  return (
    <div className="bg-[#333333] h-full scroll-smooth">
      <main className="bg-[#101014] min-h-[100vh] ">
        <div
          style={{ width: "100%", height: "800px", position: "relative" }}
          className="relative   min-h-[100vh] bg-[#101014] rounded-b-xl"
        >
          <Threads amplitude={1} distance={0} enableMouseInteraction={true} />

          <div className="absolute  px-6 w-full min-h-screen flex flex-col justify-between  top-0 left-0 z-0">
            <Header />
            <div className="w-full md:w-8/12  mx-auto z-50">
              <FlowingMenu items={demoItems} />
            </div>
          </div>
        </div>
      </main>
      <div className="w-full py-24 bg-[#101014] rounded-b-[48px]">
        <TechStack />
      </div>
      <motion.section
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="md:w-1/2 mx-auto text-white py-12 md:py-24 flex flex-col gap-6 px-6 md:px-0"
      >
        <p className="text-2xl md:text-[32px] md:text-center">
          I love turning concepts into real projects. Whether it’s building a
          platform or crafting a small feature, I aim to deliver work that adds
          value and makes a difference.
        </p>
      </motion.section>
      <section className="w-full z-50">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-3 py-12 md:py-24  bg-white rounded-[48px]"
        >
          <Projects />
        </motion.div>
      </section>
      <motion.section
        className="py-3 px-3 "
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        id="contact"
      >
        <Footer />
      </motion.section>
    </div>
  );
}
