import { createClient } from '@/lib/supabase/server';
import { HeroSection } from '@/components/home/hero-section';
import { StatsSection } from '@/components/home/stats-section';
import { RecentPostsSection } from '@/components/home/recent-posts-section';

export default async function HomePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const supabase = await createClient();

    // Parallel data fetching for posts
    const [
        { data: rawRecentPosts }
    ] = await Promise.all([
        supabase.from('posts')
            .select('*, post_translations(*)')
            .eq('published', true)
            .order('published_at', { ascending: false })
            .limit(3)
    ]);

    const recentPosts = (rawRecentPosts || []).map((p: any) => {
        const translations = p.post_translations || [];
        const trans = translations.find((t: any) => t.locale === locale)
            || translations.find((t: any) => t.locale === 'ko')
            || translations.find((t: any) => t.locale === 'en')
            || translations[0]
            || {};

        return {
            ...p,
            title: trans.title || p.title || '(No Title)',
            excerpt: trans.excerpt || p.excerpt,
        };
    });

    return (
        <div className="flex flex-col min-h-screen">
            <HeroSection locale={locale} />
            <RecentPostsSection posts={recentPosts || []} locale={locale} />
        </div>
    );
}
