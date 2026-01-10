'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createSkill(formData: FormData) {
    const supabase = await createClient();

    const skillData = {
        slug: formData.get('slug') as string,
        technologies: formData.get('technologies') ? (formData.get('technologies') as string).split(',').map(t => t.trim()) : [],
        icon: formData.get('icon') as string || null,
        cover_image: formData.get('cover_image') as string || null,
        level: formData.get('level') as string || null,
        category: formData.get('category') as string || null,
        display_order: formData.get('display_order') ? parseInt(formData.get('display_order') as string) : 0,
    };

    // 1. Insert Shared Data
    const { data: skill, error: skillError } = await supabase
        .from('skills')
        .insert([skillData])
        .select()
        .single();

    if (skillError) {
        return { error: skillError.message };
    }

    // 2. Insert Translation Data
    const locale = formData.get('locale') as string || 'ko';
    const translationData = {
        skill_id: skill.id,
        locale: locale,
        title: formData.get('title') as string,
        description: formData.get('description') as string || null,
        contents: formData.get('contents') ? JSON.parse(formData.get('contents') as string) : null,
    };

    const { error: transError } = await supabase
        .from('skill_translations')
        .insert([translationData]);

    if (transError) {
        return { error: transError.message };
    }

    revalidatePath('/admin/skills');
    revalidatePath('/[locale]/tech/skill', 'page');
    redirect('/admin/skills');
}

export async function updateSkill(id: string, formData: FormData) {
    const supabase = await createClient();

    const skillData = {
        slug: formData.get('slug') as string,
        technologies: formData.get('technologies') ? (formData.get('technologies') as string).split(',').map(t => t.trim()) : [],
        icon: formData.get('icon') as string || null,
        cover_image: formData.get('cover_image') as string || null,
        level: formData.get('level') as string || null,
        category: formData.get('category') as string || null,
        display_order: formData.get('display_order') ? parseInt(formData.get('display_order') as string) : 0,
    };

    // 1. Update Shared Data
    const { error: skillError } = await supabase
        .from('skills')
        .update(skillData)
        .eq('id', id);

    if (skillError) {
        return { error: skillError.message };
    }

    // 2. Upsert Translation Data
    const locale = formData.get('locale') as string || 'ko';
    const translationData = {
        skill_id: id,
        locale: locale,
        title: formData.get('title') as string,
        description: formData.get('description') as string || null,
        contents: formData.get('contents') ? JSON.parse(formData.get('contents') as string) : null,
    };

    const { error: transError } = await supabase
        .from('skill_translations')
        .upsert(translationData, { onConflict: 'skill_id, locale' });

    if (transError) {
        return { error: transError.message };
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
