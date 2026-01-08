'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();

    // Get the first profile (assuming single user)
    const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .single();

    const profileData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        nationality: formData.get('nationality') as string,
        birth_date: formData.get('birth_date') as string || null,
        gender: formData.get('gender') as string || null,
        military_service: formData.get('military_service') as string || null,
        bio: formData.get('bio') as string || null,
        profile_image_url: formData.get('profile_image_url') as string || null,
        markdown_content: formData.get('markdown_content') ? JSON.parse(formData.get('markdown_content') as string) : null,
    };

    if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('id', existingProfile.id);

        if (error) {
            return { error: error.message };
        }
    } else {
        // Create new profile
        const { error } = await supabase
            .from('profiles')
            .insert([profileData]);

        if (error) {
            return { error: error.message };
        }
    }

    revalidatePath('/admin/profile');
    revalidatePath('/[locale]/profile', 'page');

    return { success: true };
}

export async function addSocialLink(formData: FormData) {
    const supabase = await createClient();

    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .single();

    if (!profile) {
        return { error: 'Profile not found' };
    }

    const { error } = await supabase
        .from('social_links')
        .insert([{
            profile_id: profile.id,
            platform: formData.get('platform') as string,
            url: formData.get('url') as string,
            display_order: parseInt(formData.get('display_order') as string) || 0,
        }]);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/admin/profile');
    return { success: true };
}

export async function deleteSocialLink(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('id', id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/admin/profile');
    return { success: true };
}

export async function addLanguage(formData: FormData) {
    const supabase = await createClient();

    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .single();

    if (!profile) {
        return { error: 'Profile not found' };
    }

    const { error } = await supabase
        .from('languages')
        .insert([{
            profile_id: profile.id,
            language: formData.get('language') as string,
            proficiency_level: formData.get('proficiency_level') as string,
        }]);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/admin/profile');
    return { success: true };
}

export async function deleteLanguage(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('languages')
        .delete()
        .eq('id', id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/admin/profile');
    return { success: true };
}
