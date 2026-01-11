'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();
    const locale = formData.get('locale') as string || 'ko';

    // Get the first profile (assuming single user)
    const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .single();

    // Shared Data
    const profileData = {
        email: formData.get('email') as string,
        birth_date: formData.get('birth_date') as string || null,
        gender: formData.get('gender') as string || null,
        profile_image_url: formData.get('profile_image_url') as string || null,
    };

    let profileId = existingProfile?.id;

    if (existingProfile) {
        // Update existing profile (shared)
        const { error } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('id', existingProfile.id);

        if (error) return { error: error.message };
    } else {
        // Create new profile (shared)
        const { data: newProfile, error } = await supabase
            .from('profiles')
            .insert([profileData])
            .select()
            .single();

        if (error) return { error: error.message };
        profileId = newProfile.id;
    }

    // Upsert Translations
    const { error: transError } = await supabase
        .from('profile_translations')
        .upsert({
            profile_id: profileId,
            locale,
            name: formData.get('name') as string,
            phone: formData.get('phone') as string,
            nationality: formData.get('nationality') as string,
            military_service: formData.get('military_service') as string || null,
            bio: formData.get('bio') as string || null,
            markdown_content: formData.get('markdown_content') ? JSON.parse(formData.get('markdown_content') as string) : null,
        }, { onConflict: 'profile_id, locale' });

    if (transError) return { error: transError.message };

    revalidatePath('/admin/profile');
    revalidatePath('/[locale]/profile', 'page');
    revalidatePath('/[locale]', 'page'); // Update home page if bio is used there

    return { success: true };
}

export async function addSocialLink(formData: FormData) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('social_links')
        .insert([{
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

export async function updateSocialLink(id: string, formData: FormData) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('social_links')
        .update({
            platform: formData.get('platform') as string,
            url: formData.get('url') as string,
        })
        .eq('id', id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/admin/profile');
    return { success: true };
}

export async function addLanguage(formData: FormData) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('languages')
        .insert([{
            language: formData.get('language') as string,
            proficiency_level: formData.get('proficiency_level') as string,
        }]);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/admin/profile');
    return { success: true };
}

export async function updateLanguage(id: string, formData: FormData) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('languages')
        .update({
            language: formData.get('language') as string,
            proficiency_level: formData.get('proficiency_level') as string,
        })
        .eq('id', id);

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
