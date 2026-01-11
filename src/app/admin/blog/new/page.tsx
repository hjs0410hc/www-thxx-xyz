
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { NewBlogPostForm } from '@/components/admin/new-blog-post-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blog - New Post',
};

export default function NewBlogPostPage() {
    return (
        <div className="container max-w-4xl py-8">
            <div className="mb-6">
                <Link href="/admin/blog">
                    <Button variant="ghost">← Back to Blog</Button>
                </Link>
            </div>

            <NewBlogPostForm />
        </div>
    );
}
