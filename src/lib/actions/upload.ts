'use server';

import { createClient } from '@/lib/supabase/server';

export async function uploadImage(formData: FormData) {
    const supabase = await createClient();
    const file = formData.get('file') as File;

    if (!file) {
        return { error: 'No file provided' };
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
        return { error: 'File must be an image' };
    }

    // Validate file size (max 5MB)
    if (file.size > 10 * 1024 * 1024) {
        return { error: 'File size must be less than 10MB' };
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) {
        return { error: error.message };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

    return { url: publicUrl };
}
