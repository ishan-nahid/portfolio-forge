import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { usePortfolioContent } from "@/hooks/usePortfolioContent";
import type { Project } from "@/lib/portfolioContent";

export function Projects() {
  const ref = useScrollReveal<HTMLElement>();
  const { data } = usePortfolioContent();
  const { projects } = data;

  return (
    <section id="work" ref={ref} className="reveal py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <h2 className="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-primary text-center">Featured Work</h2>
        <p className="mb-16 text-center text-3xl font-bold text-foreground sm:text-4xl">Projects I've built</p>

        <div className="flex flex-col gap-20">
          {projects.map((project, i) => (
            <ProjectCard key={`${project.title}-${i}`} project={project} reversed={i % 2 !== 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, reversed }: { project: Project; reversed: boolean }) {
  const ref = useScrollReveal<HTMLElement>();

  const hasDemo = Boolean(project.demoUrl && project.demoUrl !== "#");
  const hasRepo = Boolean(project.repoUrl && project.repoUrl !== "#");

  return (
    <article
      ref={ref}
      className={`reveal flex flex-col gap-8 lg:flex-row lg:items-center ${reversed ? "lg:flex-row-reverse" : ""}`}
    >
      {/* Visual */}
      <div className="flex-1 aspect-video rounded-lg bg-secondary/50 border border-border flex items-center justify-center overflow-hidden">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={`${project.title} preview`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="text-muted-foreground text-sm">Project Preview</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-4">
        <h3 className="text-2xl font-bold text-foreground">{project.title}</h3>
        <p className="text-muted-foreground leading-relaxed">{project.description}</p>
        <p className="text-sm font-semibold text-primary">{project.metrics}</p>

        <div className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <Badge key={t} variant="secondary" className="bg-secondary text-secondary-foreground border-border text-xs">
              {t}
            </Badge>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          {hasDemo ? (
            <Button size="sm" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Demo
              </a>
            </Button>
          ) : null}

          {hasRepo ? (
            <Button size="sm" variant="outline" asChild className="border-border text-foreground">
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                <Github className="mr-1.5 h-3.5 w-3.5" /> Code
              </a>
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
