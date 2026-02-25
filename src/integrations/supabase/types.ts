export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profile: {
        Row: {
          id: string;
          full_name: string;
          role: string;
          bio: string;
          github_url: string;
          linkedin_url: string;
          resume_url: string | null;
          email: string | null;
          avatar_url: string | null;
        };
        Insert: {
          id?: string;
          full_name: string;
          role: string;
          bio: string;
          github_url: string;
          linkedin_url: string;
          resume_url?: string | null;
          email?: string | null;
          avatar_url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profile"]["Insert"]>;
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          github_url: string;
          live_url: string;
          image_url: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          github_url: string;
          live_url: string;
          image_url?: string;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
        Relationships: [];
      };
      skills: {
        Row: {
          id: string;
          name: string;
          category: string;
          icon_name: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          icon_name?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["skills"]["Insert"]>;
        Relationships: [];
      };
      experience: {
        Row: {
          id: string;
          company: string;
          role: string;
          start_date: string;
          end_date: string;
          description: string;
        };
        Insert: {
          id?: string;
          company: string;
          role: string;
          start_date: string;
          end_date: string;
          description: string;
        };
        Update: Partial<Database["public"]["Tables"]["experience"]["Insert"]>;
        Relationships: [];
      };
      education: {
        Row: {
          id: string;
          degree: string;
          institution: string;
          start_date: string;
          end_date: string;
          description: string;
        };
        Insert: {
          id?: string;
          degree: string;
          institution: string;
          start_date: string;
          end_date: string;
          description: string;
        };
        Update: Partial<Database["public"]["Tables"]["education"]["Insert"]>;
        Relationships: [];
      };
      certifications: {
        Row: {
          id: string;
          title: string;
          issuer: string;
          date_earned: string;
          url: string;
        };
        Insert: {
          id?: string;
          title: string;
          issuer: string;
          date_earned: string;
          url?: string;
        };
        Update: Partial<Database["public"]["Tables"]["certifications"]["Insert"]>;
        Relationships: [];
      };
      honors: {
        Row: {
          id: string;
          award: string;
          issuer: string;
          description: string;
          awarded_on: string;
        };
        Insert: {
          id?: string;
          award: string;
          issuer: string;
          description: string;
          awarded_on: string;
        };
        Update: Partial<Database["public"]["Tables"]["honors"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
