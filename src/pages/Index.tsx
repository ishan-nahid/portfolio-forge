import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";
import { TechStack } from "@/components/portfolio/TechStack";
import { Projects } from "@/components/portfolio/Projects";
import { Experience } from "@/components/portfolio/Experience";
import { BentoGrid } from "@/components/portfolio/BentoGrid";
import { Footer } from "@/components/portfolio/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type ProfileData = {
  full_name: string;
  role: string;
  bio: string;
  github_url: string;
  linkedin_url: string;
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

const Index = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [experience, setExperience] = useState<ExperienceData[]>([]);

  useEffect(() => {
    async function fetchPortfolioData() {
      const [profileResponse, projectsResponse, skillsResponse, experienceResponse] = await Promise.all([
        supabase.from("profile").select("full_name, role, bio, github_url, linkedin_url").limit(1).maybeSingle(),
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

  return (
    <>
      <Navbar />
      <main>
        <Hero profile={profile} />
        <TechStack skills={skills} />
        <Projects projects={projects} />
        <Experience experience={experience} />
        <BentoGrid />
      </main>
      <Footer profile={profile} />
    </>
  );
};

export default Index;
