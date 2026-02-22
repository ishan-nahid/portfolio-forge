import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";
import { TechStack } from "@/components/portfolio/TechStack";
import { Projects } from "@/components/portfolio/Projects";
import { Experience } from "@/components/portfolio/Experience";
import { BentoGrid } from "@/components/portfolio/BentoGrid";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type ProfileData = {
  full_name: string;
  role: string;
  bio: string;
  github_url: string;
  linkedin_url: string;
  resume_url?: string;
  email?: string;
  avatar_url?: string;
};

type ProjectData = {
  title: string;
  description: string;
  github_url: string;
  live_url: string;
  image_url: string;
};

type SkillData = {
  name: string;
  category: string;
};

type ExperienceData = {
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  description: string;
};

type AboutData = {
  education: {
    degree: string;
    university: string;
    gpa: string;
    coursework: string[];
  };
  volunteering: string[];
  awards: string[];
  hobbies: string[];
};

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const fallbackProfile: ProfileData = {
  full_name: "John Doe",
  role: "Software Engineer",
  bio: "Building awesome things.",
  github_url: "#",
  linkedin_url: "#",
  resume_url: "#",
  email: "",
  avatar_url: "",
};

const fallbackProjects: ProjectData[] = [
  {
    title: "Portfolio Platform",
    description: "A full-stack portfolio with CMS controls and dynamic content rendering.",
    github_url: "#",
    live_url: "#",
    image_url: "",
  },
];

const fallbackSkills: SkillData[] = [
  { name: "TypeScript", category: "Frontend" },
  { name: "React", category: "Frontend" },
  { name: "Supabase", category: "Backend" },
  { name: "Cloudflare", category: "Platform" },
];

const fallbackExperience: ExperienceData[] = [
  {
    company: "Example Company",
    role: "Software Engineer",
    start_date: "2022",
    end_date: "Present",
    description: "Delivered production-ready features across frontend and backend systems.",
  },
];

const fallbackAbout: AboutData = {
  education: {
    degree: "B.S. Computer Science",
    university: "University of California, Berkeley",
    gpa: "3.87 / 4.0",
    coursework: ["Distributed Systems", "Machine Learning", "Computer Networks", "Database Systems", "Algorithms"],
  },
  volunteering: [
    "Mentor at Code.org — Teaching web development to underrepresented high school students.",
    "Hackathon Organizer — CalHacks, 1500+ participants across 3 editions.",
    "Open Source — Active contributor to React and Node.js ecosystems.",
  ],
  awards: [
    "Dean's Honor List — 6 semesters",
    "Google Summer of Code 2019 — Chromium project",
    "1st Place — HackMIT 2020",
    "AWS Certified Solutions Architect",
  ],
  hobbies: ["Rock climbing", "Mechanical keyboards", "Film photography", "Chess"],
};

const Index = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [experience, setExperience] = useState<ExperienceData[]>([]);

  useEffect(() => {
    async function fetchPortfolioData() {
      const [profileResponse, projectsResponse, skillsResponse, experienceResponse] = await Promise.all([
        supabase.from("profile").select("full_name, role, bio, github_url, linkedin_url, resume_url, email, avatar_url").limit(1).maybeSingle(),
        supabase.from("projects").select("title, description, github_url, live_url, image_url"),
        supabase.from("skills").select("name, category").order("category"),
        supabase.from("experience").select("company, role, start_date, end_date, description").order("start_date", { ascending: false }),
      ]);

      setProfile(profileResponse.data ?? null);
      setProjects(projectsResponse.data ?? []);
      setSkills(skillsResponse.data ?? []);
      setExperience(experienceResponse.data ?? []);
    }

    fetchPortfolioData();
  }, []);

  const displayProfile = profile ?? fallbackProfile;
  const displayProjects = projects.length > 0 ? projects : fallbackProjects;
  const displaySkills = skills.length > 0 ? skills : fallbackSkills;
  const displayExperience = experience.length > 0 ? experience : fallbackExperience;

  return (
    <>
      <Navbar profile={displayProfile} navLinks={navLinks} />
      <main>
        <Hero profile={displayProfile} />
        <TechStack skills={displaySkills} />
        <Projects projects={displayProjects} />
        <Experience experience={displayExperience} />
        <BentoGrid about={fallbackAbout} />
        <Contact />
      </main>
      <Footer profile={displayProfile} />
    </>
  );
};

export default Index;
