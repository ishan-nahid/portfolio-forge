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

type Exp = { id: string; company: string; role: string; start_date: string; end_date: string; description: string };
type ExpForm = Omit<Exp, "id">;
const emptyForm: ExpForm = { company: "", role: "", start_date: "", end_date: "Present", description: "" };

export function ExperienceTab() {
  const { toast } = useToast();
  const [items, setItems] = useState<Exp[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Exp | null>(null);
  const [form, setForm] = useState<ExpForm>(emptyForm);

  const fetchAll = async () => {
    setLoading(true);
    const { data } = await supabase.from("experience").select("*").order("start_date", { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (e: Exp) => { setEditingId(e.id); setForm({ company: e.company, role: e.role, start_date: e.start_date, end_date: e.end_date, description: e.description }); setDialogOpen(true); };
  const openDelete = (e: Exp) => { setDeleting(e); setDeleteOpen(true); };

  const handleSave = async () => {
    if (!form.company.trim() || !form.role.trim()) { toast({ title: "Company & role required", variant: "destructive" }); return; }
    setSaving(true);
    if (editingId) {
      const { error } = await supabase.from("experience").update(form).eq("id", editingId);
      if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
      else { toast({ title: "Experience updated" }); setDialogOpen(false); fetchAll(); }
    } else {
      const { error } = await supabase.from("experience").insert([form]);
      if (error) toast({ title: "Insert failed", description: error.message, variant: "destructive" });
      else { toast({ title: "Experience created" }); setDialogOpen(false); fetchAll(); }
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setSaving(true);
    const { error } = await supabase.from("experience").delete().eq("id", deleting.id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Experience deleted" }); setDeleteOpen(false); setDeleting(null); fetchAll(); }
    setSaving(false);
  };

  const update = (field: keyof ExpForm, value: string) => setForm((p) => ({ ...p, [field]: value }));

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Experience</CardTitle>
          <Button size="sm" onClick={openCreate}><Plus className="mr-1 h-4 w-4" /> Add Experience</Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground"><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading…</div>
          ) : items.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">No experience entries yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead className="hidden md:table-cell">Period</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium text-foreground">{e.role}</TableCell>
                    <TableCell className="text-muted-foreground">{e.company}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{e.start_date} — {e.end_date}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(e)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => openDelete(e)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
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
            <DialogTitle>{editingId ? "Edit Experience" : "New Experience"}</DialogTitle>
            <DialogDescription>{editingId ? "Update details." : "Add a new experience entry."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Role *</Label><Input value={form.role} onChange={(e) => update("role", e.target.value)} /></div>
              <div className="space-y-2"><Label>Company *</Label><Input value={form.company} onChange={(e) => update("company", e.target.value)} /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Start Date</Label><Input value={form.start_date} onChange={(e) => update("start_date", e.target.value)} placeholder="2023" /></div>
              <div className="space-y-2"><Label>End Date</Label><Input value={form.end_date} onChange={(e) => update("end_date", e.target.value)} placeholder="Present" /></div>
            </div>
            <div className="space-y-2"><Label>Description</Label><Textarea rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Key achievements, bullet points…" /></div>
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
            <DialogTitle>Delete Experience</DialogTitle>
            <DialogDescription>Delete <strong>{deleting?.role} at {deleting?.company}</strong>? This cannot be undone.</DialogDescription>
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
