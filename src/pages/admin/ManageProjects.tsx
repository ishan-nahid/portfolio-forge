import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Edit2, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

type Project = {
  id: string;
  title: string;
  description: string;
  github_url: string;
  live_url: string;
  image_url: string;
};

const defaultProject = { title: "", description: "", github_url: "", live_url: "", image_url: "" };

export default function ManageProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>(defaultProject);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("projects").select("*").order("id", { ascending: false });
    if (error) toast.error("Failed to fetch projects");
    else setProjects(data || []);
    setLoading(false);
  };

  const saveProject = async () => {
    if (!currentProject.title || !currentProject.description) {
      toast.error("Title and description are required.");
      return;
    }

    setSaving(true);
    
    // CRITICAL FIX: Strip ID before sending to database
    const { id, ...payload } = currentProject;

    if (editId) {
      const { data, error } = await supabase.from("projects").update(payload).eq("id", editId).select();
      if (error) {
        toast.error(error.message);
      } else if (data && data.length === 0) {
        toast.error("Update blocked! Check Supabase UPDATE policies.");
      } else {
        toast.success("Project updated!");
      }
    } else {
      const { data, error } = await supabase.from("projects").insert([payload]).select();
      if (error) {
        toast.error(error.message);
      } else if (data && data.length === 0) {
        toast.error("Insert blocked! Check Supabase INSERT policies.");
      } else {
        toast.success("Project added!");
      }
    }
    
    setSaving(false);
    setIsEditing(false);
    fetchProjects();
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Project deleted");
      fetchProjects();
    }
  };

  const openEditor = (project: Project | null) => {
    if (project) {
      setCurrentProject(project);
      setEditId(project.id);
    } else {
      setCurrentProject(defaultProject);
      setEditId(null);
    }
    setIsEditing(true);
  };

  if (loading) return <Loader2 className="h-6 w-6 animate-spin text-primary" />;

  if (isEditing) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{editId ? "Edit Project" : "Add New Project"}</h2>
          </div>
        </div>

        <div className="grid gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Project Title</label>
            <Input placeholder="E.g. E-Commerce Platform" value={currentProject.title || ""} onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })} />
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea className="h-32 w-full rounded-md border border-border bg-background p-3 text-sm" placeholder="Describe the tech stack and what the project does..." value={currentProject.description || ""} onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="mb-1 block text-sm font-medium">GitHub URL</label>
              <Input placeholder="https://github.com/..." value={currentProject.github_url || ""} onChange={(e) => setCurrentProject({ ...currentProject, github_url: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Live Demo URL</label>
              <Input placeholder="https://..." value={currentProject.live_url || ""} onChange={(e) => setCurrentProject({ ...currentProject, live_url: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Image URL (Cover image)</label>
            <Input placeholder="https://..." value={currentProject.image_url || ""} onChange={(e) => setCurrentProject({ ...currentProject, image_url: e.target.value })} />
          </div>

          <Button onClick={saveProject} disabled={saving} className="w-fit">
            {saving ? "Saving..." : "Save Project"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manage Projects</h2>
          <p className="text-sm text-muted-foreground">Add or edit your portfolio projects.</p>
        </div>
        <Button onClick={() => openEditor(null)}>
          <Plus className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <div key={project.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-4">
              {project.image_url && (
                <img src={project.image_url} alt={project.title} className="h-12 w-16 rounded object-cover" />
              )}
              <div>
                <h3 className="font-semibold text-foreground">{project.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => openEditor(project)}>
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => deleteProject(project.id)} className="text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
