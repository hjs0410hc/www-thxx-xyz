import { createClient } from '@/lib/supabase/server';
import { generateMetadata as generateSEOMetadata, generateArticleStructuredData } from '@/lib/seo';
import { notFound } from 'next/navigation';
import { BlogPostViewer } from '@/components/blog/blog-post-viewer';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    const supabase = await createClient();

    const { data: post } = await supabase
        .from('posts')
        .select('*, post_translations(*)')
        .eq('slug', slug)
        .single();

    if (!post) {
        return {};
    }

    const t = await getTranslations({ locale, namespace: 'blog' });
    const translations = post.post_translations || [];
    const trans = translations.find((t: any) => t.locale === locale)
        || translations.find((t: any) => t.locale === 'ko')
        || translations.find((t: any) => t.locale === 'en')
        || translations[0]
        || {};

    return generateSEOMetadata({
        title: t('postTitle', { title: trans.title || post.title }),
        description: trans.excerpt || trans.title || post.title,
        path: `/${locale}/blog/${slug}`,
        locale,
        image: post.cover_image || undefined,
        type: 'article',
        publishedTime: post.created_at,
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
        .select('*, post_tags(*), post_translations(*)')
        .eq('slug', slug)

        .single();

    if (!post) {
        notFound();
    }

    // Generate structured data
    // Use fallback translation for structured data? Or current locale
    // Ideally current locale.
    const translations = post.post_translations || [];
    const trans = translations.find((t: any) => t.locale === locale) || {};

    const structuredData = generateArticleStructuredData({
        title: trans.title || post.title,
        description: trans.excerpt || trans.title,
        publishedTime: post.created_at,
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

            <BlogPostViewer
                post={post}
                locale={locale}
                backLink={`/${locale}/blog`}
            />
        </>
    );
}
