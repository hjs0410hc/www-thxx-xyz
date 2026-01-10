import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EditBlogPostForm } from '@/components/admin/edit-blog-post-form';

export default async function EditBlogPostPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: post } = await supabase
        .from('posts')
        .select('*, post_tags(*), post_translations(*)')
        .eq('id', id)
        .single();

    if (!post) {
        notFound();
    }

    const tags = post.post_tags?.map((t: any) => t.tag).join(', ') || '';

    return (
        <div className="container max-w-4xl py-8">
            <div className="mb-6">
                <Link href="/admin/blog">
                    <Button variant="ghost">← Back to Blog</Button>
                </Link>
            </div>

            <EditBlogPostForm post={post} tags={tags} />
        </div>
    );
}
