import { createClient } from '@/lib/supabase/server';
import { FileText } from 'lucide-react';
import { TiptapRenderer } from '@/components/blog/tiptap-renderer';
import { ProfileSections } from '@/components/profile/profile-sections';
import type { Locale } from '@/i18n';

export default async function ProfilePage({ params }: { params: { locale: Locale } }) {
    const supabase = await createClient();
    const locale = (await params).locale;

    const { data: profileData } = await supabase.from('profiles').select('*, profile_translations(*)').single();
    const { data: workExperienceData } = await supabase.from('work_experience').select('*, work_experience_translations(*)').order('start_date', { ascending: false });
    const { data: educationData } = await supabase.from('education').select('*, education_translations(*)').order('start_date', { ascending: false });
    const { data: hobbiesData } = await supabase.from('hobbies').select('*, hobby_translations(*)');
    const { data: clubsData } = await supabase.from('clubs').select('*, club_translations(*)').order('start_date', { ascending: false });
    const { data: experiencesData } = await supabase.from('experiences').select('*, experience_translations(*)').order('date', { ascending: false });
    const { data: awardsData } = await supabase.from('awards').select('*, award_translations(*)').order('date', { ascending: false });
    const { data: certificationsData } = await supabase.from('certifications').select('*, certification_translations(*)').order('issue_date', { ascending: false });
    const { data: languages } = await supabase.from('languages').select('*').order('proficiency_level', { ascending: false });

    // Helper to extract localized content
    const getLocalized = (item: any, translationsField: string) => {
        if (!item) return null;
        const translations = item[translationsField] || [];
        const trans = translations.find((t: any) => t.locale === locale)
            || translations.find((t: any) => t.locale === 'ko')
            || translations.find((t: any) => t.locale === 'en')
            || translations[0]
            || {};
        return { ...item, ...trans };
    };

    const profile = getLocalized(profileData, 'profile_translations');
    const workExperience = (workExperienceData || []).map((item) => getLocalized(item, 'work_experience_translations'));
    const education = (educationData || []).map((item) => getLocalized(item, 'education_translations'));
    const hobbies = (hobbiesData || []).map((item) => getLocalized(item, 'hobby_translations'));
    const clubs = (clubsData || []).map((item) => getLocalized(item, 'club_translations'));
    const experiences = (experiencesData || []).map((item) => getLocalized(item, 'experience_translations'));
    const awards = (awardsData || []).map((item) => getLocalized(item, 'award_translations'));
    const certifications = (certificationsData || []).map((item) => getLocalized(item, 'certification_translations'));

    return (
        <div className="space-y-8">
            {/* Profile Header */}
            <div>
                <h1 className="text-4xl font-bold mb-2">{profile?.name || 'Your Name'}</h1>
                <p className="text-xl text-muted-foreground">{profile?.bio || 'Add your bio'}</p>
            </div>

            {/* Markdown Content Section */}
            {profile?.markdown_content && (
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <FileText className="h-5 w-5" />
                        <h2 className="text-2xl font-bold">About</h2>
                    </div>
                    <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <TiptapRenderer content={profile.markdown_content} />
                    </div>
                </section>
            )}

            {/* Collapsible Sections */}
            <ProfileSections
                hobbies={hobbies || []}
                education={education || []}
                workExperience={workExperience || []}
                clubs={clubs || []}
                awards={awards || []}
                certifications={certifications || []}
                experiences={experiences || []}
                languages={languages || []}
            />
        </div>
    );
}
