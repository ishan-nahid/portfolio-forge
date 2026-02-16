import { useState } from "react";
import { Github, Linkedin, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { usePortfolioContent } from "@/hooks/usePortfolioContent";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { data } = usePortfolioContent();
  const { navLinks, socials, resumeUrl, name } = data;
  const firstName = (name || "Portfolio").split(" ")[0];

  const hasResume = Boolean(resumeUrl && resumeUrl !== "#");
  const hasGithub = Boolean(socials.github && socials.github !== "#");
  const hasLinkedin = Boolean(socials.linkedin && socials.linkedin !== "#");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8" aria-label="Main navigation">
        <a href="#home" className="text-lg font-bold tracking-tight text-foreground">
          {firstName}
          <span className="text-primary">.</span>
        </a>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          {hasGithub ? (
            <a href={socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            </a>
          ) : null}

          {hasLinkedin ? (
            <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            </a>
          ) : null}

          {hasResume ? (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="ml-2 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">Resume</a>
            </Button>
          ) : null}
        </div>

        {/* Mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-background border-border">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col gap-6 mt-8">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-lg text-foreground hover:text-primary transition-colors"
                >
                  {l.label}
                </a>
              ))}

              <div className="flex gap-4 mt-4">
                {hasGithub ? (
                  <a href={socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <Github className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                  </a>
                ) : null}

                {hasLinkedin ? (
                  <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                  </a>
                ) : null}
              </div>

              {hasResume ? (
                <Button variant="outline" size="sm" asChild className="w-fit border-primary/50 text-primary">
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer">Resume</a>
                </Button>
              ) : null}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
