import { motion } from "framer-motion";
import { ArrowDown, Mail, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const FALLBACK_BIO =
  "Competitive programmer with 1,000+ algorithmic solves across CodeForces, LeetCode & more. ICPC regionalist. Python/C++/React developer passionate about building scalable systems and solving complex engineering challenges.";

const Hero = ({ profile, isLoading }: any) => {
  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center pt-16">
        <div className="section-container text-center space-y-6">
          <Skeleton className="h-6 w-40 mx-auto" />
          <Skeleton className="h-14 w-96 mx-auto max-w-full" />
          <Skeleton className="h-8 w-72 mx-auto max-w-full" />
          <div className="space-y-2 max-w-2xl mx-auto">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6 mx-auto" />
            <Skeleton className="h-4 w-4/6 mx-auto" />
          </div>
          <div className="flex gap-4 justify-center">
            <Skeleton className="h-11 w-36" />
            <Skeleton className="h-11 w-36" />
          </div>
        </div>
      </section>
    );
  }

  // Map Supabase fields to the new UI fields
  const name = profile?.full_name || profile?.name || "Ishan Ahmad";
  const title = profile?.role || profile?.title || "Software Engineer & Problem Solver";
  const bio = profile?.bio || FALLBACK_BIO;

  return (
    <section className="min-h-screen flex items-center justify-center pt-16 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-glow-pulse pointer-events-none" />

      <div className="section-container text-center relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-primary text-sm tracking-widest uppercase mb-4"
        >
          Hello, I'm
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-4 gradient-text"
        >
          {name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl sm:text-2xl text-muted-foreground font-light mb-8"
        >
          {title}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {bio}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <a href="#contact">
            <Button size="lg" className="gap-2">
              <Mail className="h-4 w-4" /> Get In Touch
            </Button>
          </a>
          {profile?.resume_url && (
            <a href={profile.resume_url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="gap-2">
                <FileText className="h-4 w-4" /> Download CV
              </Button>
            </a>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <a href="#about">
            <ArrowDown className="h-5 w-5 text-muted-foreground animate-bounce" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;