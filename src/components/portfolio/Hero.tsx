import { Button } from "@/components/ui/button";
import { ArrowDown, Mail } from "lucide-react";

type ProfileData = {
  full_name: string;
  role: string;
  bio: string;
  github_url: string;
  linkedin_url: string;
  avatar_url?: string;
};

type HeroProps = {
  profile: ProfileData | null;
};

export function Hero({ profile }: HeroProps) {
  const name = profile?.full_name || "";
  const title = profile?.role || "";
  const bio = profile?.bio || "";
  const avatarUrl = profile?.avatar_url;

  const initials =
    name
      ?.split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "";

  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center px-4 pb-12 pt-24">
      <div className="container mx-auto max-w-5xl text-center">
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-card/60 px-6 py-10 shadow-[0_30px_100px_hsl(var(--background)/0.85)] backdrop-blur-2xl sm:px-10 sm:py-14">
          <div className="mb-8 flex justify-center animate-[fade-in_0.6s_ease-out_0.1s_both]">
            {avatarUrl ? (
              <img src={avatarUrl} alt={`${name} avatar`} className="h-20 w-20 rounded-full border border-white/15 object-cover" loading="lazy" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/15 bg-secondary/50 text-lg font-semibold text-muted-foreground">{initials || "IA"}</div>
            )}
          </div>

          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.34em] text-primary/90 animate-[fade-in_0.6s_ease-out_0.2s_both]">{title}</p>
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-7xl animate-[fade-in_0.6s_ease-out_0.4s_both]">{name}</h1>
          <p className="mx-auto mb-10 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg animate-[fade-in_0.6s_ease-out_0.6s_both]">{bio}</p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-[fade-in_0.6s_ease-out_0.8s_both]">
            <Button size="lg" asChild className="px-8">
              <a href="#work">Explore Projects</a>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white/20 bg-transparent text-foreground hover:bg-white/10">
              <a href="#contact">
                <Mail className="mr-2 h-4 w-4" /> Contact Me
              </a>
            </Button>
          </div>
        </div>
      </div>

      <a href="#skills" aria-label="Scroll down" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground transition-colors hover:text-primary">
        <ArrowDown className="h-5 w-5 animate-bounce" />
      </a>
    </section>
  );
}
