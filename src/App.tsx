import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public Pages
import Index from "./pages/Index";
import Blogs from "./pages/Blogs";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";

// Admin Layout & Auth Components
import Login from "./pages/admin/Login";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Admin Modules
import ManageProfile from "./pages/admin/ManageProfile";
import ManageBlogs from "./pages/admin/ManageBlogs";
import ManageProjects from "./pages/admin/ManageProjects";
import ManageExperience from "./pages/admin/ManageExperience";
import ManageEducation from "./pages/admin/ManageEducation";
import ManageSkills from "./pages/admin/ManageSkills";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogPost />} />
          
          {/* Admin Login */}
          <Route path="/admin/login" element={<Login />} />

          {/* Secure Admin Dashboard (Nested Routes) */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            
            {/* Default Dashboard View (/admin) */}
            <Route index element={
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Welcome to Dashboard</h2>
                <p className="text-muted-foreground">Select a module from the sidebar to manage your portfolio.</p>
              </div>
            } />
            
            {/* Active Modules */}
            <Route path="profile" element={<ManageProfile />} />
            <Route path="blogs" element={<ManageBlogs />} />
            <Route path="projects" element={<ManageProjects />} />
            <Route path="experience" element={<ManageExperience />} />
            <Route path="education" element={<ManageEducation />} />
            <Route path="skills" element={<ManageSkills />} />
            
          </Route>

          {/* Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
