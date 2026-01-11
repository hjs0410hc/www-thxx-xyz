import { createClient } from '@/lib/supabase/server';
import { EditSkillForm } from '@/components/admin/edit-skill-form';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: skill } = await supabase
        .from('skills')
        .select('*, skill_translations(*)')
        .eq('id', id)
        .single();

    if (!skill) return { title: 'Skills - Edit Skill' };

    const trans = skill.skill_translations?.find((t: any) => t.locale === 'ko')
        || skill.skill_translations?.find((t: any) => t.locale === 'en')
        || skill.skill_translations?.[0]
        || {};

    return {
        title: `Skills - Edit ${trans.title || 'Skill'}`,
    };
}

export default async function EditSkillPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: skill } = await supabase
        .from('skills')
        .select(`
            *,
            skill_translations (*)
        `)
        .eq('id', id)
        .single();

    if (!skill) {
        notFound();
    }

    return (
        <div className="container py-8 max-w-4xl">
            <EditSkillForm mode="edit" skill={skill} />
        </div>
    );
}
