export type NavLink = { label: string; href: string };

export type Project = {
  title: string;
  description: string;
  tech: string[];
  metrics: string;
  demoUrl: string;
  repoUrl: string;
  imageUrl?: string; // optional thumbnail (R2 public url)
};

export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  bullets: string[];
};

export type Education = {
  degree: string;
  university: string;
  gpa: string;
  coursework: string[];
};

export type PortfolioContent = {
  name: string;
  title: string;
  headline: string;
  subheadline: string;

  email: string;
  resumeUrl: string;

  avatarUrl?: string; // optional profile photo (R2 public url)

  socials: {
    github?: string;
    linkedin?: string;
    x?: string;
    website?: string;
  };

  navLinks: NavLink[];

  // categories -> list of tech
  techStack: Record<string, string[]>;

  projects: Project[];
  experience: ExperienceItem[];

  education: Education;
  volunteering: string[];
  awards: string[];
  hobbies: string[];
};

export const DEFAULT_PORTFOLIO_DATA: PortfolioContent = {
  name: "Alex Chen",
  title: "Full Stack Engineer",
  headline: "Building scalable distributed systems.",
  subheadline: "I'm Alex Chen, a Full Stack Engineer focused on performance and accessibility.",

  email: "alex@example.com",
  resumeUrl: "#",

  avatarUrl: "",

  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },

  navLinks: [
    { label: "Home", href: "#home" },
    { label: "Work", href: "#work" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],

  techStack: {
    Languages: ["TypeScript", "Python", "Go", "Rust", "SQL", "Java"],
    Frameworks: ["React", "Next.js", "Node.js", "FastAPI", "Express", "Tailwind CSS"],
    Tools: ["Git", "Docker", "Figma", "VS Code", "Vim", "Postman"],
    Infrastructure: ["AWS", "GCP", "Kubernetes", "Terraform", "Redis", "PostgreSQL"],
  },

  projects: [
    {
      title: "Distributed Task Engine",
      description:
        "Built a fault-tolerant distributed task processing engine handling 50K+ jobs/min with automatic retries, dead-letter queues, and real-time monitoring dashboards.",
      tech: ["Go", "Redis", "Kubernetes", "gRPC", "Prometheus"],
      metrics: "50K+ jobs/min · 99.97% uptime",
      demoUrl: "#",
      repoUrl: "#",
      imageUrl: "",
    },
    {
      title: "Real-Time Collaboration Platform",
      description:
        "Designed and shipped a multiplayer document editor with CRDTs for conflict-free merging, achieving sub-100ms sync latency across global regions.",
      tech: ["TypeScript", "React", "WebSocket", "PostgreSQL", "AWS"],
      metrics: "Sub-100ms sync · 10K concurrent users",
      demoUrl: "#",
      repoUrl: "#",
      imageUrl: "",
    },
    {
      title: "ML Pipeline Orchestrator",
      description:
        "Created an end-to-end ML pipeline platform that reduced model deployment time from 2 weeks to 4 hours with automated feature validation and A/B testing.",
      tech: ["Python", "FastAPI", "Docker", "Airflow", "GCP"],
      metrics: "Reduced deploy time by 95%",
      demoUrl: "#",
      repoUrl: "#",
      imageUrl: "",
    },
  ],

  experience: [
    {
      role: "Senior Software Engineer",
      company: "TechCorp",
      period: "2023 — Present",
      bullets: [
        "Led migration of monolithic services to event-driven microservices, reducing p99 latency by 40%.",
        "Mentored 5 junior engineers and established code review standards adopted org-wide.",
        "Designed real-time analytics pipeline processing 2M+ events daily.",
      ],
    },
    {
      role: "Software Engineer II",
      company: "StartupXYZ",
      period: "2021 — 2023",
      bullets: [
        "Built core payment processing system handling $12M+ monthly transactions.",
        "Implemented CI/CD pipelines reducing deployment failures by 70%.",
        "Optimized database queries resulting in 3x improvement in API response times.",
      ],
    },
    {
      role: "Software Engineer",
      company: "DevAgency",
      period: "2019 — 2021",
      bullets: [
        "Delivered 15+ client projects ranging from e-commerce platforms to SaaS dashboards.",
        "Introduced automated testing practices, increasing code coverage from 20% to 85%.",
      ],
    },
  ],

  education: {
    degree: "B.S. Computer Science",
    university: "University of California, Berkeley",
    gpa: "3.87 / 4.0",
    coursework: [
      "Distributed Systems",
      "Machine Learning",
      "Computer Networks",
      "Database Systems",
      "Algorithms",
    ],
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

export function mergePortfolioContent(partial?: Partial<PortfolioContent> | null): PortfolioContent {
  const p = partial ?? {};
  const merged: PortfolioContent = {
    ...DEFAULT_PORTFOLIO_DATA,
    ...p,
    socials: { ...DEFAULT_PORTFOLIO_DATA.socials, ...(p.socials ?? {}) },

    navLinks: Array.isArray(p.navLinks) ? p.navLinks : DEFAULT_PORTFOLIO_DATA.navLinks,

    techStack:
      p.techStack && typeof p.techStack === "object" && !Array.isArray(p.techStack)
        ? (p.techStack as Record<string, string[]>)
        : DEFAULT_PORTFOLIO_DATA.techStack,

    projects: Array.isArray(p.projects) ? p.projects : DEFAULT_PORTFOLIO_DATA.projects,
    experience: Array.isArray(p.experience) ? p.experience : DEFAULT_PORTFOLIO_DATA.experience,

    education: p.education
      ? {
          ...DEFAULT_PORTFOLIO_DATA.education,
          ...p.education,
          coursework: Array.isArray(p.education.coursework)
            ? p.education.coursework
            : DEFAULT_PORTFOLIO_DATA.education.coursework,
        }
      : DEFAULT_PORTFOLIO_DATA.education,

    volunteering: Array.isArray(p.volunteering) ? p.volunteering : DEFAULT_PORTFOLIO_DATA.volunteering,
    awards: Array.isArray(p.awards) ? p.awards : DEFAULT_PORTFOLIO_DATA.awards,
    hobbies: Array.isArray(p.hobbies) ? p.hobbies : DEFAULT_PORTFOLIO_DATA.hobbies,
  };

  // normalize some optional strings
  merged.avatarUrl = (merged.avatarUrl ?? "").trim();
  merged.resumeUrl = (merged.resumeUrl ?? "").trim();

  return merged;
}
