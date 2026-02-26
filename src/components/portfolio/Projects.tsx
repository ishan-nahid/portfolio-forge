import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const Projects = ({ projects, isLoading }: any) => {
  if (isLoading) {
    return (
      <section id="projects" className="section-container">
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-5 w-64 mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="section-container">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="section-title">Featured <span className="gradient-text">Projects</span></h2>
        <p className="section-subtitle">Things I've built</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects?.map((p: any, i: number) => (
          <motion.div
            key={p.title || i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card-hover p-6 flex flex-col"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg">{p.title}</h3>
                {p.date && <span className="text-xs text-muted-foreground font-mono">{p.date}</span>}
              </div>
              {p.type && (
                <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                  {p.type}
                </Badge>
              )}
            </div>

            <p className="text-sm text-muted-foreground mb-4 flex-1 leading-relaxed">
              {p.description || LOREM}
            </p>

            {p.tags && p.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {p.tags.map((tag: string) => (
                  <span key={tag} className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              {p.github_url && (
                <a href={p.github_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                    <Github className="h-3.5 w-3.5" /> Code
                  </Button>
                </a>
              )}
              {p.live_url && (
                <a href={p.live_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                    <ExternalLink className="h-3.5 w-3.5" /> Live
                  </Button>
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {(!projects || projects.length === 0) && (
        <p className="text-muted-foreground text-center py-8">Projects will appear here once added via the admin dashboard.</p>
      )}
    </section>
  );
};

export default Projects;