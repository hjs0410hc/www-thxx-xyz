import { createClient } from '@/lib/supabase/server';
import { EditSkillForm } from '@/components/admin/edit-skill-form';
import { notFound } from 'next/navigation';

export default async function EditSkillPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: skill } = await supabase
        .from('skills')
        .select('*')
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
