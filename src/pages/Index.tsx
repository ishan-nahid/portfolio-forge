import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";
import { Footer } from "@/components/portfolio/Footer";
import { SectionSkeleton, HeroSkeleton } from "@/components/portfolio/PortfolioSkeletons";
import { supabase } from "@/integrations/supabase/client";
import type { SkillData } from "@/components/portfolio/Skills";
import type { EducationData } from "@/components/portfolio/Education";
import type { HonorData } from "@/components/portfolio/Honors";
import type { CertificationData } from "@/components/portfolio/Certifications";

const Skills = lazy(() => import("@/components/portfolio/Skills").then((module) => ({ default: module.Skills })));
const Projects = lazy(() => import("@/components/portfolio/Projects").then((module) => ({ default: module.Projects })));
const Experience = lazy(() => import("@/components/portfolio/Experience").then((module) => ({ default: module.Experience })));
const Education = lazy(() => import("@/components/portfolio/Education").then((module) => ({ default: module.Education })));
const Certifications = lazy(() => import("@/components/portfolio/Certifications").then((module) => ({ default: module.Certifications })));
const Honors = lazy(() => import("@/components/portfolio/Honors").then((module) => ({ default: module.Honors })));
const BentoGrid = lazy(() => import("@/components/portfolio/BentoGrid").then((module) => ({ default: module.BentoGrid })));
const Contact = lazy(() => import("@/components/portfolio/Contact").then((module) => ({ default: module.Contact })));

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

const TEXT_FALLBACK =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Certifications", href: "#certifications" },
  { label: "Honors", href: "#honors" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const fallbackProfile: ProfileData = {
  full_name: "Ishan Ahmad",
  role: "Software Engineer & Problem Solver",
  bio: "I am Ishan Ahmad, a software engineer from Dhaka who enjoys building practical systems with Python, C++, Django, and React. I care deeply about clean architecture, performant user experiences, and solving difficult algorithmic problems through thoughtful engineering.",
  github_url: "https://github.com/ishan-nahid",
  linkedin_url: "#",
  resume_url: "#",
  email: "",
  avatar_url: "",
};

const fallbackAbout: AboutData = {
  education: {
    degree: "B.Sc. in Computer Science & Engineering",
    university: "Dhaka, Bangladesh",
    gpa: "Focused on algorithms, systems, and software engineering",
    coursework: ["Data Structures & Algorithms", "Competitive Programming", "Web Engineering", "Software Design"],
  },
  volunteering: [
    "Community-focused problem solving through programming mentorship and peer support.",
    "Knowledge sharing on development best practices and coding interview preparation.",
  ],
  awards: ["Champion competitive programmer", "Strong track record in algorithmic contests"],
  hobbies: ["Competitive programming", "Building developer tools", "Learning new frameworks"],
};

const normalizeText = (value: string | null | undefined) => (value && value.trim().length > 0 ? value.trim() : TEXT_FALLBACK);

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

      const [profileResponse, projectsResponse, skillsResponse, experienceResponse, educationResponse, certificationsResponse, honorsResponse] = await Promise.all([
        supabase.from("profile").select("full_name, role, bio, github_url, linkedin_url, resume_url, email, avatar_url").limit(1).maybeSingle(),
        supabase.from("projects").select("title, description, github_url, live_url, image_url"),
        supabase.from("skills").select("id, name, category").order("category"),
        supabase.from("experience").select("company, role, start_date, end_date, description").order("start_date", { ascending: false }),
        supabase.from("education").select("id, degree, institution, start_date, end_date, description").order("start_date", { ascending: false }),
        supabase.from("certifications").select("id, title, issuer, date_earned, url").order("date_earned", { ascending: false }),
        supabase.from("honors").select("id, award, issuer, description, awarded_on").order("awarded_on", { ascending: false }),
      ]);

      setProfile(profileResponse.data ?? null);
      setProjects(
        (projectsResponse.data ?? []).map((project) => ({
          ...project,
          description: normalizeText(project.description),
        })),
      );
      setSkills(skillsResponse.data ?? []);
      setExperience(
        (experienceResponse.data ?? []).map((item) => ({
          ...item,
          description: normalizeText(item.description),
        })),
      );
      setEducation(
        (educationResponse.data ?? []).map((item) => ({
          ...item,
          description: normalizeText(item.description),
        })),
      );
      setCertifications(certificationsResponse.data ?? []);
      setHonors(
        (honorsResponse.data ?? []).map((item) => ({
          ...item,
          description: normalizeText(item.description),
        })),
      );
      setIsLoading(false);
    }

    fetchPortfolioData();
  }, []);

  const displayProfile = useMemo(() => {
    if (!profile) return fallbackProfile;

    const hasCoreProfileData = Boolean((profile.full_name && profile.full_name.trim()) || (profile.role && profile.role.trim()) || (profile.bio && profile.bio.trim()));

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
    <>
      <Navbar profile={isLoading ? null : displayProfile} navLinks={navLinks} />
      <main className="bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.12),transparent_32rem)]">
        {isLoading ? <HeroSkeleton /> : <Hero profile={displayProfile} />}

        <Suspense fallback={<SectionSkeleton id="skills" />}>
          {isLoading ? <SectionSkeleton id="skills" /> : <Skills skills={skills} />}
        </Suspense>

        <Suspense fallback={<SectionSkeleton id="work" />}>
          {isLoading ? <SectionSkeleton id="work" /> : <Projects projects={projects} />}
        </Suspense>

        <Suspense fallback={<SectionSkeleton id="experience" />}>
          {isLoading ? <SectionSkeleton id="experience" /> : <Experience experience={experience} />}
        </Suspense>

        <Suspense fallback={<SectionSkeleton id="education" />}>
          {isLoading ? <SectionSkeleton id="education" /> : <Education education={education} />}
        </Suspense>

        <Suspense fallback={<SectionSkeleton id="certifications" />}>
          {isLoading ? <SectionSkeleton id="certifications" /> : <Certifications certifications={certifications} />}
        </Suspense>

        <Suspense fallback={<SectionSkeleton id="honors" />}>
          {isLoading ? <SectionSkeleton id="honors" /> : <Honors honors={honors} />}
        </Suspense>

        <Suspense fallback={<SectionSkeleton id="about" />}>
          {isLoading ? <SectionSkeleton id="about" /> : <BentoGrid about={fallbackAbout} />}
        </Suspense>

        <Suspense fallback={<SectionSkeleton id="contact" />}>
          {isLoading ? <SectionSkeleton id="contact" /> : <Contact />}
        </Suspense>
      </main>
      <Footer profile={isLoading ? null : displayProfile} />
    </>
  );
};

export default Index;
