import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Profile = {
  id: string;
  full_name: string;
  role: string;
  bio: string;
  github_url: string;
  linkedin_url: string;
};

type Skill = { id: string; name: string; icon_name?: string | null; category: string };
type Project = { id: string; title: string; description: string; github_url: string; live_url: string; image_url: string };
type Experience = { id: string; company: string; role: string; start_date: string; end_date: string; description: string };
type Education = { id: string; degree: string; institution: string; start_date: string; end_date: string; description: string };
type Certification = { id: string; title: string; issuer: string; date_earned: string; url: string };
type Honor = { id: string; award: string; issuer: string; description: string; awarded_on: string };

const defaultSkillForm = { name: "", icon_name: "", category: "Frontend" };
const defaultProjectForm = { title: "", description: "", github_url: "", live_url: "", image_url: "" };
const defaultExperienceForm = { company: "", role: "", start_date: "", end_date: "", description: "" };
const defaultEducationForm = { degree: "", institution: "", start_date: "", end_date: "", description: "" };
const defaultCertificationForm = { title: "", issuer: "", date_earned: "", url: "" };
const defaultHonorForm = { award: "", issuer: "", description: "", awarded_on: "" };

export default function Admin() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState<Profile>({ id: "", full_name: "", role: "", bio: "", github_url: "", linkedin_url: "" });
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [honors, setHonors] = useState<Honor[]>([]);

  const [skillForm, setSkillForm] = useState(defaultSkillForm);
  const [projectForm, setProjectForm] = useState(defaultProjectForm);
  const [experienceForm, setExperienceForm] = useState(defaultExperienceForm);
  const [educationForm, setEducationForm] = useState(defaultEducationForm);
  const [certificationForm, setCertificationForm] = useState(defaultCertificationForm);
  const [honorForm, setHonorForm] = useState(defaultHonorForm);

  const [editIds, setEditIds] = useState<{ skill: string | null; project: string | null; experience: string | null; education: string | null; certification: string | null; honor: string | null }>({
    skill: null,
    project: null,
    experience: null,
    education: null,
    certification: null,
    honor: null,
  });

  const [dialogOpen, setDialogOpen] = useState({ skills: false, certifications: false, honors: false });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    const [profRes, skillRes, projRes, expRes, eduRes, certRes, honorRes] = await Promise.all([
      supabase.from("profile").select("*").limit(1).single(),
      supabase.from("skills").select("*").order("category").order("name"),
      supabase.from("projects").select("*").order("id"),
      supabase.from("experience").select("*").order("start_date", { ascending: false }),
      supabase.from("education").select("*").order("start_date", { ascending: false }),
      supabase.from("certifications").select("*").order("date_earned", { ascending: false }),
      supabase.from("honors").select("*").order("awarded_on", { ascending: false }),
    ]);

    if (profRes.data) setProfile(profRes.data as Profile);
    setSkills((skillRes.data ?? []) as Skill[]);
    setProjects((projRes.data ?? []) as Project[]);
    setExperience((expRes.data ?? []) as Experience[]);
    setEducation((eduRes.data ?? []) as Education[]);
    setCertifications((certRes.data ?? []) as Certification[]);
    setHonors((honorRes.data ?? []) as Honor[]);
    setLoading(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    await supabase.from("profile").update(profile).eq("id", profile.id);
    setSaving(false);
  };

  const saveItem = async (
    table: string,
    form: Record<string, unknown>,
    editId: string | null,
    setFormFn: (value: Record<string, unknown>) => void,
    defaultForm: Record<string, unknown>,
    resetEditKey: keyof typeof editIds,
  ) => {
    setSaving(true);
    if (editId) {
      await supabase.from(table).update(form).eq("id", editId);
    } else {
      await supabase.from(table).insert([form]);
    }

    setFormFn(defaultForm);
    setEditIds((prev) => ({ ...prev, [resetEditKey]: null }));
    await fetchAllData();
    setSaving(false);
  };

  const deleteItem = async (table: string, id: string) => {
    if (!confirm(`Delete this item from ${table}?`)) return;
    await supabase.from(table).delete().eq("id", id);
    await fetchAllData();
  };

  const tabs = useMemo(() => ["profile", "projects", "experience", "education", "skills", "certifications", "honors"], []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl rounded-2xl border border-border bg-card/70 p-4 shadow-2xl backdrop-blur sm:p-6">
        <h1 className="mb-6 text-2xl font-bold text-foreground sm:text-3xl">Portfolio Admin Dashboard</h1>

        <div className="mb-8 flex space-x-2 overflow-x-auto border-b border-border pb-px">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`capitalize whitespace-nowrap rounded-t-lg px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab ? "border-b-2 border-primary bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "profile" && (
          <div className="grid max-w-2xl gap-4">
            <Input placeholder="Full Name" value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
            <Input placeholder="Role" value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })} />
            <textarea className="h-24 w-full rounded-md border border-border bg-background p-2" placeholder="Bio" value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
            <Input placeholder="GitHub URL" value={profile.github_url} onChange={(e) => setProfile({ ...profile, github_url: e.target.value })} />
            <Input placeholder="LinkedIn URL" value={profile.linkedin_url} onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })} />
            <Button onClick={saveProfile} disabled={saving}>{saving ? "Saving..." : "Save Profile"}</Button>
          </div>
        )}

        {activeTab === "projects" && (
          <SimpleCrudSection
            title="Projects"
            form={projectForm}
            setForm={setProjectForm}
            fields={["title", "description", "github_url", "live_url", "image_url"]}
            items={projects}
            editId={editIds.project}
            onEdit={(item) => { setProjectForm(item); setEditIds((p) => ({ ...p, project: item.id })); }}
            onSave={() => saveItem("projects", projectForm, editIds.project, setProjectForm, defaultProjectForm, "project")}
            onDelete={(id) => deleteItem("projects", id)}
            onCancel={() => { setEditIds((p) => ({ ...p, project: null })); setProjectForm(defaultProjectForm); }}
          />
        )}

        {activeTab === "experience" && (
          <SimpleCrudSection
            title="Experience"
            form={experienceForm}
            setForm={setExperienceForm}
            fields={["company", "role", "start_date", "end_date", "description"]}
            items={experience}
            editId={editIds.experience}
            onEdit={(item) => { setExperienceForm(item); setEditIds((p) => ({ ...p, experience: item.id })); }}
            onSave={() => saveItem("experience", experienceForm, editIds.experience, setExperienceForm, defaultExperienceForm, "experience")}
            onDelete={(id) => deleteItem("experience", id)}
            onCancel={() => { setEditIds((p) => ({ ...p, experience: null })); setExperienceForm(defaultExperienceForm); }}
          />
        )}

        {activeTab === "education" && (
          <SimpleCrudSection
            title="Education"
            form={educationForm}
            setForm={setEducationForm}
            fields={["degree", "institution", "start_date", "end_date", "description"]}
            items={education}
            editId={editIds.education}
            onEdit={(item) => { setEducationForm(item); setEditIds((p) => ({ ...p, education: item.id })); }}
            onSave={() => saveItem("education", educationForm, editIds.education, setEducationForm, defaultEducationForm, "education")}
            onDelete={(id) => deleteItem("education", id)}
            onCancel={() => { setEditIds((p) => ({ ...p, education: null })); setEducationForm(defaultEducationForm); }}
          />
        )}

        {activeTab === "skills" && (
          <TableCrudSection
            title="Skills"
            description="Manage your key skills as polished badge entries."
            columns={["Skill", "Category", "Icon"]}
            rows={skills.map((item) => [item.name, item.category, item.icon_name || "—", item.id])}
            onAdd={() => { setSkillForm(defaultSkillForm); setEditIds((p) => ({ ...p, skill: null })); setDialogOpen((d) => ({ ...d, skills: true })); }}
            onEdit={(id) => {
              const item = skills.find((skill) => skill.id === id);
              if (!item) return;
              setSkillForm({ name: item.name, category: item.category, icon_name: item.icon_name ?? "" });
              setEditIds((p) => ({ ...p, skill: id }));
              setDialogOpen((d) => ({ ...d, skills: true }));
            }}
            onDelete={(id) => deleteItem("skills", id)}
          />
        )}

        {activeTab === "certifications" && (
          <TableCrudSection
            title="Certifications"
            description="Manage credential cards shown on the public portfolio."
            columns={["Title", "Issuer", "Date", "URL"]}
            rows={certifications.map((item) => [item.title, item.issuer, item.date_earned, item.url || "—", item.id])}
            onAdd={() => { setCertificationForm(defaultCertificationForm); setEditIds((p) => ({ ...p, certification: null })); setDialogOpen((d) => ({ ...d, certifications: true })); }}
            onEdit={(id) => {
              const item = certifications.find((cert) => cert.id === id);
              if (!item) return;
              setCertificationForm({ title: item.title, issuer: item.issuer, date_earned: item.date_earned, url: item.url });
              setEditIds((p) => ({ ...p, certification: id }));
              setDialogOpen((d) => ({ ...d, certifications: true }));
            }}
            onDelete={(id) => deleteItem("certifications", id)}
          />
        )}

        {activeTab === "honors" && (
          <TableCrudSection
            title="Honors"
            description="Manage timeline awards and notable recognitions."
            columns={["Award", "Issuer", "Awarded", "Description"]}
            rows={honors.map((item) => [item.award, item.issuer, item.awarded_on, item.description, item.id])}
            onAdd={() => { setHonorForm(defaultHonorForm); setEditIds((p) => ({ ...p, honor: null })); setDialogOpen((d) => ({ ...d, honors: true })); }}
            onEdit={(id) => {
              const item = honors.find((honor) => honor.id === id);
              if (!item) return;
              setHonorForm({ award: item.award, issuer: item.issuer, description: item.description, awarded_on: item.awarded_on });
              setEditIds((p) => ({ ...p, honor: id }));
              setDialogOpen((d) => ({ ...d, honors: true }));
            }}
            onDelete={(id) => deleteItem("honors", id)}
          />
        )}
      </div>

      <Dialog open={dialogOpen.skills} onOpenChange={(open) => setDialogOpen((d) => ({ ...d, skills: open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editIds.skill ? "Edit Skill" : "Add Skill"}</DialogTitle>
            <DialogDescription>Create badge-ready skills for your public portfolio.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Skill name" value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} />
            <Input placeholder="Category" value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })} />
            <Input placeholder="Icon name (optional)" value={skillForm.icon_name} onChange={(e) => setSkillForm({ ...skillForm, icon_name: e.target.value })} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen((d) => ({ ...d, skills: false }))}>Cancel</Button>
            <Button onClick={() => saveItem("skills", skillForm, editIds.skill, setSkillForm, defaultSkillForm, "skill")}>{saving ? "Saving..." : "Save Skill"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogOpen.certifications} onOpenChange={(open) => setDialogOpen((d) => ({ ...d, certifications: open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editIds.certification ? "Edit Certification" : "Add Certification"}</DialogTitle>
            <DialogDescription>Control the cards displayed in your certifications section.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Title" value={certificationForm.title} onChange={(e) => setCertificationForm({ ...certificationForm, title: e.target.value })} />
            <Input placeholder="Issuer" value={certificationForm.issuer} onChange={(e) => setCertificationForm({ ...certificationForm, issuer: e.target.value })} />
            <Input placeholder="Date earned" value={certificationForm.date_earned} onChange={(e) => setCertificationForm({ ...certificationForm, date_earned: e.target.value })} />
            <Input placeholder="Credential URL" value={certificationForm.url} onChange={(e) => setCertificationForm({ ...certificationForm, url: e.target.value })} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen((d) => ({ ...d, certifications: false }))}>Cancel</Button>
            <Button onClick={() => saveItem("certifications", certificationForm, editIds.certification, setCertificationForm, defaultCertificationForm, "certification")}>{saving ? "Saving..." : "Save Certification"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogOpen.honors} onOpenChange={(open) => setDialogOpen((d) => ({ ...d, honors: open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editIds.honor ? "Edit Honor" : "Add Honor"}</DialogTitle>
            <DialogDescription>Manage timeline entries for your honors and awards section.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Award" value={honorForm.award} onChange={(e) => setHonorForm({ ...honorForm, award: e.target.value })} />
            <Input placeholder="Issuer" value={honorForm.issuer} onChange={(e) => setHonorForm({ ...honorForm, issuer: e.target.value })} />
            <Input placeholder="Awarded on" value={honorForm.awarded_on} onChange={(e) => setHonorForm({ ...honorForm, awarded_on: e.target.value })} />
            <textarea className="h-24 w-full rounded-md border border-border bg-background p-2" placeholder="Description" value={honorForm.description} onChange={(e) => setHonorForm({ ...honorForm, description: e.target.value })} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen((d) => ({ ...d, honors: false }))}>Cancel</Button>
            <Button onClick={() => saveItem("honors", honorForm, editIds.honor, setHonorForm, defaultHonorForm, "honor")}>{saving ? "Saving..." : "Save Honor"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TableCrudSection({
  title,
  description,
  columns,
  rows,
  onAdd,
  onEdit,
  onDelete,
}: {
  title: string;
  description: string;
  columns: string[];
  rows: string[][];
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button onClick={onAdd} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Add {title.slice(0, -1)}
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card/60">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column}>{column}</TableHead>
              ))}
              <TableHead className="w-[110px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const id = row[row.length - 1];
              const display = row.slice(0, -1);
              return (
                <TableRow key={id}>
                  {display.map((col) => (
                    <TableCell key={`${id}-${col}`} className="max-w-[280px] truncate">{col || "—"}</TableCell>
                  ))}
                  <TableCell className="text-right">
                    <div className="inline-flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(id)}><Edit2 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function SimpleCrudSection({
  title,
  form,
  setForm,
  fields,
  items,
  editId,
  onEdit,
  onSave,
  onDelete,
  onCancel,
}: {
  title: string;
  form: Record<string, string>;
  setForm: (value: Record<string, string>) => void;
  fields: string[];
  items: Array<Record<string, string>>;
  editId: string | null;
  onEdit: (item: Record<string, string>) => void;
  onSave: () => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
}) {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="space-y-4 rounded border border-border bg-secondary/40 p-4">
        <h2 className="border-b border-border pb-2 font-semibold">{editId ? `Edit ${title.slice(0, -1)}` : `New ${title.slice(0, -1)}`}</h2>
        {fields.map((field) =>
          field === "description" ? (
            <textarea
              key={field}
              className="h-20 w-full rounded border border-border bg-background p-2"
              placeholder={field.replace("_", " ")}
              value={form[field] ?? ""}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            />
          ) : (
            <Input
              key={field}
              placeholder={field.replace("_", " ")}
              value={form[field] ?? ""}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            />
          ),
        )}
        <Button className="w-full" onClick={onSave}>Save {title.slice(0, -1)}</Button>
        {editId && <Button variant="ghost" className="w-full" onClick={onCancel}>Cancel</Button>}
      </div>
      <div className="space-y-3 md:col-span-2">
        {items.map((item) => (
          <div key={item.id} className="rounded border border-border bg-card p-4">
            <div className="mb-2 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground">{Object.values(item).find((v) => v !== item.id) ?? title}</h3>
                <p className="text-sm text-muted-foreground">{Object.entries(item).filter(([k]) => k !== "id").map(([, v]) => v).join(" • ")}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => onEdit(item)}><Edit2 className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
