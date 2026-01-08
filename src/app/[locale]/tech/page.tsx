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
    const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('locale', locale)
        .order('created_at', { ascending: false });

    // Fetch all skills
    const { data: skills } = await supabase
        .from('skills')
        .select('*')
        .eq('locale', locale)
        .order('display_order', { ascending: true });

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
