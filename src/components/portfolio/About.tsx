import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Database, Zap, GitBranch, Activity, FileText, ArrowRight, CheckCircle2 } from "lucide-react";

interface Props {
  profile: any;
  isLoading: boolean;
}

const About = ({ profile, isLoading }: Props) => {
  if (isLoading) {
    return (
      <section id="about" className="section-container">
        <Skeleton className="h-10 w-48 mb-6" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </section>
    );
  }

  // Read from DB with safe fallbacks
  const intro = profile?.why_hire_me_intro || "I build backend systems that are designed for production from day one.";
  const cp = profile?.why_hire_me_cp || "My background in competitive programming shaped how I approach engineering, translating into predictable and scalable systems.";
  const bullets = profile?.why_hire_me_bullets || [
    "Transaction integrity and concurrency control",
    "Clear API contracts and schema design",
    "Asynchronous processing for reliability and performance",
    "Deployment pipelines and operational visibility",
    "Monitoring, logging, and failure handling"
  ];
  const outro = profile?.why_hire_me_outro || "I am comfortable owning the full lifecycle of a backend system.";
  const quote = profile?.why_hire_me_quote || "I don't just implement features — I design backend systems that teams can confidently build on.";

  // Array of icons to cycle through for the bullet points
  const iconList = [
    <Database className="h-5 w-5 text-emerald-500" />,
    <ShieldCheck className="h-5 w-5 text-blue-500" />,
    <Zap className="h-5 w-5 text-amber-500" />,
    <GitBranch className="h-5 w-5 text-purple-500" />,
    <Activity className="h-5 w-5 text-rose-500" />
  ];

  return (
    <section id="about" className="section-container">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="section-title">
          Why <span className="gradient-text">Hire Me</span>
        </h2>
        <p className="section-subtitle">Production-ready backend engineering & system architecture</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-8 space-y-6 text-muted-foreground leading-relaxed text-lg"
        >
          <p className="text-foreground font-medium text-xl">
            {intro}
          </p>
          
          <p>
            {cp}
          </p>

          {bullets.length > 0 && (
            <div className="bg-card border border-border/50 rounded-xl p-6 my-8 shadow-sm">
              <h3 className="text-foreground font-bold mb-4">In production environments, I focus on:</h3>
              <ul className="space-y-3">
                {bullets.map((text: string, idx: number) => {
                  const Icon = iconList[idx % iconList.length] || <CheckCircle2 className="h-5 w-5 text-primary" />;
                  return (
                    <li key={idx} className="flex items-center gap-3">
                      <span className="bg-muted p-1.5 rounded-md shrink-0">{Icon}</span>
                      <span className="text-sm md:text-base">{text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <p>
            {outro}
          </p>

          <p className="font-semibold text-foreground border-l-4 border-primary pl-4 py-1 mt-6">
            {quote}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-4 flex flex-col gap-4"
        >
          <div className="bg-muted/30 border border-border rounded-xl p-6 flex flex-col items-center text-center h-full justify-center">
            <h3 className="font-bold text-xl mb-2 text-foreground">Ready to build?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Whether scaling for millions of users or moving quickly in a startup environment, I build systems that survive growth.
            </p>
            
            <div className="flex flex-col w-full gap-3">
              {profile?.resume_url && (
                <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button className="w-full gap-2" size="lg">
                    <FileText size={18} /> Download Resume
                  </Button>
                </a>
              )}
              
              <a href="#contact" className="w-full">
                <Button variant="outline" className="w-full gap-2" size="lg">
                  Get In Touch <ArrowRight size={18} />
                </Button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
