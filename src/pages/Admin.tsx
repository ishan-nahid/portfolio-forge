import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileTab } from "@/components/admin/ProfileTab";
import { ProjectsTab } from "@/components/admin/ProjectsTab";
import { SkillsTab } from "@/components/admin/SkillsTab";
import { ExperienceTab } from "@/components/admin/ExperienceTab";

export default function Admin() {
  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Portfolio Admin</h1>
          <p className="text-sm text-muted-foreground">Manage your entire portfolio from one place.</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
          </TabsList>

          <TabsContent value="profile"><ProfileTab /></TabsContent>
          <TabsContent value="projects"><ProjectsTab /></TabsContent>
          <TabsContent value="skills"><SkillsTab /></TabsContent>
          <TabsContent value="experience"><ExperienceTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
