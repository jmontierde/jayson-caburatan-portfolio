import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireAdmin } from "./auth";

// One-shot seed of the existing hardcoded content. Idempotent: clears
// existing rows in each table before inserting, so re-running resets to defaults.
export const seedAll = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireAdmin(ctx, token);

    // Wipe everything except sessions.
    const tables = [
      "header",
      "socials",
      "flowingMenu",
      "techStack",
      "services",
      "experience",
      "education",
      "recognitions",
      "projects",
    ] as const;
    for (const t of tables) {
      const rows = await ctx.db.query(t).collect();
      for (const r of rows) await ctx.db.delete(r._id);
    }

    // Header singleton
    await ctx.db.insert("header", {
      key: "main",
      imageUrl: "/me.png",
      availability: "Available for work",
      location: "Philippines",
      bioBold: "I'm a passionate Fullstack Developer",
      bioRest:
        "who enjoys transforming ideas into interactive and user-friendly digital experiences. I aim to build applications that are not only functional but also intuitive and visually engaging.",
      techTags: [
        "React",
        "Next.js",
        "TypeScript",
        "React Native",
        "Node.js",
        "Supabase",
        "Convex",
        "Zustand",
        "PostgreSQL",
      ],
    });

    // Socials
    const socials = [
      { icon: "github", href: "https://github.com/jmontierde", label: "GitHub" },
      {
        icon: "linkedin",
        href: "https://www.linkedin.com/in/jayson-caburatan",
        label: "LinkedIn",
      },
      { icon: "mail", href: "mailto:caburatanjayson92@gmail.com", label: "Email" },
    ];
    for (let i = 0; i < socials.length; i++) {
      await ctx.db.insert("socials", { ...socials[i], sortOrder: i });
    }

    // Flowing menu
    const menu = [
      { text: "Vaping Sidewalk", image: "/projects-img/vaping.png", link: "#projects" },
      { text: "SentiAI", image: "/projects-img/senti-ai1.png", link: "#projects" },
      { text: "TutorAI", image: "/projects-img/tutor-ai.png", link: "#projects" },
      { text: "Delicia", image: "/projects-img/delicia.png", link: "#projects" },
      {
        text: "Spend Wise",
        image: "/projects-img/spend-wise-web.png",
        link: "#projects",
      },
    ];
    for (let i = 0; i < menu.length; i++) {
      await ctx.db.insert("flowingMenu", { ...menu[i], sortOrder: i });
    }

    // Tech stack
    const tech = [
      { name: "TypeScript", img: "/typescript-icon.svg" },
      { name: "React", img: "/react.svg" },
      { name: "Next.js", img: "/nextjs-icon.svg" },
      { name: "Javascript", img: "/javascript.svg" },
      { name: "Node.js", img: "/nodejs-icon.svg" },
      { name: "PostgreSQL", img: "/postgresql.svg" },
      { name: "MySQL", img: "/mysql.svg" },
      { name: "MongoDB", img: "/mongodb.svg" },
      { name: "HTML", img: "/html-5.svg" },
      { name: "CSS", img: "/css-3.svg" },
    ];
    for (let i = 0; i < tech.length; i++) {
      await ctx.db.insert("techStack", { ...tech[i], sortOrder: i });
    }

    // Services
    const services = [
      {
        title: "🎨 UI/UX Design",
        description:
          "Clean, modern, and easy-to-use designs that make your website or app enjoyable on any device.",
      },
      {
        title: "⚡Frontend Development",
        description:
          "Fast, responsive, and interactive websites built with React, Next.js, and the latest tools.",
      },
      {
        title: "🛠 Backend Development",
        description:
          "Secure and scalable backends with custom APIs and databases built to fit your needs.",
      },
    ];
    for (let i = 0; i < services.length; i++) {
      await ctx.db.insert("services", { ...services[i], sortOrder: i });
    }

    // Experience
    const experience = [
      {
        role: "Frontend Developer",
        company: "Tito Solutions",
        location: "Remote",
        dateRange: "January 2025 - Present",
        tags: [
          "Next.js",
          "TypeScript",
          "Supabase",
          "Zustand",
          "React Native",
          "Tailwind CSS",
          "ShadCN",
        ],
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
        tags: [
          "Next.js",
          "React",
          "TypeScript",
          "Tailwind CSS",
          "React Native",
          "PostgreSQL",
        ],
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
        tags: [
          "React",
          "Next.js",
          "React Native",
          "Node.js",
          "Express",
          "Tailwind CSS",
        ],
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
    for (let i = 0; i < experience.length; i++) {
      await ctx.db.insert("experience", { ...experience[i], sortOrder: i });
    }

    // Education singleton
    await ctx.db.insert("education", {
      key: "main",
      degree: "Bachelor of Science in Information Technology",
      school: "STI College Caloocan",
      location: "Caloocan, Philippines",
      honors: ["Magna Cum Laude", "CGWA: 1.30"],
    });

    // Recognitions
    const recognitions = [
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
    for (let i = 0; i < recognitions.length; i++) {
      await ctx.db.insert("recognitions", { ...recognitions[i], sortOrder: i });
    }

    // Projects
    const projects = [
      {
        title: "Spend Wise",
        img: "/projects-img/spend-wise-web.png",
        mobileImg: "/projects-img/spend-wise-mobile.png",
        subTitle: "Expense Tracker",
        video: undefined,
        description:
          "SpendWise is an expense tracking app that helps users manage their budget, track spending, and gain insights into their financial habits.",
        projectUrl: "https://spend-wise-web-rho.vercel.app",
        techStack: [
          "React",
          "Redux",
          "TypeScript",
          "React Native",
          "Convex",
          "Clerk",
          "OAuth",
          "OpenAI",
          "Tailwind CSS",
        ],
      },
      {
        title: "SentiAI",
        img: "/projects-img/senti-ai.png",
        mobileImg: undefined,
        subTitle: "Mental Health Companion",
        video: "/vid/senti-vid.mov",
        description:
          "SentiAI is a mental health companion app that offers supportive conversations, helping users reflect, manage emotions, and feel heard.",
        projectUrl: "https://senti-app-teal.vercel.app/",
        techStack: ["Next.js", "TypeScript", "OpenAI API", "Tailwind CSS", "Vercel"],
      },
      {
        title: "TutorAI",
        img: "/projects-img/tutor-ai.png",
        mobileImg: undefined,
        subTitle: "Learning Platform",
        video: "/vid/tutor-ai-vid.mov",
        description:
          "TutorAI is a learning app with an AI voice companion that teaches, answers questions, and makes lessons interactive.",
        projectUrl: "https://tutor-ai-saas.vercel.app/",
        techStack: [
          "Next.js",
          "TypeScript",
          "Vapi AI",
          "Supabase",
          "PostgreSQL",
          "Tailwind CSS",
          "Vercel",
        ],
      },
      {
        title: "Vaping Sidewalk",
        subTitle: "E-commerce Website",
        img: "/projects-img/vaping.png",
        mobileImg: undefined,
        video: "/vid/vaping-sidewalk-vid.mov",
        description:
          "Vaping Sidewalk is an e-commerce website designed for browsing, shopping, and purchasing vaping products online.",
        projectUrl: "https://vapingsidewalk-client.onrender.com/",
        techStack: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "MUI"],
      },
      {
        title: "Delicia",
        img: "/projects-img/delicia.png",
        mobileImg: undefined,
        subTitle: "Recipe App",
        video: undefined,
        description:
          "Delicia is a recipe app that lets users discover, save, and explore a variety of dishes with easy-to-follow instructions.",
        projectUrl: "https://delicia-recipes.vercel.app/",
        techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
      },
    ];
    for (let i = 0; i < projects.length; i++) {
      await ctx.db.insert("projects", { ...projects[i], sortOrder: i });
    }

    return { ok: true };
  },
});
