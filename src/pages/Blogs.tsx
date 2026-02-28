import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Blogs = () => {
  const [profile, setProfile] = useState<any>(null);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [profileRes, blogsRes] = await Promise.all([
        supabase.from("profile").select("*").limit(1).maybeSingle(),
        supabase.from("blogs").select("*").order("published_at", { ascending: false }),
      ]);

      setProfile(profileRes.data ?? null);
      setBlogs(blogsRes.data ?? []);
      setIsLoading(false);
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header profile={isLoading ? null : profile} />

      <main className="flex-grow max-w-3xl mx-auto w-full px-6 pt-32 pb-24">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">Writing</h1>
          <p className="text-muted-foreground text-lg mb-12 border-b border-border/50 pb-8">
            Thoughts on backend engineering, system architecture, and production deployments.
          </p>
        </motion.div>

        <div className="space-y-14">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-16 w-full" />
              </div>
            ))
          ) : blogs.length === 0 ? (
            <p className="text-muted-foreground">No posts published yet. Check back soon!</p>
          ) : (
            blogs.map((post, i) => (
              <motion.article 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col gap-2"
              >
                <Link to={`/blogs/${post.slug}`} className="block">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3 font-mono">
                    <time dateTime={post.published_at}>
                      {new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </time>
                    {post.read_time && (
                      <>
                        <span>—</span>
                        <span>{post.read_time}</span>
                      </>
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors mb-3">
                    {post.title}
                  </h2>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <span className="inline-block mt-4 text-sm font-medium text-primary hover:underline underline-offset-4">
                    Read article →
                  </span>
                </Link>
              </motion.article>
            ))
          )}
        </div>
      </main>

      <Footer profile={isLoading ? null : profile} />
    </div>
  );
};

export default Blogs;
