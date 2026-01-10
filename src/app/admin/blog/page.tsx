import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Plus, Edit } from 'lucide-react';
import { DeletePostButton } from '@/components/admin/delete-post-button';

export default async function AdminBlogPage() {
    const supabase = await createClient();

    const { data: postsData } = await supabase
        .from('posts')
        .select('*, post_tags(*), post_translations(*)')
        .order('created_at', { ascending: false });

    const posts = (postsData || []).map((p: any) => {
        const translations = p.post_translations || [];
        const trans = translations.find((t: any) => t.locale === 'ko')
            || translations.find((t: any) => t.locale === 'en')
            || translations[0]
            || {}; // Default to empty if no translation (shouldn't happen if created correctly)

        return {
            ...p,
            title: trans.title || '(No Title)',
            excerpt: trans.excerpt,
            locale: trans.locale || 'ko', // Show which locale we picked
        };
    });

    return (
        <div className="container py-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Blog Posts</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your blog content
                    </p>
                </div>
                <Link href="/admin/blog/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Post
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {posts && posts.length > 0 ? (
                    posts.map((post) => (
                        <Card key={post.id}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-xl font-semibold">{post.title}</h3>
                                            <Badge variant="outline">{post.locale}</Badge>
                                            {post.published ? (
                                                <Badge variant="default">Published</Badge>
                                            ) : (
                                                <Badge variant="secondary">Draft</Badge>
                                            )}
                                        </div>

                                        {post.excerpt && (
                                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                                {post.excerpt}
                                            </p>
                                        )}

                                        {post.post_tags && post.post_tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {post.post_tags.map((tagObj: any) => (
                                                    <Badge key={tagObj.id} variant="secondary" className="text-xs">
                                                        {tagObj.tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <Link href={`/admin/blog/${post.id}/edit`}>
                                            <Button variant="outline" size="icon">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <DeletePostButton id={post.id} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>No Posts Yet</CardTitle>
                            <CardDescription>
                                Create your first blog post to get started.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                )}
            </div>

            <div className="mt-6">
                <Link href="/admin">
                    <Button variant="ghost">← Back to Dashboard</Button>
                </Link>
            </div>
        </div>
    );
}
