import { motion } from "framer-motion";
import { Code2, Brain, Trophy, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const highlights = [
  { icon: Brain, title: "Problem Solving", desc: "1,000+ algorithmic solves across platforms" },
  { icon: Code2, title: "Software Engineering", desc: "Full-stack development with modern stacks" },
  { icon: Trophy, title: "Competitive Programming", desc: "ICPC regionalist & contest veteran" },
  { icon: Users, title: "Leadership", desc: "Team lead & open source contributor" },
];

const About = ({ profile, isLoading }: any) => {
  if (isLoading) {
    return (
      <section id="about" className="section-container">
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-5 w-72 mb-12" />
        <Skeleton className="h-32 w-full mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="section-container">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="section-title">About <span className="gradient-text">Me</span></h2>
        <p className="section-subtitle">My journey in tech</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="glass-card p-8 mb-10"
      >
        <p className="text-muted-foreground leading-relaxed">
          {profile?.bio ||
            "I'm a passionate software engineer with deep expertise in algorithms, data structures, and system design. With over 1,000 algorithmic problems solved and experience as an ICPC regionalist, I bring rigorous problem-solving to every project. I specialize in Python, C++, and React, building scalable solutions from concept to deployment."}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {highlights.map((h, i) => (
          <motion.div
            key={h.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card-hover p-6 text-center"
          >
            <h.icon className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-1">{h.title}</h3>
            <p className="text-sm text-muted-foreground">{h.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default About;