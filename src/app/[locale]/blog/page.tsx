import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

import { BlogSidebar } from '@/components/blog/blog-sidebar';
import { getTranslations } from 'next-intl/server';
import { MobileBlogMenu } from '@/components/blog/mobile-blog-menu';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'blog' });
    return {
        title: t('title'),
    };
}

export default async function BlogPage({

    params,
    searchParams,
}: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ tag?: string; q?: string }>;
}) {
    const { locale } = await params;
    const { tag: searchTag, q: userSearchQuery } = await searchParams;
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
        .order('created_at', { ascending: false });

    // Apply tag and search filter
    let postIds = new Set<string>();
    let searchPerformed = false;

    // Handle text search
    if (userSearchQuery) {
        searchPerformed = true;

        // 1. Search in translations (title, excerpt)
        const { data: transMatches } = await supabase
            .from('post_translations')
            .select('post_id')
            .or(`title.ilike.%${userSearchQuery}%,excerpt.ilike.%${userSearchQuery}%`);

        // 2. Search tags
        const { data: tagMatches } = await supabase
            .from('post_tags')
            .select('post_id')
            .ilike('tag', `%${userSearchQuery}%`);

        // Collect IDs
        transMatches?.forEach(t => postIds.add(t.post_id));
        tagMatches?.forEach(t => postIds.add(t.post_id));
    }

    // Handle Tag Filter
    if (searchTag) {
        const { data: tagFilterMatches } = await supabase
            .from('post_tags')
            .select('post_id')
            .eq('tag', searchTag);

        const tagIds = new Set(tagFilterMatches?.map(t => t.post_id) || []);

        if (searchPerformed) {
            // Intersect
            postIds = new Set([...postIds].filter(x => tagIds.has(x)));
        } else {
            // Just use tag IDs
            postIds = tagIds;
            searchPerformed = true;
        }
    }

    // Apply filters to query
    if (searchPerformed) {
        if (postIds.size > 0) {
            query = query.in('id', Array.from(postIds));
        } else {
            // No matches
            query = query.eq('id', '00000000-0000-0000-0000-000000000000');
        }
    }

    const { data: rawPosts } = await query;

    const posts = (rawPosts || []).map((p: any) => {
        const translations = p.post_translations || [];
        const trans = translations.find((t: any) => t.locale === locale)
            || translations.find((t: any) => t.locale === 'ko')
            || translations.find((t: any) => t.locale === 'en')
            || translations[0]
            || {};

        const LANGUAGE_ORDER = ['ko', 'en', 'ja'];
        const locales = (translations.map((t: any) => t.locale) as string[]).sort((a, b) => {
            return LANGUAGE_ORDER.indexOf(a) - LANGUAGE_ORDER.indexOf(b);
        });

        return {
            ...p,
            title: trans.title || p.title || '(No Title)',
            excerpt: trans.excerpt || p.excerpt,
            content: trans.content,
            locales,
        };
    });

    const formatDate = (date: string | null) => {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    const LANGUAGE_LABELS: Record<string, string> = {
        ko: '한국어',
        en: 'English',
        ja: '日本語',
    };

    const t = await getTranslations({ locale, namespace: 'blog' });
    const ct = await getTranslations({ locale, namespace: 'common' });

    return (
        <div className="container py-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">{t('title')}</h1>
                <p className="text-muted-foreground mt-2">
                    {t('description')}
                </p>
            </div>

            {/* Mobile Menu */}
            <MobileBlogMenu tags={formattedTags} currentTag={searchTag} locale={locale} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Sidebar - Hidden on mobile, handled by MobileBlogMenu */}
                <div className="hidden lg:block lg:col-span-1">
                    <BlogSidebar tags={formattedTags} currentTag={searchTag} locale={locale} />
                </div>

                {/* Right Content Area */}
                <div className="lg:col-span-3 space-y-4">
                    {posts && posts.length > 0 ? (
                        posts.map((post) => (
                            <Link key={post.id} href={`/${locale}/blog/${post.slug}`}>
                                <Card className="transition-all hover:shadow-md hover:scale-[1.01] mb-4 relative">
                                    <div className="absolute top-6 right-6 flex gap-1 z-10">
                                        {post.locales.map((l: string) => (
                                            <Badge key={l} variant="secondary" className="text-[15px] py-0.5 px-1.5 font-normal">
                                                {LANGUAGE_LABELS[l] || l}
                                            </Badge>
                                        ))}
                                    </div>
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
                                                <h2 className="text-2xl font-semibold mb-2 pr-20">{post.title}</h2>

                                                {post.excerpt && (
                                                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                                        {post.excerpt}
                                                    </p>
                                                )}

                                                {/* Meta Info */}
                                                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-3">
                                                    {post.created_at && (
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            <span>{formatDate(post.created_at)}</span>
                                                        </div>
                                                    )}
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
                                                                {t('moreTags', { count: post.post_tags.length - 3 })}
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
                                <CardTitle>{t('noPosts')}</CardTitle>
                                <CardDescription>
                                    {searchTag
                                        ? t('noPostsWithTag', { tag: searchTag })
                                        : t('emptyState')}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
