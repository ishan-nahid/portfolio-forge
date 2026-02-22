import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";

type Project = { id: number; title: string; description: string; github_url: string; live_url: string; image_url: string };
type ProjectForm = Omit<Project, "id">;
const emptyForm: ProjectForm = { title: "", description: "", github_url: "", live_url: "", image_url: "" };

export function ProjectsTab() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<Project | null>(null);
  const [form, setForm] = useState<ProjectForm>(emptyForm);

  const fetchAll = async () => {
    setLoading(true);
    const { data } = await supabase.from("projects").select("*").order("id", { ascending: true });
    setProjects(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (p: Project) => { setEditingId(p.id); setForm({ title: p.title, description: p.description, github_url: p.github_url, live_url: p.live_url, image_url: p.image_url }); setDialogOpen(true); };
  const openDelete = (p: Project) => { setDeleting(p); setDeleteOpen(true); };

  const handleSave = async () => {
    if (!form.title.trim()) { toast({ title: "Title is required", variant: "destructive" }); return; }
    setSaving(true);
    if (editingId !== null) {
      const { error } = await supabase.from("projects").update(form).eq("id", editingId);
      if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
      else { toast({ title: "Project updated" }); setDialogOpen(false); fetchAll(); }
    } else {
      const { error } = await supabase.from("projects").insert([form]);
      if (error) toast({ title: "Insert failed", description: error.message, variant: "destructive" });
      else { toast({ title: "Project created" }); setDialogOpen(false); fetchAll(); }
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setSaving(true);
    const { error } = await supabase.from("projects").delete().eq("id", deleting.id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Project deleted" }); setDeleteOpen(false); setDeleting(null); fetchAll(); }
    setSaving(false);
  };

  const update = (field: keyof ProjectForm, value: string) => setForm((p) => ({ ...p, [field]: value }));

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Projects</CardTitle>
          <Button size="sm" onClick={openCreate}><Plus className="mr-1 h-4 w-4" /> Add Project</Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground"><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading…</div>
          ) : projects.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">No projects yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-muted-foreground">{p.id}</TableCell>
                    <TableCell className="font-medium text-foreground">{p.title}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground max-w-[300px] truncate">{p.description}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => openDelete(p)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId !== null ? "Edit Project" : "New Project"}</DialogTitle>
            <DialogDescription>{editingId !== null ? "Update project details." : "Add a new project."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Title *</Label><Input value={form.title} onChange={(e) => update("title", e.target.value)} /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>GitHub URL</Label><Input value={form.github_url} onChange={(e) => update("github_url", e.target.value)} /></div>
              <div className="space-y-2"><Label>Live URL</Label><Input value={form.live_url} onChange={(e) => update("live_url", e.target.value)} /></div>
            </div>
            <div className="space-y-2"><Label>Image URL</Label><Input value={form.image_url} onChange={(e) => update("image_url", e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{editingId !== null ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>Delete <strong>{deleting?.title}</strong>? This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
