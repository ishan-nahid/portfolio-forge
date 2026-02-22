import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

type Skill = { id: string; name: string; icon_name: string; category: string };
type SkillForm = Omit<Skill, "id">;
const emptyForm: SkillForm = { name: "", icon_name: "", category: "" };

export function SkillsTab() {
  const { toast } = useToast();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Skill | null>(null);
  const [form, setForm] = useState<SkillForm>(emptyForm);

  const fetch = async () => {
    setLoading(true);
    const { data } = await supabase.from("skills").select("*").order("category");
    setSkills(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (s: Skill) => { setEditingId(s.id); setForm({ name: s.name, icon_name: s.icon_name, category: s.category }); setDialogOpen(true); };
  const openDelete = (s: Skill) => { setDeleting(s); setDeleteOpen(true); };

  const handleSave = async () => {
    if (!form.name.trim()) { toast({ title: "Name is required", variant: "destructive" }); return; }
    setSaving(true);
    if (editingId) {
      const { error } = await supabase.from("skills").update(form).eq("id", editingId);
      if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
      else { toast({ title: "Skill updated" }); setDialogOpen(false); fetch(); }
    } else {
      const { error } = await supabase.from("skills").insert([form]);
      if (error) toast({ title: "Insert failed", description: error.message, variant: "destructive" });
      else { toast({ title: "Skill created" }); setDialogOpen(false); fetch(); }
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setSaving(true);
    const { error } = await supabase.from("skills").delete().eq("id", deleting.id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Skill deleted" }); setDeleteOpen(false); setDeleting(null); fetch(); }
    setSaving(false);
  };

  const update = (field: keyof SkillForm, value: string) => setForm((p) => ({ ...p, [field]: value }));

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Skills</CardTitle>
          <Button size="sm" onClick={openCreate}><Plus className="mr-1 h-4 w-4" /> Add Skill</Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground"><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading…</div>
          ) : skills.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">No skills yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {skills.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium text-foreground">{s.name}</TableCell>
                    <TableCell className="text-muted-foreground">{s.category}</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">{s.icon_name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => openDelete(s)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Skill" : "New Skill"}</DialogTitle>
            <DialogDescription>{editingId ? "Update skill details." : "Add a new skill."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Name *</Label><Input value={form.name} onChange={(e) => update("name", e.target.value)} /></div>
            <div className="space-y-2"><Label>Category</Label><Input value={form.category} onChange={(e) => update("category", e.target.value)} placeholder="e.g. Languages, Frameworks" /></div>
            <div className="space-y-2"><Label>Icon Name</Label><Input value={form.icon_name} onChange={(e) => update("icon_name", e.target.value)} placeholder="e.g. SiReact" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{editingId ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Skill</DialogTitle>
            <DialogDescription>Delete <strong>{deleting?.name}</strong>? This cannot be undone.</DialogDescription>
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
