export const PORTFOLIO_DATA = {
  name: "Alex Chen",
  title: "Full Stack Engineer",
  headline: "Building scalable distributed systems.",
  subheadline: "I'm Alex Chen, a Full Stack Engineer focused on performance and accessibility.",
  email: "alex@example.com",
  resumeUrl: "#",
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
    },
    {
      title: "Real-Time Collaboration Platform",
      description:
        "Designed and shipped a multiplayer document editor with CRDTs for conflict-free merging, achieving sub-100ms sync latency across global regions.",
      tech: ["TypeScript", "React", "WebSocket", "PostgreSQL", "AWS"],
      metrics: "Sub-100ms sync · 10K concurrent users",
      demoUrl: "#",
      repoUrl: "#",
    },
    {
      title: "ML Pipeline Orchestrator",
      description:
        "Created an end-to-end ML pipeline platform that reduced model deployment time from 2 weeks to 4 hours with automated feature validation and A/B testing.",
      tech: ["Python", "FastAPI", "Docker", "Airflow", "GCP"],
      metrics: "Reduced deploy time by 95%",
      demoUrl: "#",
      repoUrl: "#",
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
