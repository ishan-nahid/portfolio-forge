import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Import layout components directly so the header/footer don't flash
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Lazy load the new portfolio components for maximum speed
const Hero = lazy(() => import("@/components/portfolio/Hero"));
const About = lazy(() => import("@/components/portfolio/About"));
const Skills = lazy(() => import("@/components/portfolio/Skills"));
const Projects = lazy(() => import("@/components/portfolio/Projects"));
const Experience = lazy(() => import("@/components/portfolio/Experience"));
const Education = lazy(() => import("@/components/portfolio/Education"));
const Certifications = lazy(() => import("@/components/portfolio/Certifications"));
const Honors = lazy(() => import("@/components/portfolio/Honors"));
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

type ProjectData = { title: string; description: string; github_url: string; live_url: string; image_url: string; };
type ExperienceData = { company: string; role: string; start_date: string; end_date: string; description: string; };
type SkillData = { id: string; name: string; category: string; };
type EducationData = { id: string; degree: string; institution: string; start_date: string; end_date: string; description: string; };
type CertificationData = { id: string; title: string; issuer: string; date_earned: string; credential_id: string; };
type HonorData = { id: string; title: string; issuer: string; date_received: string; description: string; };

const TEXT_FALLBACK = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const fallbackProfile: ProfileData = {
  full_name: "Ishan Ahmad",
  role: "Software Engineer & Problem Solver",
  bio: "I am Ishan Ahmad, a software engineer from Dhaka who enjoys building practical systems with Python, C++, Django, and React. I care deeply about clean architecture, performant user experiences, and solving difficult algorithmic problems through thoughtful engineering.",
  github_url: "https://github.com/ishan-nahid",
  linkedin_url: "https://www.linkedin.com/in/ishan-ahmad",
  resume_url: "#",
  email: "contact@ishanahmad.com",
  avatar_url: "",
};

const normalizeText = (value: string | null | undefined) => (value && value.trim().length > 0 ? value.trim() : TEXT_FALLBACK);

// Basic loading skeleton for lazy Suspense
const ComponentSkeleton = () => <div className="w-full h-64 animate-pulse bg-muted/20 rounded-xl my-8"></div>;

const Index = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [experience, setExperience] = useState<ExperienceData[]>([]);
  const [education, setEducation] = useState<EducationData[]>([]);
  const [certifications, setCertifications] = useState<CertificationData[]>([]);
  const [honors, setHonors] = useState<HonorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolioData() {
      setIsLoading(true);

      const [profileRes, projectsRes, skillsRes, experienceRes, educationRes, certsRes, honorsRes] = await Promise.all([
        supabase.from("profile").select("full_name, role, bio, github_url, linkedin_url, resume_url, email, avatar_url").limit(1).maybeSingle(),
        supabase.from("projects").select("title, description, github_url, live_url, image_url"),
        supabase.from("skills").select("id, name, category").order("category"),
        supabase.from("experience").select("company, role, start_date, end_date, description").order("start_date", { ascending: false }),
        supabase.from("education").select("id, degree, institution, start_date, end_date, description").order("start_date", { ascending: false }),
        // Notice: Updated to match the exact SQL columns we created earlier
        supabase.from("certifications").select("id, title, issuer, date_earned, credential_id").order("date_earned", { ascending: false }),
        supabase.from("honors").select("id, title, issuer, date_received, description").order("date_received", { ascending: false }),
      ]);

      setProfile(profileRes.data ?? null);
      setProjects((projectsRes.data ?? []).map(p => ({ ...p, description: normalizeText(p.description) })));
      setSkills(skillsRes.data ?? []);
      setExperience((experienceRes.data ?? []).map(e => ({ ...e, description: normalizeText(e.description) })));
      setEducation((educationRes.data ?? []).map(e => ({ ...e, description: normalizeText(e.description) })));
      setCertifications(certsRes.data ?? []);
      setHonors((honorsRes.data ?? []).map(h => ({ ...h, description: normalizeText(h.description) })));
      
      setIsLoading(false);
    }

    fetchPortfolioData();
  }, []);

  const displayProfile = useMemo(() => {
    if (!profile) return fallbackProfile;
    const hasCoreProfileData = Boolean((profile.full_name?.trim()) || (profile.role?.trim()) || (profile.bio?.trim()));

    return hasCoreProfileData
      ? {
          ...profile,
          full_name: profile.full_name?.trim() || fallbackProfile.full_name,
          role: profile.role?.trim() || fallbackProfile.role,
          bio: profile.bio?.trim() || fallbackProfile.bio,
          github_url: profile.github_url || fallbackProfile.github_url,
          linkedin_url: profile.linkedin_url || fallbackProfile.linkedin_url,
        }
      : fallbackProfile;
  }, [profile]);

  return (
    <div className="min-h-screen bg-background">
      <Header profile={isLoading ? null : displayProfile} />
      
      <main>
        <Suspense fallback={<ComponentSkeleton />}>
          <Hero profile={displayProfile} isLoading={isLoading} />
        </Suspense>

        <Suspense fallback={<ComponentSkeleton />}>
          {/* Changed 'about' prop to 'profile' to match the updated About.tsx */}
          <About profile={displayProfile} isLoading={isLoading} />
        </Suspense>

        <Suspense fallback={<ComponentSkeleton />}>
          <Skills skills={skills} isLoading={isLoading} />
        </Suspense>

        <Suspense fallback={<ComponentSkeleton />}>
          <Projects projects={projects} isLoading={isLoading} />
        </Suspense>

        <Suspense fallback={<ComponentSkeleton />}>
          <Experience experience={experience} isLoading={isLoading} />
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