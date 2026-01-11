import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProjectForm } from '@/components/admin/edit-project-form';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: project } = await supabase
        .from('projects')
        .select('*, project_translations(*)')
        .eq('id', id)
        .single();

    if (!project) return { title: 'Projects - Edit Project' };

    const trans = project.project_translations?.find((t: any) => t.locale === 'ko')
        || project.project_translations?.find((t: any) => t.locale === 'en')
        || project.project_translations?.[0]
        || {};

    return {
        title: `Projects - Edit ${trans.title || 'Project'}`,
    };
}

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
