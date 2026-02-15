import { PORTFOLIO_DATA } from "@/data/portfolio";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

export function Projects() {
  const ref = useScrollReveal<HTMLElement>();
  const { projects } = PORTFOLIO_DATA;

  return (
    <section id="work" ref={ref} className="reveal py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <h2 className="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-primary text-center">Featured Work</h2>
        <p className="mb-16 text-center text-3xl font-bold text-foreground sm:text-4xl">Projects I've built</p>

        <div className="flex flex-col gap-20">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} reversed={i % 2 !== 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  reversed,
}: {
  project: (typeof PORTFOLIO_DATA)["projects"][number];
  reversed: boolean;
}) {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <article ref={ref} className={`reveal flex flex-col gap-8 lg:flex-row lg:items-center ${reversed ? "lg:flex-row-reverse" : ""}`}>
      {/* Visual placeholder */}
      <div className="flex-1 aspect-video rounded-lg bg-secondary/50 border border-border flex items-center justify-center">
        <span className="text-muted-foreground text-sm">Project Preview</span>
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
          <Button size="sm" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Demo
            </a>
          </Button>
          <Button size="sm" variant="outline" asChild className="border-border text-foreground">
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
              <Github className="mr-1.5 h-3.5 w-3.5" /> Code
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}
