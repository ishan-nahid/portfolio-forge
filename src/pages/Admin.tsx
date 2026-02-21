import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, RefreshCw, Save, Trash2, UploadCloud } from "lucide-react";

import { useAdminPortfolioContent } from "@/hooks/useAdminPortfolioContent";
import { mergePortfolioContent, type PortfolioContent } from "@/lib/portfolioContent";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

function linesToList(text: string): string[] {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}
function listToLines(list: string[]): string {
  return (list ?? []).join("\n");
}
function techToArray(text: string): string[] {
  return text
    .split(/[\n,]/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

async function putJson(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => `Request failed (${res.status})`));
  return res.json().catch(() => ({}));
}

async function postForm(url: string, form: FormData) {
  const res = await fetch(url, { method: "POST", body: form });
  if (!res.ok) throw new Error(await res.text().catch(() => `Request failed (${res.status})`));
  return res.json() as Promise<{ key: string; url: string }>;
}

export default function Admin() {
  const qc = useQueryClient();
  const { toast } = useToast();

  const adminQuery = useAdminPortfolioContent();
  const [draft, setDraft] = useState<PortfolioContent | null>(null);

  const [rawJson, setRawJson] = useState("");
  const [rawJsonError, setRawJsonError] = useState<string | null>(null);

  // load draft on first fetch
  useEffect(() => {
    if (adminQuery.data) {
      const d = mergePortfolioContent(adminQuery.data);
      setDraft(JSON.parse(JSON.stringify(d)));
      setRawJson(JSON.stringify(d, null, 2));
      setRawJsonError(null);
    }
  }, [adminQuery.data]);

  const isDirty = useMemo(() => {
    if (!draft || !adminQuery.data) return false;
    try {
      return JSON.stringify(draft) !== JSON.stringify(mergePortfolioContent(adminQuery.data));
    } catch {
      return true;
    }
  }, [draft, adminQuery.data]);

  const saveMutation = useMutation({
    mutationFn: async (next: PortfolioContent) => putJson("/api/admin/content", next),
    onSuccess: () => {
      toast({ title: "Saved", description: "Your portfolio content has been published." });
      qc.invalidateQueries({ queryKey: ["portfolioContent"] });
      qc.invalidateQueries({ queryKey: ["adminPortfolioContent"] });
      adminQuery.refetch();
    },
    onError: (err: any) => {
      toast({
        title: "Save failed",
        description: String(err?.message ?? err),
        variant: "destructive",
      });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ file, folder }: { file: File; folder: string }) => {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      return postForm("/api/admin/upload", fd);
    },
    onError: (err: any) => {
      toast({
        title: "Upload failed",
        description: String(err?.message ?? err),
        variant: "destructive",
      });
    },
  });

  if (adminQuery.isLoading || !draft) {
    return (
      <div className="min-h-screen px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading admin…
          </div>
        </div>
      </div>
    );
  }

  if (adminQuery.error) {
    return (
      <div className="min-h-screen px-4 py-16">
        <div className="mx-auto max-w-3xl space-y-4">
          <h1 className="text-2xl font-bold">Admin</h1>
          <Card>
            <CardHeader>
              <CardTitle>Access blocked</CardTitle>
              <CardDescription>
                Cloudflare Access is likely not allowing this request, or the admin API isn’t protected.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Make sure your Access app protects:
                <span className="font-mono"> /admin*</span> and <span className="font-mono">/api/admin*</span>.
              </p>
              <p className="text-foreground/90 font-mono break-words">
                {String((adminQuery.error as any)?.message ?? adminQuery.error)}
              </p>
              <Button onClick={() => adminQuery.refetch()} variant="outline">
                Try again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const setField = <K extends keyof PortfolioContent>(key: K, value: PortfolioContent[K]) => {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const updateSocial = (key: keyof PortfolioContent["socials"], value: string) => {
    setDraft((prev) => (prev ? { ...prev, socials: { ...prev.socials, [key]: value } } : prev));
  };

  const updateEducation = (key: keyof PortfolioContent["education"], value: any) => {
    setDraft((prev) => (prev ? { ...prev, education: { ...prev.education, [key]: value } } : prev));
  };

  const addProject = () => {
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            projects: [
              ...prev.projects,
              {
                title: "New Project",
                description: "",
                tech: [],
                metrics: "",
                demoUrl: "",
                repoUrl: "",
                imageUrl: "",
              },
            ],
          }
        : prev,
    );
  };

  const addExperience = () => {
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            experience: [
              ...prev.experience,
              { role: "Role", company: "Company", period: "Year — Year", bullets: [""] },
            ],
          }
        : prev,
    );
  };

  const uploadAndSetAvatar = async (file?: File) => {
    if (!file) return;
    const out = await uploadMutation.mutateAsync({ file, folder: "avatars" });
    setField("avatarUrl", out.url);
    toast({ title: "Uploaded", description: "Avatar updated." });
  };

  const uploadAndSetProjectImage = async (index: number, file?: File) => {
    if (!file) return;
    const out = await uploadMutation.mutateAsync({ file, folder: "projects" });
    setDraft((prev) => {
      if (!prev) return prev;
      const next = [...prev.projects];
      next[index] = { ...next[index], imageUrl: out.url };
      return { ...prev, projects: next };
    });
    toast({ title: "Uploaded", description: "Project image updated." });
  };

  const applyRawJson = () => {
    try {
      const parsed = JSON.parse(rawJson);
      const merged = mergePortfolioContent(parsed);
      setDraft(JSON.parse(JSON.stringify(merged)));
      setRawJsonError(null);
      toast({ title: "Applied", description: "JSON loaded into the editor (remember to Save)." });
    } catch (e: any) {
      setRawJsonError(String(e?.message ?? e));
    }
  };

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Portfolio Admin</h1>
            <p className="text-sm text-muted-foreground">
              Edit content stored in KV and publish instantly. (Protected by Cloudflare Access)
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => adminQuery.refetch()}
              disabled={adminQuery.isFetching}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>

            <Button
              onClick={() => {
                if (!draft) return;
                const merged = mergePortfolioContent(draft);
                saveMutation.mutate(merged);
              }}
              disabled={saveMutation.isPending || !isDirty}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {saveMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save / Publish
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Editor</CardTitle>
            <CardDescription>
              Tip: Upload images to R2 and they’ll return a public URL you can use as Avatar or Project thumbnail.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basics" className="w-full">
              <TabsList className="flex flex-wrap">
                <TabsTrigger value="basics">Basics</TabsTrigger>
                <TabsTrigger value="tech">Tech</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="extras">Extras</TabsTrigger>
                <TabsTrigger value="raw">Raw JSON</TabsTrigger>
              </TabsList>

              {/* BASICS */}
              <TabsContent value="basics" className="mt-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input value={draft.name} onChange={(e) => setField("name", e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Title (small text on hero)</Label>
                    <Input value={draft.title} onChange={(e) => setField("title", e.target.value)} />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Headline</Label>
                    <Input
                      value={draft.headline}
                      onChange={(e) => setField("headline", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Subheadline</Label>
                    <Textarea
                      rows={3}
                      value={draft.subheadline}
                      onChange={(e) => setField("subheadline", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={draft.email} onChange={(e) => setField("email", e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Resume URL</Label>
                    <Input
                      value={draft.resumeUrl}
                      onChange={(e) => setField("resumeUrl", e.target.value)}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>GitHub URL</Label>
                    <Input
                      value={draft.socials.github ?? ""}
                      onChange={(e) => updateSocial("github", e.target.value)}
                      placeholder="https://github.com/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>LinkedIn URL</Label>
                    <Input
                      value={draft.socials.linkedin ?? ""}
                      onChange={(e) => updateSocial("linkedin", e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Avatar URL</Label>
                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                      <Input
                        value={draft.avatarUrl ?? ""}
                        onChange={(e) => setField("avatarUrl", e.target.value)}
                        placeholder="https://... (R2 public url recommended)"
                      />
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => uploadAndSetAvatar(e.target.files?.[0] ?? undefined)}
                        />
                        <Button type="button" variant="outline">
                          <UploadCloud className="mr-2 h-4 w-4" />
                          Upload Avatar
                        </Button>
                      </label>
                    </div>

                    {draft.avatarUrl ? (
                      <div className="mt-3 flex items-center gap-3">
                        <img
                          src={draft.avatarUrl}
                          alt="Avatar preview"
                          className="h-14 w-14 rounded-full object-cover border"
                          loading="lazy"
                        />
                        <p className="text-xs text-muted-foreground">Preview</p>
                      </div>
                    ) : null}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Navbar Links (one per line: Label|#anchor)</Label>
                  <Textarea
                    rows={6}
                    value={draft.navLinks.map((l) => `${l.label}|${l.href}`).join("\n")}
                    onChange={(e) => {
                      const next = linesToList(e.target.value)
                        .map((line) => line.split("|"))
                        .filter((parts) => parts.length >= 2)
                        .map(([label, href]) => ({ label: (label ?? "").trim(), href: (href ?? "").trim() }))
                        .filter((x) => x.label && x.href);
                      setField("navLinks", next);
                    }}
                  />
                </div>
              </TabsContent>

              {/* TECH */}
              <TabsContent value="tech" className="mt-6 space-y-6">
                <div className="space-y-4">
                  {Object.entries(draft.techStack).map(([category, items]) => (
                    <div key={category} className="rounded-lg border p-4 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{category}</Badge>
                          <span className="text-xs text-muted-foreground">{items.length} items</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setDraft((prev) => {
                              if (!prev) return prev;
                              const next = { ...prev.techStack };
                              delete next[category];
                              return { ...prev, techStack: next };
                            });
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove category
                        </Button>
                      </div>

                      <Textarea
                        rows={5}
                        value={listToLines(items)}
                        onChange={(e) => {
                          const nextItems = linesToList(e.target.value);
                          setDraft((prev) => {
                            if (!prev) return prev;
                            return { ...prev, techStack: { ...prev.techStack, [category]: nextItems } };
                          });
                        }}
                        placeholder="One item per line"
                      />
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    const name = prompt("New category name (e.g., Cloudflare, Backend, Databases):")?.trim();
                    if (!name) return;
                    setDraft((prev) => {
                      if (!prev) return prev;
                      if (prev.techStack[name]) return prev;
                      return { ...prev, techStack: { ...prev.techStack, [name]: [] } };
                    });
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add category
                </Button>
              </TabsContent>

              {/* PROJECTS */}
              <TabsContent value="projects" className="mt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Add/edit projects here.</p>
                  <Button onClick={addProject} variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add project
                  </Button>
                </div>

                <div className="space-y-4">
                  {draft.projects.map((p, i) => (
                    <div key={`${p.title}-${i}`} className="rounded-lg border p-4 space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="font-semibold">Project #{i + 1}</p>
                          <p className="text-xs text-muted-foreground">Tip: tech can be comma or newline separated.</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setDraft((prev) => {
                              if (!prev) return prev;
                              const next = [...prev.projects];
                              next.splice(i, 1);
                              return { ...prev, projects: next };
                            });
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2 md:col-span-2">
                          <Label>Title</Label>
                          <Input
                            value={p.title}
                            onChange={(e) => {
                              const v = e.target.value;
                              setDraft((prev) => {
                                if (!prev) return prev;
                                const next = [...prev.projects];
                                next[i] = { ...next[i], title: v };
                                return { ...prev, projects: next };
                              });
                            }}
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label>Description</Label>
                          <Textarea
                            rows={3}
                            value={p.description}
                            onChange={(e) => {
                              const v = e.target.value;
                              setDraft((prev) => {
                                if (!prev) return prev;
                                const next = [...prev.projects];
                                next[i] = { ...next[i], description: v };
                                return { ...prev, projects: next };
                              });
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Metrics</Label>
                          <Input
                            value={p.metrics}
                            onChange={(e) => {
                              const v = e.target.value;
                              setDraft((prev) => {
                                if (!prev) return prev;
                                const next = [...prev.projects];
                                next[i] = { ...next[i], metrics: v };
                                return { ...prev, projects: next };
                              });
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Tech</Label>
                          <Input
                            value={p.tech.join(", ")}
                            onChange={(e) => {
                              const v = techToArray(e.target.value);
                              setDraft((prev) => {
                                if (!prev) return prev;
                                const next = [...prev.projects];
                                next[i] = { ...next[i], tech: v };
                                return { ...prev, projects: next };
                              });
                            }}
                            placeholder="React, Cloudflare, Postgres…"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Demo URL</Label>
                          <Input
                            value={p.demoUrl}
                            onChange={(e) => {
                              const v = e.target.value;
                              setDraft((prev) => {
                                if (!prev) return prev;
                                const next = [...prev.projects];
                                next[i] = { ...next[i], demoUrl: v };
                                return { ...prev, projects: next };
                              });
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Repo URL</Label>
                          <Input
                            value={p.repoUrl}
                            onChange={(e) => {
                              const v = e.target.value;
                              setDraft((prev) => {
                                if (!prev) return prev;
                                const next = [...prev.projects];
                                next[i] = { ...next[i], repoUrl: v };
                                return { ...prev, projects: next };
                              });
                            }}
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label>Image URL</Label>
                          <div className="flex flex-col gap-3 md:flex-row md:items-center">
                            <Input
                              value={p.imageUrl ?? ""}
                              onChange={(e) => {
                                const v = e.target.value;
                                setDraft((prev) => {
                                  if (!prev) return prev;
                                  const next = [...prev.projects];
                                  next[i] = { ...next[i], imageUrl: v };
                                  return { ...prev, projects: next };
                                });
                              }}
                              placeholder="https://... (R2 public url)"
                            />
                            <label className="inline-flex items-center gap-2">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  uploadAndSetProjectImage(i, e.target.files?.[0] ?? undefined)
                                }
                              />
                              <Button type="button" variant="outline">
                                <UploadCloud className="mr-2 h-4 w-4" />
                                Upload image
                              </Button>
                            </label>
                          </div>

                          {p.imageUrl ? (
                            <div className="mt-3">
                              <img
                                src={p.imageUrl}
                                alt={`${p.title} preview`}
                                className="w-full max-w-xl rounded-md border object-cover"
                                loading="lazy"
                              />
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* EXPERIENCE */}
              <TabsContent value="experience" className="mt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Add/edit experience timeline.</p>
                  <Button onClick={addExperience} variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add experience
                  </Button>
                </div>

                <div className="space-y-4">
                  {draft.experience.map((ex, i) => (
                    <div key={`${ex.company}-${i}`} className="rounded-lg border p-4 space-y-4">
                      <div className="flex items-start justify-between">
                        <p className="font-semibold">Experience #{i + 1}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setDraft((prev) => {
                              if (!prev) return prev;
                              const next = [...prev.experience];
                              next.splice(i, 1);
                              return { ...prev, experience: next };
                            });
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label>Role</Label>
                          <Input
                            value={ex.role}
                            onChange={(e) => {
                              const v = e.target.value;
                              setDraft((prev) => {
                                if (!prev) return prev;
                                const next = [...prev.experience];
                                next[i] = { ...next[i], role: v };
                                return { ...prev, experience: next };
                              });
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Company</Label>
                          <Input
                            value={ex.company}
                            onChange={(e) => {
                              const v = e.target.value;
                              setDraft((prev) => {
                                if (!prev) return prev;
                                const next = [...prev.experience];
                                next[i] = { ...next[i], company: v };
                                return { ...prev, experience: next };
                              });
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Period</Label>
                          <Input
                            value={ex.period}
                            onChange={(e) => {
                              const v = e.target.value;
                              setDraft((prev) => {
                                if (!prev) return prev;
                                const next = [...prev.experience];
                                next[i] = { ...next[i], period: v };
                                return { ...prev, experience: next };
                              });
                            }}
                          />
                        </div>

                        <div className="space-y-2 md:col-span-3">
                          <Label>Bullets (one per line)</Label>
                          <Textarea
                            rows={5}
                            value={listToLines(ex.bullets)}
                            onChange={(e) => {
                              const v = linesToList(e.target.value);
                              setDraft((prev) => {
                                if (!prev) return prev;
                                const next = [...prev.experience];
                                next[i] = { ...next[i], bullets: v };
                                return { ...prev, experience: next };
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* EXTRAS */}
              <TabsContent value="extras" className="mt-6 space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Education — Degree</Label>
                    <Input
                      value={draft.education.degree}
                      onChange={(e) => updateEducation("degree", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Education — University</Label>
                    <Input
                      value={draft.education.university}
                      onChange={(e) => updateEducation("university", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Education — GPA</Label>
                    <Input value={draft.education.gpa} onChange={(e) => updateEducation("gpa", e.target.value)} />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Coursework (one per line)</Label>
                    <Textarea
                      rows={5}
                      value={listToLines(draft.education.coursework)}
                      onChange={(e) => updateEducation("coursework", linesToList(e.target.value))}
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Volunteering (one per line)</Label>
                    <Textarea
                      rows={8}
                      value={listToLines(draft.volunteering)}
                      onChange={(e) => setField("volunteering", linesToList(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Awards (one per line)</Label>
                    <Textarea
                      rows={8}
                      value={listToLines(draft.awards)}
                      onChange={(e) => setField("awards", linesToList(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hobbies (one per line)</Label>
                    <Textarea
                      rows={8}
                      value={listToLines(draft.hobbies)}
                      onChange={(e) => setField("hobbies", linesToList(e.target.value))}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* RAW JSON */}
              <TabsContent value="raw" className="mt-6 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">
                    Power mode. Paste JSON and apply. (Then Save)
                  </p>
                  <Button variant="outline" onClick={applyRawJson}>
                    Apply JSON
                  </Button>
                </div>

                <Textarea
                  className="font-mono text-xs"
                  rows={22}
                  value={rawJson}
                  onChange={(e) => {
                    setRawJson(e.target.value);
                    setRawJsonError(null);
                  }}
                />

                {rawJsonError ? (
                  <p className="text-sm text-red-500">JSON error: {rawJsonError}</p>
                ) : null}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
