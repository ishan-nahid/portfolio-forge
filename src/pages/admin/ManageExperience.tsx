import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Edit2, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

type Experience = { id: string; company: string; role: string; start_date: string; end_date: string; description: string; type?: string; };
const defaultExp = { company: "", role: "", start_date: "", end_date: "", description: "", type: "work" };

export default function ManageExperience() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExp, setCurrentExp] = useState<Partial<Experience>>(defaultExp);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => { fetchExperience(); }, []);

  const fetchExperience = async () => {
    setLoading(true);
    const { data } = await supabase.from("experience").select("*").order("start_date", { ascending: false });
    setExperience(data || []);
    setLoading(false);
  };

  const saveExperience = async () => {
    setSaving(true);
    const { id, ...payload } = currentExp;
    if (editId) {
      const { data, error } = await supabase.from("experience").update(payload).eq("id", editId).select();
      if (error) toast.error(error.message); 
      else if (data && data.length === 0) toast.error("Update blocked! Check RLS policies.");
      else toast.success("Updated!");
    } else {
      const { data, error } = await supabase.from("experience").insert([payload]).select();
      if (error) toast.error(error.message); 
      else if (data && data.length === 0) toast.error("Insert blocked! Check RLS policies.");
      else toast.success("Added!");
    }
    setSaving(false); setIsEditing(false); fetchExperience();
  };

  const deleteExperience = async (id: string) => {
    if (!confirm("Delete this?")) return;
    await supabase.from("experience").delete().eq("id", id);
    fetchExperience();
  };

  const openEditor = (exp: Experience | null) => {
    setCurrentExp(exp || defaultExp); setEditId(exp?.id || null); setIsEditing(true);
  };

  if (loading) return <Loader2 className="h-6 w-6 animate-spin text-primary" />;

  if (isEditing) return (
    <div className="space-y-4 max-w-2xl">
      <Button variant="ghost" onClick={() => setIsEditing(false)}><ArrowLeft className="mr-2 h-4 w-4"/> Back</Button>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Company</label>
          <Input placeholder="Company" value={currentExp.company || ""} onChange={e => setCurrentExp({...currentExp, company: e.target.value})} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Role</label>
          <Input placeholder="Role (e.g. Frontend Dev)" value={currentExp.role || ""} onChange={e => setCurrentExp({...currentExp, role: e.target.value})} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Start Date</label>
          <Input placeholder="e.g. Jan 2022" value={currentExp.start_date || ""} onChange={e => setCurrentExp({...currentExp, start_date: e.target.value})} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">End Date</label>
          <Input placeholder="e.g. Present" value={currentExp.end_date || ""} onChange={e => setCurrentExp({...currentExp, end_date: e.target.value})} />
        </div>
      </div>
      
      {/* NEW: Experience Type Dropdown */}
      <div>
        <label className="text-sm font-medium mb-1 block">Experience Type</label>
        <select 
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          value={currentExp.type || "work"} 
          onChange={e => setCurrentExp({...currentExp, type: e.target.value})}
        >
          <option value="work">Work Experience</option>
          <option value="other">Other (Leadership, Volunteer, etc.)</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Description</label>
        <textarea className="h-32 w-full rounded-md border border-border bg-background p-3 text-sm" placeholder="Description" value={currentExp.description || ""} onChange={e => setCurrentExp({...currentExp, description: e.target.value})} />
      </div>
      <Button onClick={saveExperience} disabled={saving}>{saving ? "Saving..." : "Save Experience"}</Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Manage Experience</h2>
        <Button onClick={() => openEditor(null)}><Plus className="mr-2 h-4 w-4"/> Add</Button>
      </div>
      <div className="grid gap-4">
        {experience.map(exp => (
          <div key={exp.id} className="flex justify-between rounded-lg border bg-card p-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold">{exp.role} at {exp.company}</h3>
                <span className="text-[10px] uppercase tracking-wider bg-secondary px-2 py-0.5 rounded text-muted-foreground">{exp.type || "work"}</span>
              </div>
              <p className="text-sm text-muted-foreground">{exp.start_date} — {exp.end_date}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => openEditor(exp)}><Edit2 className="h-4 w-4"/></Button>
              <Button variant="ghost" size="icon" onClick={() => deleteExperience(exp.id)} className="text-destructive"><Trash2 className="h-4 w-4"/></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
