'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
    const supabase = await createClient();

    const postData = {
        title: formData.get('title') as string,
        slug: formData.get('slug') as string,
        excerpt: formData.get('excerpt') as string || null,
        cover_image: formData.get('cover_image') as string || null,
        content: formData.get('content') ? JSON.parse(formData.get('content') as string) : null,
        published: formData.get('published') === 'on',
        published_at: formData.get('published') === 'on' ? new Date().toISOString() : null,
        locale: formData.get('locale') as string || 'ko',
    };

    const { data: post, error } = await supabase
        .from('posts')
        .insert([postData])
        .select()
        .single();

    if (error) {
        return { error: error.message };
    }

    // Handle tags
    const tags = formData.get('tags') as string;
    if (tags && post) {
        const tagArray = tags.split(',').map(t => t.trim()).filter(t => t);
        const tagInserts = tagArray.map(tag => ({
            post_id: post.id,
            tag,
        }));

        await supabase.from('post_tags').insert(tagInserts);
    }

    revalidatePath('/admin/blog');
    revalidatePath('/[locale]/blog', 'page');
    redirect('/admin/blog');
}

export async function updatePost(id: string, formData: FormData) {
    const supabase = await createClient();

    const postData = {
        title: formData.get('title') as string,
        slug: formData.get('slug') as string,
        excerpt: formData.get('excerpt') as string || null,
        cover_image: formData.get('cover_image') as string || null,
        content: formData.get('content') ? JSON.parse(formData.get('content') as string) : null,
        published: formData.get('published') === 'on',
        published_at: formData.get('published') === 'on' ? new Date().toISOString() : null,
        locale: formData.get('locale') as string || 'ko',
    };

    const { error } = await supabase
        .from('posts')
        .update(postData)
        .eq('id', id);

    if (error) {
        return { error: error.message };
    }

    // Update tags - delete old ones and insert new ones
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
    revalidatePath('/[locale]/blog', 'page');
    return { success: true };
}
