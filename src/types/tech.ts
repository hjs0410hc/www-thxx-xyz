export type ProjectStatus = 'in_progress' | 'completed' | 'discontinued' | 'archived';

export interface Project {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    contents: any | null; // JSONB for Tiptap
    technologies: string[] | null;
    cover_image: string | null; // Added
    demo_url: string | null;
    github_url: string | null;
    start_date: string | null; // ISO Date string
    end_date: string | null; // ISO Date string
    featured: boolean;
    display_order: number | null;
    status: ProjectStatus | null;
    locale: string;
    created_at: string;
    updated_at: string;
}

export type SkillLevel = 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';

export interface Skill {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    contents: any | null; // JSONB for Tiptap
    technologies: string[] | null;
    icon: string | null;
    cover_image: string | null; // Added
    level: SkillLevel | null;
    category: string | null;
    display_order: number | null;
    locale: string;
    created_at: string;
    updated_at: string;
}
