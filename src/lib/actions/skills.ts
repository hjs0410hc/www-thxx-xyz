'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createSkill(formData: FormData) {
    const supabase = await createClient();

    const skillData = {
        title: formData.get('title') as string,
        slug: formData.get('slug') as string,
        description: formData.get('description') as string || null,
        contents: formData.get('contents') ? JSON.parse(formData.get('contents') as string) : null,
        technologies: formData.get('technologies') ? (formData.get('technologies') as string).split(',').map(t => t.trim()) : [],
        icon: formData.get('icon') as string || null,
        cover_image: formData.get('cover_image') as string || null, // Added
        level: formData.get('level') as string || null,
        category: formData.get('category') as string || null,
        display_order: formData.get('display_order') ? parseInt(formData.get('display_order') as string) : 0,
        locale: formData.get('locale') as string || 'ko',
    };

    const { error } = await supabase
        .from('skills')
        .insert([skillData]);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/admin/skills');
    revalidatePath('/[locale]/tech/skill', 'page');
    redirect('/admin/skills');
}

export async function updateSkill(id: string, formData: FormData) {
    const supabase = await createClient();

    const skillData = {
        title: formData.get('title') as string,
        slug: formData.get('slug') as string,
        description: formData.get('description') as string || null,
        contents: formData.get('contents') ? JSON.parse(formData.get('contents') as string) : null,
        technologies: formData.get('technologies') ? (formData.get('technologies') as string).split(',').map(t => t.trim()) : [],
        icon: formData.get('icon') as string || null,
        cover_image: formData.get('cover_image') as string || null, // Added
        level: formData.get('level') as string || null,
        category: formData.get('category') as string || null,
        display_order: formData.get('display_order') ? parseInt(formData.get('display_order') as string) : 0,
        locale: formData.get('locale') as string || 'ko',
    };

    const { error } = await supabase
        .from('skills')
        .update(skillData)
        .eq('id', id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/admin/skills');
    revalidatePath('/[locale]/tech/skill', 'page');
    redirect('/admin/skills');
}

export async function deleteSkill(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/admin/skills');
    revalidatePath('/[locale]/tech/skill', 'page');
    return { success: true };
}
