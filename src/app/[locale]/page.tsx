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
        { data: recentPosts }
    ] = await Promise.all([
        supabase.from('posts')
            .select('id, title, slug, excerpt, published_at, cover_image')
            .eq('published', true)
            .eq('locale', locale)
            .order('published_at', { ascending: false })
            .limit(3)
    ]);

    return (
        <div className="flex flex-col min-h-screen">
            <HeroSection locale={locale} />
            <RecentPostsSection posts={recentPosts || []} locale={locale} />
        </div>
    );
}
