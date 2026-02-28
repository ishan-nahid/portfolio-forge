import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";

interface Props {
  problems: any[];
  isLoading: boolean;
}

const ProblemSolving = ({ problems, isLoading }: Props) => {
  if (isLoading) {
    return (
      <section className="section-container">
        <Skeleton className="h-10 w-48 mb-6" />
        <Skeleton className="h-40 rounded-xl" />
      </section>
    );
  }

  if (!problems || problems.length === 0) return null;

  const getOjLogo = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('codeforces')) return '/codeforces.png';
    if (p.includes('leetcode')) return '/leetcode.png';
    if (p.includes('beecrowd')) return '/beecrowd.png';
    return null;
  };

  return (
    <section className="section-container">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
        <h2 className="section-title">
          Problem <span className="gradient-text">Solving</span>
        </h2>
        <p className="section-subtitle">Competitive programming & algorithmic challenges</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {problems.map((p: any, i: number) => {
          const logoSrc = getOjLogo(p.platform);
          
          return (
            <motion.a
              key={i}
              href={p.link !== '#' ? p.link : undefined}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card-hover p-6 block ${p.link === '#' ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <div className="flex justify-between items-start mb-4 h-8">
                {logoSrc ? (
                  <img src={logoSrc} alt={p.platform} className="h-8 w-auto object-contain drop-shadow-sm" />
                ) : (
                  <span className="text-primary font-bold">{p.platform}</span>
                )}
                
                {p.link && p.link !== '#' && (
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              
              <h3 className="font-bold text-xl mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
};

export default ProblemSolving;
