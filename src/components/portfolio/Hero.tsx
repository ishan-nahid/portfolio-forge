import { PORTFOLIO_DATA } from "@/data/portfolio";
import { Button } from "@/components/ui/button";
import { ArrowDown, Mail } from "lucide-react";

export function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-primary animate-[fade-in_0.6s_ease-out_0.2s_both]">
          {PORTFOLIO_DATA.title}
        </p>
        <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-7xl animate-[fade-in_0.6s_ease-out_0.4s_both]">
          {PORTFOLIO_DATA.headline}
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl animate-[fade-in_0.6s_ease-out_0.6s_both]">
          {PORTFOLIO_DATA.subheadline}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-[fade-in_0.6s_ease-out_0.8s_both]">
          <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
            <a href="#work">View Projects</a>
          </Button>
          <Button size="lg" variant="outline" asChild className="border-border text-foreground hover:bg-secondary">
            <a href="#contact"><Mail className="mr-2 h-4 w-4" />Contact Me</a>
          </Button>
        </div>
      </div>
      <a href="#skills" aria-label="Scroll down" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors animate-bounce">
        <ArrowDown className="h-5 w-5" />
      </a>
    </section>
  );
}
