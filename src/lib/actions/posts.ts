'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
    const supabase = await createClient();

    // 1. Prepare shared data
    const postData = {
        slug: formData.get('slug') as string,
        cover_image: formData.get('cover_image') as string || null,
    };

    // 2. Insert into posts table (shared)
    const { data: post, error: postError } = await supabase
        .from('posts')
        .insert([postData])
        .select()
        .single();

    if (postError) {
        return { error: postError.message };
    }

    // 3. Handle Translations
    const translationsJson = formData.get('translations') as string;

    if (translationsJson) {
        try {
            const translationsMap = JSON.parse(translationsJson);
            const translationInserts = Object.entries(translationsMap).map(([locale, data]: [string, any]) => ({
                post_id: post.id,
                locale,
                title: data.title,
                excerpt: data.excerpt || null,
                content: data.content,
            })).filter(t => t.title); // Only insert if title exists

            if (translationInserts.length > 0) {
                const { error: transError } = await supabase
                    .from('post_translations')
                    .insert(translationInserts);

                if (transError) {
                    console.error('Error creating translations:', transError);
                    return { error: transError.message };
                }
            }
        } catch (e) {
            console.error('Failed to parse translations JSON:', e);
            return { error: 'Invalid translations data' };
        }
    } else {
        // Fallback to single locale (legacy support for old form submissions if any)
        const locale = formData.get('locale') as string || 'ko';
        const translationData = {
            post_id: post.id,
            locale: locale,
            title: formData.get('title') as string,
            excerpt: formData.get('excerpt') as string || null,
            content: formData.get('content') ? JSON.parse(formData.get('content') as string) : null,
        };

        const { error: transError } = await supabase
            .from('post_translations')
            .insert([translationData]);

        if (transError) {
            console.error('Error creating translation:', transError);
            return { error: transError.message };
        }
    }

    // 4. Handle tags
    const tags = formData.get('tags') as string;
    if (tags && post) {
        const tagArray = tags.split(',').map(t => t.trim()).filter(t => t);
        const tagInserts = tagArray.map(tag => ({
            post_id: post.id,
            tag,
        }));

        if (tagInserts.length > 0) {
            await supabase.from('post_tags').insert(tagInserts);
        }
    }

    revalidatePath('/admin/blog');
    revalidatePath('/[locale]/blog', 'page');
    redirect('/admin/blog');
}

export async function updatePost(id: string, formData: FormData) {
    const supabase = await createClient();

    // 1. Update shared data
    const sharedUpdates = {
        slug: formData.get('slug') as string,
        cover_image: formData.get('cover_image') as string || null,
    };

    const { error: postError } = await supabase
        .from('posts')
        .update(sharedUpdates)
        .eq('id', id);

    if (postError) {
        return { error: postError.message };
    }

    // 2. Upsert localized data
    const translationsJson = formData.get('translations') as string;

    if (translationsJson) {
        try {
            const translationsMap = JSON.parse(translationsJson);
            const translationUpserts = Object.entries(translationsMap).map(([locale, data]: [string, any]) => ({
                post_id: id,
                locale,
                title: data.title,
                excerpt: data.excerpt || null,
                content: data.content,
            })).filter(t => t.title);

            if (translationUpserts.length > 0) {
                const { error: transError } = await supabase
                    .from('post_translations')
                    .upsert(translationUpserts, { onConflict: 'post_id, locale' });

                if (transError) {
                    return { error: transError.message };
                }
            }
        } catch (e) {
            console.error('Failed to parse translations JSON:', e);
            return { error: 'Invalid translations data' };
        }
    } else {
        // Fallback for single locale updates
        const locale = formData.get('locale') as string || 'ko';
        const translationData = {
            post_id: id,
            locale: locale,
            title: formData.get('title') as string,
            excerpt: formData.get('excerpt') as string || null,
            content: formData.get('content') ? JSON.parse(formData.get('content') as string) : null,
        };

        const { error: transError } = await supabase
            .from('post_translations')
            .upsert(translationData, { onConflict: 'post_id, locale' });

        if (transError) {
            return { error: transError.message };
        }
    }

    // 3. Update tags
    await supabase.from('post_tags').delete().eq('post_id', id);

    const tags = formData.get('tags') as string;
    if (tags) {
        const tagArray = tags.split(',').map(t => t.trim()).filter(t => t);
        const tagInserts = tagArray.map(tag => ({
            post_id: id,
            tag,
        }));

        if (tagInserts.length > 0) {
            await supabase.from('post_tags').insert(tagInserts);
        }
    }

    revalidatePath('/admin/blog');
    // Revalidate all locales
    revalidatePath('/[locale]/blog', 'page');
    redirect('/admin/blog');
}

export async function deletePost(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/admin/blog');
    return { success: true };
}
