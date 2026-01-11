import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    created_at: string | null;
    cover_image: string | null;
    locales: string[];
}

interface RecentPostsSectionProps {
    posts: Post[];
    locale: string;
}

const LANGUAGE_LABELS: Record<string, string> = {
    ko: '한국어',
    en: 'English',
    ja: '日本語',
};

export function RecentPostsSection({ posts, locale }: RecentPostsSectionProps) {
    const t = useTranslations('home.recentPosts');
    const ct = useTranslations('common');

    if (!posts || posts.length === 0) return null;

    return (
        <section className="container px-4 py-8 md:py-12">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-center md:text-left">{t('title')}</h2>
                    <p className="text-muted-foreground mt-2 text-center md:text-left">{t('description')}</p>
                </div>
                <Button asChild variant="ghost">
                    <Link href={`/${locale}/blog`} className="group">
                        {t('viewAll')}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {posts.map((post) => (
                    <Link key={post.id} href={`/${locale}/blog/${post.slug}`} className="group">
                        <Card className="h-full overflow-hidden border-none shadow-md transition-all hover:shadow-xl hover:-translate-y-1 pt-0 gap-0 pb-0 relative">
                            {/* Language Badges */}
                            <div className="absolute top-3 right-3 flex gap-1 z-10">
                                {post.locales && post.locales.map((l: string) => (
                                    <Badge key={l} variant="secondary" className="text-[15px] py-0.5 px-1.5 font-normal bg-background/80 backdrop-blur-sm shadow-sm">
                                        {LANGUAGE_LABELS[l] || l}
                                    </Badge>
                                ))}
                            </div>
                            <div className="relative aspect-video w-full overflow-hidden bg-muted">
                                {post.cover_image ? (
                                    <Image
                                        src={post.cover_image}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
                                        {t('noImage')}
                                    </div>
                                )}
                            </div>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                        {post.created_at
                                            ? new Date(post.created_at).toISOString().split('T')[0]
                                            : ''}
                                    </span>
                                </div>
                                <h3 className="line-clamp-2 text-xl font-bold group-hover:text-primary transition-colors">
                                    {post.title}
                                </h3>
                                {post.excerpt && (
                                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                                        {post.excerpt}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    );
}
