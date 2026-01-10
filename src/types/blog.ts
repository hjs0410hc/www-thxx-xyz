export interface PostTranslation {
    id: string;
    post_id: string;
    locale: string;
    title: string;
    excerpt: string | null;
    content: any | null; // JSONB for Tiptap
}

export interface Post {
    id: string;
    slug: string;
    cover_image: string | null;
    published: boolean;
    published_at: string | null; // ISO Date string
    created_at: string;
    updated_at: string;
    post_translations?: PostTranslation[];
    post_tags?: { tag: string }[];
}

export interface PostWithDetails extends Post {
    title: string;
    excerpt: string | null;
    content: any | null;
}
