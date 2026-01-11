'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProject(formData: FormData) {
    const supabase = await createClient();

    const locale = formData.get('locale') as string || 'ko';

    // 1. Insert into projects (shared)
    const { data: project, error: projError } = await supabase
        .from('projects')
        .insert({
            slug: formData.get('slug') as string,
            status: formData.get('status') as string || 'in_progress',
            technologies: formData.get('technologies') ? (formData.get('technologies') as string).split(',').map(t => t.trim()) : [],
            cover_image: formData.get('cover_image') as string || null,
            demo_url: formData.get('demo_url') as string || null,
            github_url: formData.get('github_url') as string || null,
            start_date: formData.get('start_date') as string || null,
            end_date: formData.get('end_date') as string || null,
            featured: formData.get('featured') === 'on',
        })
        .select()
        .single();

    if (projError) {
        return { error: projError.message };
    }

    // 2. Insert into project_translations
    const { error: transError } = await supabase.from('project_translations').insert({
        project_id: project.id,
        locale,
        title: formData.get('title') as string,
        description: formData.get('description') as string || null,
        contents: formData.get('contents') ? JSON.parse(formData.get('contents') as string) : null,
    });

    if (transError) {
        return { error: transError.message };
    }

    revalidatePath('/admin/projects');
    revalidatePath('/[locale]/tech/project', 'page');
    revalidatePath('/[locale]/projects', 'page');
    redirect('/admin/projects');
}

export async function updateProject(id: string, formData: FormData) {
    const supabase = await createClient();
    const locale = formData.get('locale') as string || 'ko';

    // 1. Update projects (shared)
    const { error: projError } = await supabase
        .from('projects')
        .update({
            slug: formData.get('slug') as string,
            status: formData.get('status') as string || 'in_progress',
            technologies: formData.get('technologies') ? (formData.get('technologies') as string).split(',').map(t => t.trim()) : [],
            cover_image: formData.get('cover_image') as string || null,
            demo_url: formData.get('demo_url') as string || null,
            github_url: formData.get('github_url') as string || null,
            start_date: formData.get('start_date') as string || null,
            end_date: formData.get('end_date') as string || null,
            featured: formData.get('featured') === 'on',
        })
        .eq('id', id);

    if (projError) {
        return { error: projError.message };
    }

    // 2. Upsert project_translations
    const { error: transError } = await supabase
        .from('project_translations')
        .upsert({
            project_id: id,
            locale,
            title: formData.get('title') as string,
            description: formData.get('description') as string || null,
            contents: formData.get('contents') ? JSON.parse(formData.get('contents') as string) : null,
        }, { onConflict: 'project_id, locale' });

    if (transError) {
        return { error: transError.message };
    }

    revalidatePath('/admin/projects');
    revalidatePath('/[locale]/tech/project', 'page');
    revalidatePath('/[locale]/projects', 'page');
    redirect('/admin/projects');
}

export async function deleteProject(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/admin/projects');
    revalidatePath('/[locale]/projects', 'page');
    return { success: true };
}
