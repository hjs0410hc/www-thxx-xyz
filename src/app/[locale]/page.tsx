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
            .order('created_at', { ascending: false })
            .limit(3)
    ]);

    const recentPosts = (rawRecentPosts || []).map((p: any) => {
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
            locales,
        };
    });

    return (
        <div className="flex flex-col min-h-screen">
            <HeroSection locale={locale} />
            <RecentPostsSection posts={recentPosts || []} locale={locale} />
        </div>
    );
}
