export type ProjectStatus = 'in_progress' | 'completed' | 'discontinued' | 'archived';

export interface ProjectTranslation {
    id: string;
    project_id: string;
    locale: string;
    title: string;
    description: string | null;
    contents: any | null; // JSONB for Tiptap
}

export interface Project {
    id: string;
    slug: string;
    technologies: string[] | null;
    cover_image: string | null;
    demo_url: string | null;
    github_url: string | null;
    start_date: string | null; // ISO Date string
    end_date: string | null; // ISO Date string
    featured: boolean;
    display_order: number | null;
    status: ProjectStatus | null;
    created_at: string;
    updated_at: string;
    project_translations?: ProjectTranslation[];
}

export interface ProjectWithDetails extends Project {
    title: string;
    description: string | null;
    contents: any | null;
}

export type SkillLevel = 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';

export interface SkillTranslation {
    id: string;
    skill_id: string;
    locale: string;
    title: string;
    description: string | null;
    contents: any | null;
}

export interface Skill {
    id: string;
    slug: string;
    technologies: string[] | null;
    icon: string | null;
    cover_image: string | null; // Added
    level: SkillLevel | null;
    category: string | null;
    display_order: number | null;
    created_at: string;
    updated_at: string;
    skill_translations?: SkillTranslation[];
}

export interface SkillWithDetails extends Skill {
    title: string;
    description: string | null;
    contents: any | null;
}
