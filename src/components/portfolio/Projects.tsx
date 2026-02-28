import { motion } from "framer-motion";
import { Github, ExternalLink, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const ProjectCard = ({ p, index }: { p: any, index: number }) => {
  const tags = p.tech_stack_json || p.tags || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="glass-card-hover p-6 flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-xl">{p.title}</h3>
          {p.short_description && (
            <p className="text-primary text-sm font-medium mt-1">{p.short_description}</p>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 flex-1 leading-relaxed">
        {p.description || LOREM}
      </p>

      {/* Senior Challenge/Solution section */}
      {(p.challenge || p.solution) && (
        <div className="space-y-2 mt-2 mb-6 text-xs bg-muted/30 p-3 rounded-lg border border-border/50">
          {p.challenge && <div><strong className="text-foreground">Challenge:</strong> <span className="text-muted-foreground">{p.challenge}</span></div>}
          {p.solution && <div><strong className="text-foreground">Solution:</strong> <span className="text-muted-foreground">{p.solution}</span></div>}
        </div>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
          {tags.map((tag: string) => (
            <span key={tag} className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-3 mt-auto pt-4 border-t border-border/50">
        {p.github_url && (
          <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="outline" size="sm" className="w-full gap-2 text-xs hover:bg-primary hover:text-primary-foreground transition-colors">
              <Github className="h-4 w-4" /> Code
            </Button>
          </a>
        )}
        {p.live_url && (
          <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="default" size="sm" className="w-full gap-2 text-xs">
              <ExternalLink className="h-4 w-4" /> Live Demo
            </Button>
          </a>
        )}
      </div>
    </motion.div>
  );
};

const Projects = ({ projects, isLoading }: any) => {
  if (isLoading) {
    return (
      <section id="projects" className="section-container">
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-5 w-64 mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => <Skeleton key={i} className="h-80 rounded-xl" />)}
        </div>
      </section>
    );
  }

  const featuredProjects = projects?.filter((p: any) => p.project_type !== 'academic') || [];
  const academicProjects = projects?.filter((p: any) => p.project_type === 'academic') || [];

  return (
    <section id="projects" className="section-container">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="section-title">Featured <span className="gradient-text">Projects</span></h2>
        <p className="section-subtitle">Production-grade systems & applications</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {featuredProjects.map((p: any, i: number) => (
          <ProjectCard key={p.id || i} p={p} index={i} />
        ))}
      </div>

      {academicProjects.length > 0 && (
        <>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <BookOpen className="text-primary h-6 w-6" /> University Coursework
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {academicProjects.map((p: any, i: number) => (
              <ProjectCard key={p.id || i} p={p} index={i} />
            ))}
          </div>
        </>
      )}

      {(!projects || projects.length === 0) && (
        <p className="text-muted-foreground text-center py-8">Projects will appear here once added via the admin dashboard.</p>
      )}
    </section>
  );
};

export default Projects;
