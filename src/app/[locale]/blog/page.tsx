import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import { BlogSidebar } from '@/components/blog/blog-sidebar';

export default async function BlogPage({
    params,
    searchParams,
}: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ tag?: string }>;
}) {
    const { locale } = await params;
    const { tag: searchTag } = await searchParams;
    const supabase = await createClient();

    // Fetch all tags for the sidebar
    const { data: allTags } = await supabase
        .from('post_tags')
        .select('tag');

    // Process tags to get counts
    const tagCounts = (allTags || []).reduce((acc: Record<string, number>, curr) => {
        acc[curr.tag] = (acc[curr.tag] || 0) + 1;
        return acc;
    }, {});

    const formattedTags = Object.entries(tagCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

    // Build query for posts
    let query = supabase
        .from('posts')
        .select('*, post_tags(*), post_translations(*)')
        .eq('published', true)
        .order('published_at', { ascending: false });

    // Apply tag filter if present
    if (searchTag) {
        // Step 1: Find post IDs that have the tag
        const { data: matchingTags } = await supabase
            .from('post_tags')
            .select('post_id')
            .eq('tag', searchTag);

        const postIds = matchingTags?.map(t => t.post_id) || [];

        if (postIds.length > 0) {
            // Step 2: Fetch posts with those IDs
            query = query.in('id', postIds);
        } else {
            // No posts found with this tag, return empty by using an impossible ID
            query = query.eq('id', '00000000-0000-0000-0000-000000000000');
        }
    }

    const { data: rawPosts } = await query;

    // Flatten and localize posts
    const posts = (rawPosts || []).map((p: any) => {
        const translations = p.post_translations || [];
        const trans = translations.find((t: any) => t.locale === locale)
            || translations.find((t: any) => t.locale === 'ko')
            || translations.find((t: any) => t.locale === 'en')
            || translations[0]
            || {};

        return {
            ...p,
            title: trans.title || p.title || '(No Title)', // Fallback to p.title if legacy data exists and migration failed, or just safety
            excerpt: trans.excerpt || p.excerpt,
            content: trans.content,
        };
    });

    const formatDate = (date: string | null) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    // Calculate reading time (rough estimate: 200 words per minute)
    const calculateReadingTime = (content: any) => {
        if (!content) return 0;
        const text = JSON.stringify(content);
        const words = text.split(/\s+/).length;
        return Math.ceil(words / 200);
    };

    return (
        <div className="container py-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Blog</h1>
                <p className="text-muted-foreground mt-2">
                    Technical articles and thoughts
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Sidebar */}
                <div className="lg:col-span-1">
                    <BlogSidebar tags={formattedTags} currentTag={searchTag} locale={locale} />
                </div>

                {/* Right Content Area */}
                <div className="lg:col-span-3 space-y-4">
                    {posts && posts.length > 0 ? (
                        posts.map((post) => (
                            <Link key={post.id} href={`/${locale}/blog/${post.slug}`}>
                                <Card className="transition-all hover:shadow-md hover:scale-[1.01]">
                                    <CardContent>
                                        <div className="flex flex-col md:flex-row gap-6">
                                            {/* Cover Image */}
                                            {post.cover_image && (
                                                <div className="w-full md:w-48 h-32 relative rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                                                    <Image
                                                        src={post.cover_image}
                                                        alt={post.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>

                                                {post.excerpt && (
                                                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                                        {post.excerpt}
                                                    </p>
                                                )}

                                                {/* Meta Info */}
                                                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-3">
                                                    {post.published_at && (
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            <span>{formatDate(post.published_at)}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        <span>{calculateReadingTime(post.content)} min read</span>
                                                    </div>
                                                </div>

                                                {/* Tags */}
                                                {post.post_tags && post.post_tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {post.post_tags.slice(0, 3).map((tagObj: any) => (
                                                            <Badge key={tagObj.id} variant="secondary" className="text-xs">
                                                                {tagObj.tag}
                                                            </Badge>
                                                        ))}
                                                        {post.post_tags.length > 3 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{post.post_tags.length - 3} more
                                                            </Badge>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>No Posts Found</CardTitle>
                                <CardDescription>
                                    {searchTag
                                        ? `No posts found with tag "${searchTag}".`
                                        : "Blog posts will appear here once published."}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
