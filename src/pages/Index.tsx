import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Layout
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Lazy components
const Hero = lazy(() => import("@/components/portfolio/Hero"));
const About = lazy(() => import("@/components/portfolio/About"));
const Skills = lazy(() => import("@/components/portfolio/Skills"));
const Projects = lazy(() => import("@/components/portfolio/Projects"));
const Experience = lazy(() => import("@/components/portfolio/Experience"));
const Education = lazy(() => import("@/components/portfolio/Education"));
const Certifications = lazy(() => import("@/components/portfolio/Certifications"));
const Honors = lazy(() => import("@/components/portfolio/Honors"));
const ProblemSolving = lazy(() => import("@/components/portfolio/ProblemSolving"));
const OpenSource = lazy(() => import("@/components/portfolio/OpenSource"));
const Contact = lazy(() => import("@/components/portfolio/Contact"));

// --- Types ---
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
  id: string;
  title: string;
  short_description?: string;
  description: string;
  challenge?: string;
  solution?: string;
  impact?: string;
  tech_stack_json?: string[]; // We added this to the DB
  github_url?: string;
  live_url?: string;
  image_url?: string;
  project_type?: 'featured' | 'academic'; // NEW
};

type ExperienceData = {
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  end_date_text?: string; // We added this to the DB
  description: string;
  bullets?: string[]; // We added this to the DB
  type?: string; 
  title?: string;
  period?: string;
};

type ProblemSolvingData = {
  id: string;
  title: string;
  platform: string;
  description: string;
  link?: string;
  date: string;
};

type OpenSourceData = {
  id: string;
  title: string;
  description: string;
  repo_url?: string;
  contribution_type?: string;
  date: string;
};

type SkillData = { id: string; name: string; category: string };
type EducationData = { id: string; degree: string; institution: string; start_date: string; grade?: string; end_date: string; description: string; period?: string };
type CertificationData = { id: string; title: string; issuer: string; date_earned: string; credential_id: string };
type HonorData = { id: string; title: string; issuer: string; date_received: string; description: string };

const TEXT_FALLBACK =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const normalizeText = (value: string | null | undefined) =>
  value && value.trim().length > 0 ? value.trim() : TEXT_FALLBACK;

const ComponentSkeleton = () => (
  <div className="w-full h-64 animate-pulse bg-muted/20 rounded-xl my-8"></div>
);

const Index = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [workExperience, setWorkExperience] = useState<ExperienceData[]>([]);
  const [otherExperience, setOtherExperience] = useState<ExperienceData[]>([]);
  const [education, setEducation] = useState<EducationData[]>([]);
  const [certifications, setCertifications] = useState<CertificationData[]>([]);
  const [honors, setHonors] = useState<HonorData[]>([]);
  const [problemSolving, setProblemSolving] = useState<ProblemSolvingData[]>([]);
  const [openSource, setOpenSource] = useState<OpenSourceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolioData() {
      setIsLoading(true);

      const [
        profileRes,
        projectsRes,
        skillsRes,
        experienceRes,
        educationRes,
        certsRes,
        honorsRes,
        problemRes,
        openSourceRes,
      ] = await Promise.all([
        supabase.from("profile").select("*").limit(1).maybeSingle(),
        supabase.from("projects").select("*"),
        supabase.from("skills").select("*").order("category"),
        supabase.from("experience").select("*").order("start_date", { ascending: false }),
        supabase.from("education").select("*").order("start_date", { ascending: false }),
        supabase.from("certifications").select("*").order("date_earned", { ascending: false }),
        supabase.from("honors").select("*").order("date_received", { ascending: false }),
        supabase.from("problem_solving").select("*").order("date", { ascending: false }),
        supabase.from("open_source").select("*").order("date", { ascending: false }),
      ]);

      setProfile(profileRes.data ?? null);
      setProjects((projectsRes.data ?? []).map(p => ({ ...p, description: normalizeText(p.description) })));
      setSkills(skillsRes.data ?? []);

      const allExperience = experienceRes.data ?? [];

      setWorkExperience(
        allExperience
          .filter(e => e.type === "work")
          .map(e => ({
            ...e,
            title: e.role,
            period: `${e.start_date} — ${e.end_date}`,
            description: normalizeText(e.description),
          }))
      );

      setOtherExperience(
        allExperience
          .filter(e => e.type !== "work")
          .map(e => ({
            ...e,
            title: e.role,
            period: `${e.start_date} — ${e.end_date}`,
            description: normalizeText(e.description),
          }))
      );

      setEducation((educationRes.data ?? []).map(e => ({
        ...e,
        period: `${e.start_date} — ${e.end_date}`,
        description: normalizeText(e.description),
      })));

      setCertifications(certsRes.data ?? []);
      setHonors((honorsRes.data ?? []).map(h => ({ ...h, description: normalizeText(h.description) })));
      setProblemSolving(problemRes.data ?? []);
      setOpenSource(openSourceRes.data ?? []);

      setIsLoading(false);
    }

    fetchPortfolioData();
  }, []);

  const displayProfile = useMemo(() => {
    if (!profile) return null;
    return profile;
  }, [profile]);

  return (
    <div className="min-h-screen bg-background">
      <Header profile={isLoading ? null : displayProfile} />

      <main>
        <Suspense fallback={<ComponentSkeleton />}>
          <Hero profile={displayProfile} isLoading={isLoading} />
        </Suspense>

        <Suspense fallback={<ComponentSkeleton />}>
          <About profile={displayProfile} isLoading={isLoading} />
        </Suspense>

        <Suspense fallback={<ComponentSkeleton />}>
          <Skills skills={skills} isLoading={isLoading} />
        </Suspense>

        <Suspense fallback={<ComponentSkeleton />}>
          <Projects projects={projects} isLoading={isLoading} />
        </Suspense>

        <Suspense fallback={<ComponentSkeleton />}>
          <Experience experience={workExperience} isLoading={isLoading} />
        </Suspense>

        <Suspense fallback={<ComponentSkeleton />}>
          <Experience
            experience={otherExperience}
            isLoading={isLoading}
            title="Other Experience"
            subtitle="Leadership, volunteering & extracurricular"
          />
        </Suspense>

        <Suspense fallback={<ComponentSkeleton />}>
          <ProblemSolving problems={problemSolving} isLoading={isLoading} />
        </Suspense>

        <Suspense fallback={<ComponentSkeleton />}>
          <OpenSource contributions={openSource} isLoading={isLoading} />
        </Suspense>

        <Suspense fallback={<ComponentSkeleton />}>
          <Education education={education} isLoading={isLoading} />
        </Suspense>

        <Suspense fallback={<ComponentSkeleton />}>
          <Certifications certifications={certifications} isLoading={isLoading} />
        </Suspense>

        <Suspense fallback={<ComponentSkeleton />}>
          <Honors honors={honors} isLoading={isLoading} />
        </Suspense>

        <Suspense fallback={<ComponentSkeleton />}>
          <Contact />
        </Suspense>
      </main>

      <Footer profile={isLoading ? null : displayProfile} />
    </div>
  );
};

export default Index;
