export interface Profile {
    id: string;
    birth_date: string | null;
    gender: string | null;
    email: string | null;
    profile_image_url: string | null;
    created_at: string;
    updated_at: string;
    profile_translations?: ProfileTranslation[];
}

export interface ProfileTranslation {
    id: string;
    profile_id: string;
    locale: string;
    name: string | null;
    phone: string | null;
    nationality: string | null;
    military_service: string | null;
    bio: string | null;
    markdown_content: any | null;
}

export interface Hobby {
    id: string;
    slug: string;
    preview_image: string | null;
    created_at: string;
    updated_at: string;
    hobby_translations?: HobbyTranslation[];
}

export interface HobbyTranslation {
    id: string;
    hobby_id: string;
    locale: string;
    name: string | null;
    description: string | null;
    content: any | null;
}

export interface Education {
    id: string;
    slug: string;
    type: string;
    start_date: string;
    end_date: string | null;
    preview_image: string | null;
    created_at: string;
    updated_at: string;
    education_translations?: EducationTranslation[];
}

export interface EducationTranslation {
    id: string;
    education_id: string;
    locale: string;
    institution: string | null;
    degree: string | null;
    field: string | null;
    description: string | null;
    content: any | null;
}

export interface WorkExperience {
    id: string;
    slug: string;
    type: string;
    start_date: string;
    end_date: string | null;
    preview_image: string | null;
    created_at: string;
    updated_at: string;
    work_experience_translations?: WorkExperienceTranslation[];
}

export interface WorkExperienceTranslation {
    id: string;
    work_experience_id: string;
    locale: string;
    company: string | null;
    position: string | null;
    location: string | null;
    description: string | null;
    content: any | null;
}

export interface Club {
    id: string;
    slug: string;
    start_date: string;
    end_date: string | null;
    preview_image: string | null;
    created_at: string;
    updated_at: string;
    club_translations?: ClubTranslation[];
}

export interface ClubTranslation {
    id: string;
    club_id: string;
    locale: string;
    name: string | null;
    role: string | null;
    description: string | null;
    content: any | null;
}

export interface Experience {
    id: string;
    slug: string;
    date: string;
    end_date: string | null;
    preview_image: string | null;
    created_at: string;
    updated_at: string;
    experience_translations?: ExperienceTranslation[];
}

export interface ExperienceTranslation {
    id: string;
    experience_id: string;
    locale: string;
    title: string | null;
    organization: string | null;
    description: string | null;
    content: any | null;
}

export interface Award {
    id: string;
    slug: string;
    date: string;
    preview_image: string | null;
    created_at: string;
    updated_at: string;
    award_translations?: AwardTranslation[];
}

export interface AwardTranslation {
    id: string;
    award_id: string;
    locale: string;
    title: string | null;
    issuer: string | null;
    description: string | null;
    content: any | null;
}

export interface Certification {
    id: string;
    slug: string;
    issue_date: string;
    expiry_date: string | null;
    preview_image: string | null;
    created_at: string;
    updated_at: string;
    certification_translations?: CertificationTranslation[];
}

export interface CertificationTranslation {
    id: string;
    certification_id: string;
    locale: string;
    name: string | null;
    issuer: string | null;
    description: string | null;
    content: any | null;
}
