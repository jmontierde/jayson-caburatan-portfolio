"use client";
import Projects from "./components/Projects";
import Threads from "./components/Threads";
import FlowingMenu from "./components/FlowingMenu";
import Header from "./components/Header";
import { TechStack } from "./components/TechStack";
import Footer from "./components/Footer";
import { motion } from "motion/react";
import Services from "./components/Services";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const fallbackMenuItems = [
  { link: "#projects", text: "Vaping Sidewalk", image: "/projects-img/vaping.png" },
  { link: "#projects", text: "SentiAI", image: "/projects-img/senti-ai1.png" },
  { link: "#projects", text: "TutorAI", image: "/projects-img/tutor-ai.png" },
  { link: "#projects", text: "Delicia", image: "/projects-img/delicia.png" },
  { link: "#projects", text: "Spend Wise", image: "/projects-img/spend-wise-web.png" },
];

export default function Home() {
  const remoteMenu = useQuery(api.flowingMenu.list);
  const demoItems =
    remoteMenu && remoteMenu.length > 0
      ? remoteMenu.map((m) => ({ link: m.link, text: m.text, image: m.image }))
      : fallbackMenuItems;

  return (
    <div className="bg-[#333333] h-full scroll-smooth overflow-hidden">
      <Navbar />
      <main className="bg-[#101014] min-h-[100vh] mx-auto ">
        <div
          style={{ width: "100%", position: "relative" }}
          className="relative   min-h-[100vh] bg-[#101014] rounded-b-xl"
        >
          <div className="absolute inset-0 z-0">
            <Threads amplitude={1} distance={0} enableMouseInteraction={true} />
          </div>

          <div className="relative  px-6 w-full min-h-screen flex flex-col justify-between  z-10">
            <Header />
            <div className="w-full md:w-8/12  mx-auto z-10">
              <FlowingMenu items={demoItems} />
            </div>
          </div>
        </div>
      </main>
      <div className="w-full px-6 py-24 bg-[#101014] rounded-b-[48px]">
        <TechStack />
      </div>
      <motion.section
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        id="services"
        className="md:w-2/3 mx-auto text-white py-12 md:py-24 flex flex-col gap-6 px-6 md:px-0 scroll-mt-24"
      >
        <Services />
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        id="experience"
        className="md:w-2/3 mx-auto text-white py-12 md:py-24 flex flex-col gap-6 px-6 md:px-0 scroll-mt-24"
      >
        <Experience />
        <Education />
      </motion.section>
      <section className="w-full z-50">
        <motion.div
          id="projects"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-3 py-12 md:py-24  bg-white rounded-[48px] scroll-mt-24"
        >
          <Projects />
        </motion.div>
      </section>
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        id="contact"
        className="py-3 px-3 scroll-mt-24"
      >
        <Footer />
      </motion.section>
      <Chatbot />
    </div>
  );
}
