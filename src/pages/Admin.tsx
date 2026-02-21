import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, RefreshCw } from "lucide-react";

type Project = {
  id: number;
  title: string;
  description: string;
  github_url: string;
  live_url: string;
  image_url: string;
};

type ProjectForm = Omit<Project, "id">;

const emptyForm: ProjectForm = {
  title: "",
  description: "",
  github_url: "",
  live_url: "",
  image_url: "",
};

export default function Admin() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [form, setForm] = useState<ProjectForm>(emptyForm);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      toast({ title: "Error fetching projects", description: error.message, variant: "destructive" });
    } else {
      setProjects(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      github_url: project.github_url,
      live_url: project.live_url,
      image_url: project.image_url,
    });
    setDialogOpen(true);
  };

  const openDelete = (project: Project) => {
    setDeletingProject(project);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }

    setSaving(true);

    if (editingId !== null) {
      const { error } = await supabase
        .from("projects")
        .update(form)
        .eq("id", editingId);

      if (error) {
        toast({ title: "Update failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Project updated" });
        setDialogOpen(false);
        fetchProjects();
      }
    } else {
      const { error } = await supabase
        .from("projects")
        .insert([form]);

      if (error) {
        toast({ title: "Insert failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Project created" });
        setDialogOpen(false);
        fetchProjects();
      }
    }

    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deletingProject) return;
    setSaving(true);

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", deletingProject.id);

    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Project deleted" });
      setDeleteDialogOpen(false);
      setDeletingProject(null);
      fetchProjects();
    }

    setSaving(false);
  };

  const updateField = (field: keyof ProjectForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Project Admin</h1>
            <p className="text-sm text-muted-foreground">
              Manage your portfolio projects directly from Supabase.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchProjects} disabled={loading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading projects…
              </div>
            ) : projects.length === 0 ? (
              <p className="py-12 text-center text-muted-foreground">
                No projects yet. Click "New Project" to add one.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead className="w-[120px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-mono text-muted-foreground">{project.id}</TableCell>
                      <TableCell className="font-medium text-foreground">{project.title}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground max-w-[300px] truncate">
                        {project.description}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(project)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openDelete(project)} className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId !== null ? "Edit Project" : "New Project"}</DialogTitle>
            <DialogDescription>
              {editingId !== null ? "Update the project details below." : "Fill in the details for your new project."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" value={form.title} onChange={(e) => updateField("title", e.target.value)} placeholder="My Awesome Project" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={3} value={form.description} onChange={(e) => updateField("description", e.target.value)} placeholder="A brief description…" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input id="github_url" value={form.github_url} onChange={(e) => updateField("github_url", e.target.value)} placeholder="https://github.com/…" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="live_url">Live URL</Label>
                <Input id="live_url" value={form.live_url} onChange={(e) => updateField("live_url", e.target.value)} placeholder="https://…" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input id="image_url" value={form.image_url} onChange={(e) => updateField("image_url", e.target.value)} placeholder="https://…" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingId !== null ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deletingProject?.title}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
