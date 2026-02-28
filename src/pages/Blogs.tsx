import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client"; // adjust path if needed
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/layout/Navbar"; // Assuming you have a reusable navbar
import Footer from "@/components/layout/Footer"; // Assuming you have a reusable footer

export default function Blogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("published_at", { ascending: false });

      if (!error && data) {
        setBlogs(data);
      }
      setIsLoading(false);
    };

    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-grow max-w-3xl mx-auto w-full px-6 pt-32 pb-20">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Writing</h1>
          <p className="text-muted-foreground text-lg mb-12 border-b border-border/50 pb-8">
            Thoughts on system architecture, backend engineering, and production deployments.
          </p>
        </motion.div>

        <div className="space-y-12">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
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
                className="group flex flex-col gap-2 cursor-pointer"
              >
                <Link to={`/blogs/${post.slug}`} className="block">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                    <time dateTime={post.published_at}>
                      {new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </time>
                    {post.read_time && (
                      <>
                        <span>·</span>
                        <span>{post.read_time}</span>
                      </>
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors mb-2">
                    {post.title}
                  </h2>
                  
                  <p className="text-muted-foreground leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </Link>
              </motion.article>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
