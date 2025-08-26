"use client";
import React from "react";
import { gsap } from "gsap";
import { motion } from "motion/react";

interface MenuItemProps {
  link: string;
  text: string;
  image: string;
}

interface FlowingMenuProps {
  items?: MenuItemProps[];
}

const FlowingMenu: React.FC<FlowingMenuProps> = ({ items = [] }) => {
  return (
    <div className="w-full min-h-full ">
      <nav className="flex flex-col h-full m-0 p-0">
        {items.map((item, idx) => (
          <MenuItem key={idx} {...item} />
        ))}
      </nav>
    </div>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({ link, text, image }) => {
  const itemRef = React.useRef<HTMLDivElement>(null);
  const marqueeRef = React.useRef<HTMLDivElement>(null);
  const marqueeInnerRef = React.useRef<HTMLDivElement>(null);

  const animationDefaults = { duration: 0.6, ease: "expo" };

  const findClosestEdge = (
    mouseX: number,
    mouseY: number,
    width: number,
    height: number
  ): "top" | "bottom" => {
    const topEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY, 2);
    const bottomEdgeDist =
      Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY - height, 2);
    return topEdgeDist < bottomEdgeDist ? "top" : "bottom";
  };

  const handleMouseEnter = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current)
      return;

    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(
      ev.clientX - rect.left,
      ev.clientY - rect.top,
      rect.width,
      rect.height
    );

    const tl = gsap.timeline({ defaults: animationDefaults });
    tl.set(marqueeRef.current, {
      y: edge === "top" ? "-101%" : "101%",
      opacity: 1,
      pointerEvents: "auto",
    })
      .set(marqueeInnerRef.current, { y: edge === "top" ? "101%" : "-101%" })
      .to([marqueeRef.current, marqueeInnerRef.current], { y: "0%" });
  };

  const handleMouseLeave = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current)
      return;

    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(
      ev.clientX - rect.left,
      ev.clientY - rect.top,
      rect.width,
      rect.height
    );

    const tl = gsap.timeline({ defaults: animationDefaults });
    tl.to(marqueeRef.current, {
      y: edge === "top" ? "-101%" : "101%",
      opacity: 0,
      pointerEvents: "none",
    }).to(marqueeInnerRef.current, {
      y: edge === "top" ? "101%" : "-101%",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
      className="flex max-sm:flex-col-reverse items-center justify-center w-full  relative h-[100px] border-b border-white/10 px-4"
      ref={itemRef}
    >
      {/* Floating animated image */}

      <div
        className="relative md:flex-1 h-full ml-6"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="absolute top-1/2 left-1/2 min-w-[500px] h-[350px] -translate-x-1/2 -translate-y-1/2 
                     bg-[#101014] overflow-hidden shadow-2xl rounded-xl opacity-0 pointer-events-none max-sm:w-[180px] max-sm:h-[120px]"
          ref={marqueeRef}
        >
          <div className="h-full w-full flex" ref={marqueeInnerRef}>
            <div className="relative w-full h-full will-change-transform">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <motion.a
        className="w-1/2 h-full flex items-center mr-auto mask-y-to-accent-foreground cursor-pointer font-semibold text-white text-[2rem] z-10 max-sm:text-2xl  md:w-1/3"
        href={link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ transition: "color 0.3s" }}
      >
        {text}
      </motion.a>
    </motion.div>
  );
};

export default FlowingMenu;
