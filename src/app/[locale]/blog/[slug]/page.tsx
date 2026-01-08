import { createClient } from '@/lib/supabase/server';
import { generateMetadata as generateSEOMetadata, generateArticleStructuredData } from '@/lib/seo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { TiptapRenderer } from '@/components/blog/tiptap-renderer';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    const supabase = await createClient();

    const { data: post } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('locale', locale)
        .eq('published', true)
        .single();

    if (!post) {
        return {};
    }

    return generateSEOMetadata({
        title: post.title,
        description: post.excerpt || post.title,
        path: `/${locale}/blog/${slug}`,
        locale,
        image: post.cover_image || undefined,
        type: 'article',
        publishedTime: post.published_at,
    });
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    const supabase = await createClient();

    const { data: post } = await supabase
        .from('posts')
        .select('*, post_tags(*)')
        .eq('slug', slug)
        .eq('locale', locale)
        .eq('published', true)
        .single();

    if (!post) {
        notFound();
    }

    const formatDate = (date: string | null) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const calculateReadingTime = (content: any) => {
        if (!content) return 0;
        const text = JSON.stringify(content);
        const words = text.split(/\s+/).length;
        return Math.ceil(words / 200);
    };

    // Generate structured data
    const structuredData = generateArticleStructuredData({
        title: post.title,
        description: post.excerpt || post.title,
        publishedTime: post.published_at,
        image: post.cover_image || undefined,
        tags: post.post_tags?.map((t: any) => t.tag),
    });

    return (
        <>
            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <div className="container py-8 max-w-4xl">
                {/* Back Button */}
                <Button variant="ghost" asChild className="mb-6">
                    <Link href={`/${locale}/blog`}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Blog
                    </Link>
                </Button>

                <article className="space-y-6">
                    {/* Cover Image */}
                    {post.cover_image && (
                        <div className="overflow-hidden rounded-lg">
                            <AspectRatio ratio={16 / 9}>
                                <Image
                                    src={post.cover_image}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                />
                            </AspectRatio>
                        </div>
                    )}

                    {/* Post Header */}
                    <div>
                        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                            {post.published_at && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>{formatDate(post.published_at)}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{calculateReadingTime(post.content)} min read</span>
                            </div>
                        </div>

                        {/* Tags */}
                        {post.post_tags && post.post_tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {post.post_tags.map((tagObj: any) => (
                                    <Badge key={tagObj.id} variant="secondary">
                                        {tagObj.tag}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Post Content */}
                    <div className="prose prose-neutral dark:prose-invert max-w-none">
                        {post.excerpt && (
                            <p className="lead text-xl text-muted-foreground">
                                {post.excerpt}
                            </p>
                        )}

                        {post.content && (
                            <div className="mt-6">
                                <TiptapRenderer content={post.content} />
                            </div>
                        )}
                    </div>
                </article>
            </div>
        </>
    );
}
