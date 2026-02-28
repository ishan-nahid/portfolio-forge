import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Edit2, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  read_time: string;
  created_at?: string;
};

const defaultBlog = { title: "", slug: "", excerpt: "", content: "", read_time: "" };

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // State to handle the current view (list vs form)
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Partial<Blog>>(defaultBlog);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("blogs").select("*").order("created_at", { ascending: false });
    if (error) toast.error("Failed to fetch blogs");
    else setBlogs(data || []);
    setLoading(false);
  };

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setCurrentBlog({ ...currentBlog, title, slug });
  };

  const saveBlog = async () => {
    if (!currentBlog.title || !currentBlog.slug || !currentBlog.content) {
      toast.error("Title, slug, and content are required.");
      return;
    }

    setSaving(true);
    if (editId) {
      const { error } = await supabase.from("blogs").update(currentBlog).eq("id", editId);
      if (error) toast.error(error.message);
      else toast.success("Blog updated!");
    } else {
      const { error } = await supabase.from("blogs").insert([currentBlog]);
      if (error) toast.error(error.message);
      else toast.success("Blog published!");
    }
    
    setSaving(false);
    setIsEditing(false);
    fetchBlogs();
  };

  const deleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Blog deleted");
      fetchBlogs();
    }
  };

  const openEditor = (blog: Blog | null) => {
    if (blog) {
      setCurrentBlog(blog);
      setEditId(blog.id);
    } else {
      setCurrentBlog(defaultBlog);
      setEditId(null);
    }
    setIsEditing(true);
  };

  if (loading) return <Loader2 className="h-6 w-6 animate-spin text-primary" />;

  // --- EDITOR VIEW ---
  if (isEditing) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{editId ? "Edit Post" : "Write New Post"}</h2>
            <p className="text-sm text-muted-foreground">Use Markdown for formatting your content.</p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Title</label>
              <Input placeholder="My Awesome Post" value={currentBlog.title || ""} onChange={(e) => handleTitleChange(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">URL Slug</label>
              <Input placeholder="my-awesome-post" value={currentBlog.slug || ""} onChange={(e) => setCurrentBlog({ ...currentBlog, slug: e.target.value })} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="mb-1 block text-sm font-medium">Read Time</label>
              <Input placeholder="e.g. 5 min read" value={currentBlog.read_time || ""} onChange={(e) => setCurrentBlog({ ...currentBlog, read_time: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Short Excerpt</label>
            <textarea className="h-20 w-full rounded-md border border-border bg-background p-3 text-sm" placeholder="A brief summary of the post..." value={currentBlog.excerpt || ""} onChange={(e) => setCurrentBlog({ ...currentBlog, excerpt: e.target.value })} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Main Content (Markdown supported)</label>
            <textarea className="h-[400px] w-full rounded-md border border-border bg-background p-4 font-mono text-sm" placeholder="Write your content here..." value={currentBlog.content || ""} onChange={(e) => setCurrentBlog({ ...currentBlog, content: e.target.value })} />
          </div>

          <Button onClick={saveBlog} disabled={saving} className="w-fit">
            {saving ? "Publishing..." : "Publish Post"}
          </Button>
        </div>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manage Blogs</h2>
          <p className="text-sm text-muted-foreground">Create and manage your articles.</p>
        </div>
        <Button onClick={() => openEditor(null)}>
          <Plus className="mr-2 h-4 w-4" /> New Post
        </Button>
      </div>

      {blogs.length === 0 ? (
        <div className="rounded-xl border border-border border-dashed p-8 text-center text-muted-foreground">
          No blog posts yet. Click "New Post" to get started.
        </div>
      ) : (
        <div className="grid gap-4">
          {blogs.map((blog) => (
            <div key={blog.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-secondary/40">
              <div>
                <h3 className="font-semibold text-foreground">{blog.title}</h3>
                <p className="text-sm text-muted-foreground">/{blog.slug} • {blog.read_time}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEditor(blog)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteBlog(blog.id)} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
