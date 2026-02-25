import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

type ProjectData = {
  title: string;
  description: string;
  github_url: string;
  live_url: string;
  image_url: string;
};

type ProjectsProps = {
  projects: ProjectData[];
};

export function Projects({ projects }: ProjectsProps) {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section id="work" ref={ref} className="reveal py-28 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.34em] text-primary/90">Featured Work</h2>
        <p className="mb-16 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Built with precision and shipped for impact</p>

        {projects.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/15 bg-card/40 px-4 py-12 text-center text-muted-foreground">Projects will appear here soon.</p>
        ) : (
          <div className="flex flex-col gap-20">
            {projects.map((project, i) => (
              <ProjectCard key={`${project.title || "project"}-${i}`} project={project} reversed={i % 2 !== 0} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project, reversed }: { project: ProjectData; reversed: boolean }) {
  const ref = useScrollReveal<HTMLElement>();

  const hasDemo = Boolean(project.live_url && project.live_url !== "#");
  const hasRepo = Boolean(project.github_url && project.github_url !== "#");

  return (
    <article
      ref={ref}
      className={`reveal group grid gap-8 rounded-3xl border border-white/10 bg-card/65 p-5 shadow-[0_24px_72px_hsl(var(--background)/0.8)] backdrop-blur-xl lg:grid-cols-2 lg:items-center lg:p-8 ${reversed ? "" : ""}`}
    >
      <div className={`aspect-video overflow-hidden rounded-2xl border border-white/10 bg-secondary/35 ${reversed ? "lg:order-2" : ""}`}>
        {project.image_url ? (
          <img src={project.image_url} alt={`${project.title} preview`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" loading="lazy" />
        ) : (
          <span className="flex h-full items-center justify-center text-sm text-muted-foreground">Project Preview</span>
        )}
      </div>

      <div className={`space-y-4 ${reversed ? "lg:order-1" : ""}`}>
        <h3 className="text-2xl font-semibold tracking-tight text-foreground">{project.title || "Untitled Project"}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{project.description}</p>

        <div className="flex flex-wrap gap-3 pt-2">
          {hasDemo && (
            <Button size="sm" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Live Demo
              </a>
            </Button>
          )}
          {hasRepo && (
            <Button size="sm" variant="outline" asChild className="border-white/20 bg-transparent text-foreground hover:bg-white/10">
              <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                <Github className="mr-1.5 h-3.5 w-3.5" /> Source
              </a>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
