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
    <section id="work" ref={ref} className="reveal py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <h2 className="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-primary text-center">Featured Work</h2>
        <p className="mb-16 text-center text-3xl font-bold text-foreground sm:text-4xl">Projects I've built</p>

        {projects.length === 0 ? (
          <p className="text-center text-muted-foreground">No projects found.</p>
        ) : (
          <div className="flex flex-col gap-20">
            {projects.map((project, i) => (
              <ProjectCard key={`${project.title}-${i}`} project={project} reversed={i % 2 !== 0} />
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
      className={`reveal flex flex-col gap-8 lg:flex-row lg:items-center ${reversed ? "lg:flex-row-reverse" : ""}`}
    >
      <div className="flex-1 aspect-video rounded-lg bg-secondary/50 border border-border flex items-center justify-center overflow-hidden">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={`${project.title} preview`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="text-muted-foreground text-sm">Project Preview</span>
        )}
      </div>

      <div className="flex-1 space-y-4">
        <h3 className="text-2xl font-bold text-foreground">{project.title}</h3>
        <p className="text-muted-foreground leading-relaxed">{project.description}</p>

        <div className="flex gap-3 pt-2">
          {hasDemo && (
            <Button size="sm" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Demo
              </a>
            </Button>
          )}
          {hasRepo && (
            <Button size="sm" variant="outline" asChild className="border-border text-foreground">
              <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                <Github className="mr-1.5 h-3.5 w-3.5" /> Code
              </a>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
