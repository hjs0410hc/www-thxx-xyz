import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProjectForm } from '@/components/admin/edit-project-form';

export default async function EditProjectPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: project } = await supabase
        .from('projects')
        .select('*, project_translations(*)')
        .eq('id', id)
        .single();

    if (!project) {
        notFound();
    }

    return (
        <div className="container max-w-4xl py-8">
            <div className="mb-6">
                <Link href="/admin/projects">
                    <Button variant="ghost">← Back to Projects</Button>
                </Link>
            </div>

            <ProjectForm project={project} />
        </div>
    );
}
