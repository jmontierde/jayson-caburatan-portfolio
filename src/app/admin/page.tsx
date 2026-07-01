"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import { useAdminAuth } from "./AdminAuth";
import { Button } from "./ui";
import HeaderEditor from "./sections/HeaderEditor";
import EducationEditor from "./sections/EducationEditor";
import ProjectsEditor from "./sections/ProjectsEditor";
import ExperienceEditor from "./sections/ExperienceEditor";
import ServicesEditor from "./sections/ServicesEditor";
import TechStackEditor from "./sections/TechStackEditor";
import RecognitionsEditor from "./sections/RecognitionsEditor";
import SocialsEditor from "./sections/SocialsEditor";
import FlowingMenuEditor from "./sections/FlowingMenuEditor";

const TABS = [
  { key: "header", label: "Header" },
  { key: "flowingMenu", label: "Hero Menu" },
  { key: "techStack", label: "Tech Stack" },
  { key: "services", label: "Services" },
  { key: "experience", label: "Experience" },
  { key: "education", label: "Education" },
  { key: "recognitions", label: "Recognitions" },
  { key: "projects", label: "Projects" },
  { key: "socials", label: "Socials" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function AdminDashboard() {
  const router = useRouter();
  const { token, setToken } = useAdminAuth();
  const session = useQuery(api.auth.verifySession, token ? { token } : "skip");
  const logout = useMutation(api.auth.logout);
  const seedAll = useMutation(api.seed.seedAll);
  const [tab, setTab] = useState<TabKey>("projects");
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    if (!token) router.replace("/admin/login");
    else if (session && !session.valid) {
      setToken(null);
      router.replace("/admin/login");
    }
  }, [token, session, router, setToken]);

  if (!token || !session?.valid) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-[#8B8B8B]">
        Checking session...
      </div>
    );
  }

  async function doLogout() {
    if (token) await logout({ token });
    setToken(null);
    router.replace("/admin/login");
  }

  async function doSeed() {
    if (!token) return;
    if (!confirm("This will RESET all CMS content to the original defaults. Continue?")) return;
    setSeeding(true);
    try {
      await seedAll({ token });
      alert("Seeded");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-6">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Portfolio CMS</h1>
          <p className="text-sm text-[#8B8B8B]">
            <Link href="/" className="underline hover:text-[#EDFF21]">
              ← View site
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={doSeed} disabled={seeding}>
            {seeding ? "Seeding..." : "Seed defaults"}
          </Button>
          <Button variant="ghost" onClick={doLogout}>
            Log out
          </Button>
        </div>
      </header>

      <nav className="flex flex-wrap gap-2 border-b border-[#2a2a30] pb-3">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={
              "px-3 py-1.5 rounded-lg text-sm transition " +
              (tab === t.key
                ? "bg-[#EDFF21] text-black font-semibold"
                : "bg-white/5 text-[#BDBDBD] hover:bg-white/10")
            }
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main>
        {tab === "header" && <HeaderEditor token={token} />}
        {tab === "flowingMenu" && <FlowingMenuEditor token={token} />}
        {tab === "techStack" && <TechStackEditor token={token} />}
        {tab === "services" && <ServicesEditor token={token} />}
        {tab === "experience" && <ExperienceEditor token={token} />}
        {tab === "education" && <EducationEditor token={token} />}
        {tab === "recognitions" && <RecognitionsEditor token={token} />}
        {tab === "projects" && <ProjectsEditor token={token} />}
        {tab === "socials" && <SocialsEditor token={token} />}
      </main>
    </div>
  );
}
