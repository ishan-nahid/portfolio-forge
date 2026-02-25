import { useState } from "react";
import { Github, Linkedin, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type ProfileData = {
  full_name: string;
  github_url: string;
  linkedin_url: string;
  resume_url?: string;
};

type NavLink = {
  label: string;
  href: string;
};

type NavbarProps = {
  profile: ProfileData | null;
  navLinks: NavLink[];
};

export function Navbar({ profile, navLinks }: NavbarProps) {
  const [open, setOpen] = useState(false);

  const name = profile?.full_name || "";
  const resumeUrl = profile?.resume_url || "#";
  const github = profile?.github_url || "#";
  const linkedin = profile?.linkedin_url || "#";
  const firstName = name ? name.split(" ")[0] : "Ishan";

  const hasResume = Boolean(resumeUrl && resumeUrl !== "#");
  const hasGithub = Boolean(github && github !== "#");
  const hasLinkedin = Boolean(linkedin && linkedin !== "#");

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-background/75 backdrop-blur-xl">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8" aria-label="Main navigation">
        <a href="#home" className="text-lg font-semibold tracking-tight text-foreground">
          {firstName}
          <span className="text-primary">.</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          {hasGithub && (
            <a href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
            </a>
          )}
          {hasLinkedin && (
            <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
            </a>
          )}
          {hasResume && (
            <Button variant="outline" size="sm" asChild className="ml-2 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                Resume
              </a>
            </Button>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="border-white/10 bg-background">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="mt-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-lg text-foreground transition-colors hover:text-primary">
                  {link.label}
                </a>
              ))}
              <div className="mt-4 flex gap-4">
                {hasGithub && (
                  <a href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <Github className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                  </a>
                )}
                {hasLinkedin && (
                  <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                  </a>
                )}
              </div>
              {hasResume && (
                <Button variant="outline" size="sm" asChild className="w-fit border-primary/50 text-primary">
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                    Resume
                  </a>
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
