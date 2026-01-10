import { createClient } from '@/lib/supabase/server';
import { TechSections } from '@/components/tech/tech-sections';

export default async function TechSummaryPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const supabase = await createClient();

    // Fetch featured or all projects
    const { data: projectsData } = await supabase
        .from('projects')
        .select('*, project_translations(*)')
        .order('created_at', { ascending: false });

    // Fetch all skills
    const { data: skillsData } = await supabase
        .from('skills')
        .select('*, skill_translations(*)')
        .order('display_order', { ascending: true });

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

    const projects = (projectsData || []).map(p => getLocalized(p, 'project_translations'));
    const skills = (skillsData || []).map(s => getLocalized(s, 'skill_translations'));

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-4xl font-bold">Summary</h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    Welcome to my technology portfolio. Explore my projects and technical skills.
                </p>
            </div>

            <TechSections
                projects={projects || []}
                skills={skills || []}
                locale={locale}
            />
        </div>
    );
}
