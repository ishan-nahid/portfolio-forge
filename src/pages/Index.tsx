import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";
import { TechStack } from "@/components/portfolio/TechStack";
import { Projects } from "@/components/portfolio/Projects";
import { Experience } from "@/components/portfolio/Experience";
import { BentoGrid } from "@/components/portfolio/BentoGrid";
import { Footer } from "@/components/portfolio/Footer";

const Index = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TechStack />
        <Projects />
        <Experience />
        <BentoGrid />
      </main>
      <Footer />
    </>
  );
};

export default Index;
