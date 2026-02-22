import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type Profile = {
  id: string;
  full_name: string;
  role: string;
  bio: string;
  avatar_url: string;
  resume_url: string;
  email: string;
  github_url: string;
  linkedin_url: string;
};

export type Skill = {
  id: string;
  name: string;
  icon_name: string;
  category: string;
};

export type ExperienceRow = {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  description: string;
};

export type ProjectRow = {
  id: number;
  title: string;
  description: string;
  github_url: string;
  live_url: string;
  image_url: string;
};

export function useProfile() {
  const [data, setData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("profile")
      .select("*")
      .limit(1)
      .single()
      .then(({ data }) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  return { data, loading };
}

export function useSkills() {
  const [data, setData] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("skills")
      .select("*")
      .order("category")
      .then(({ data }) => {
        setData(data ?? []);
        setLoading(false);
      });
  }, []);

  return { data, loading };
}

export function useExperience() {
  const [data, setData] = useState<ExperienceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("experience")
      .select("*")
      .order("start_date", { ascending: false })
      .then(({ data }) => {
        setData(data ?? []);
        setLoading(false);
      });
  }, []);

  return { data, loading };
}
