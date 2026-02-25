import { lazy, Suspense, useEffect, useState } from "react";
import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";
import { Skills, type SkillData } from "@/components/portfolio/Skills";
import { Projects } from "@/components/portfolio/Projects";
import { Education, type EducationData } from "@/components/portfolio/Education";
import { Honors, type HonorData } from "@/components/portfolio/Honors";
import { BentoGrid } from "@/components/portfolio/BentoGrid";
import { Footer } from "@/components/portfolio/Footer";
import { SectionSkeleton, HeroSkeleton } from "@/components/portfolio/PortfolioSkeletons";
import { supabase } from "@/integrations/supabase/client";
import type { CertificationData } from "@/components/portfolio/Certifications";

const Experience = lazy(() => import("@/components/portfolio/Experience").then((module) => ({ default: module.Experience })));
const Certifications = lazy(() => import("@/components/portfolio/Certifications").then((module) => ({ default: module.Certifications })));
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
  bio: "I am a Software Engineer based in Dhaka, Bangladesh, specializing in Python, C++, Django, and React. I love solving complex algorithmic problems and building high-performance products.",
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
      setProjects(projectsResponse.data ?? []);
      setSkills(skillsResponse.data ?? []);
      setExperience(experienceResponse.data ?? []);
      setEducation(educationResponse.data ?? []);
      setCertifications(certificationsResponse.data ?? []);
      setHonors(honorsResponse.data ?? []);
      setIsLoading(false);
    }

    fetchPortfolioData();
  }, []);

  const displayProfile = profile ?? fallbackProfile;
  const displayAbout = fallbackAbout;

  return (
    <>
      <Navbar profile={displayProfile} navLinks={navLinks} />
      <main>
        {isLoading ? <HeroSkeleton /> : <Hero profile={displayProfile} />}
        {isLoading ? <SectionSkeleton id="skills" /> : <Skills skills={skills} />}
        {isLoading ? <SectionSkeleton id="work" /> : <Projects projects={projects} />}

        <Suspense fallback={<SectionSkeleton id="experience" />}>
          {isLoading ? <SectionSkeleton id="experience" /> : <Experience experience={experience} />}
        </Suspense>

        {isLoading ? <SectionSkeleton id="education" /> : <Education education={education} />}

        <Suspense fallback={<SectionSkeleton id="certifications" />}>
          {isLoading ? <SectionSkeleton id="certifications" /> : <Certifications certifications={certifications} />}
        </Suspense>

        {isLoading ? <SectionSkeleton id="honors" /> : <Honors honors={honors} />}
        {isLoading ? <SectionSkeleton id="about" /> : <BentoGrid about={displayAbout} />}

        <Suspense fallback={<SectionSkeleton id="contact" />}>
          {isLoading ? <SectionSkeleton id="contact" /> : <Contact />}
        </Suspense>
      </main>
      <Footer profile={displayProfile} />
    </>
  );
};

export default Index;
