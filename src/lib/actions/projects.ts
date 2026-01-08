'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProject(formData: FormData) {
    const supabase = await createClient();

    const projectData = {
        title: formData.get('title') as string,
        slug: formData.get('slug') as string,
        description: formData.get('description') as string || null,
        contents: formData.get('contents') ? JSON.parse(formData.get('contents') as string) : null,
        status: formData.get('status') as string || 'in_progress',
        technologies: formData.get('technologies') ? (formData.get('technologies') as string).split(',').map(t => t.trim()) : [],
        cover_image: formData.get('cover_image') as string || null, // Added
        demo_url: formData.get('demo_url') as string || null,
        github_url: formData.get('github_url') as string || null,
        start_date: formData.get('start_date') as string || null,
        end_date: formData.get('end_date') as string || null,
        featured: formData.get('featured') === 'on',
        locale: formData.get('locale') as string || 'ko',
    };

    const { error } = await supabase
        .from('projects')
        .insert([projectData]);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/admin/projects');
    revalidatePath('/[locale]/tech/project', 'page');
    revalidatePath('/[locale]/projects', 'page'); // Keep for old path
    redirect('/admin/projects');
}

export async function updateProject(id: string, formData: FormData) {
    const supabase = await createClient();

    const projectData = {
        title: formData.get('title') as string,
        slug: formData.get('slug') as string,
        description: formData.get('description') as string || null,
        contents: formData.get('contents') ? JSON.parse(formData.get('contents') as string) : null,
        status: formData.get('status') as string || 'in_progress',
        technologies: formData.get('technologies') ? (formData.get('technologies') as string).split(',').map(t => t.trim()) : [],
        cover_image: formData.get('cover_image') as string || null, // Added
        demo_url: formData.get('demo_url') as string || null,
        github_url: formData.get('github_url') as string || null,
        start_date: formData.get('start_date') as string || null,
        end_date: formData.get('end_date') as string || null,
        featured: formData.get('featured') === 'on',
        locale: formData.get('locale') as string || 'ko',
    };

    const { error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', id);

    if (error) {
        return { error: error.message };
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
