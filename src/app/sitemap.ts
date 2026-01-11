import { createClient } from '@/lib/supabase/server';
import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.thxx.xyz';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient();

    // Static pages
    const staticPages = [
        '',
        '/profile',
        '/profile/hobbies',
        '/profile/experiences',
        '/profile/certifications',
        '/profile/awards',
        '/profile/clubs',
        '/profile/work',
        '/tech',
        '/tech/project',
        '/tech/skill',
        '/blog',
    ];

    // Generate static pages for all locales
    const staticRoutes: MetadataRoute.Sitemap = [];
    const locales = ['ko', 'en', 'ja'];

    for (const locale of locales) {
        for (const page of staticPages) {
            staticRoutes.push({
                url: `${baseUrl}/${locale}${page}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: page === '' ? 1.0 : 0.8,
            });
        }
    }

    // Get all projects
    const { data: projects } = await supabase
        .from('projects')
        .select('slug, locale, updated_at');

    const projectRoutes: MetadataRoute.Sitemap = (projects || []).map((project) => ({
        url: `${baseUrl}/${project.locale}/tech/project/${project.slug}`,
        lastModified: new Date(project.updated_at),
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    // Get all skills
    const { data: skills } = await supabase
        .from('skills')
        .select('slug, locale, updated_at');

    const skillRoutes: MetadataRoute.Sitemap = (skills || []).map((skill) => ({
        url: `${baseUrl}/${skill.locale}/tech/skill/${skill.slug}`,
        lastModified: new Date(skill.updated_at),
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    // Get all published blog posts with translations
    const { data: posts } = await supabase
        .from('posts')
        .select('slug, updated_at, post_translations(locale)');

    const postRoutes: MetadataRoute.Sitemap = [];

    posts?.forEach((post: any) => {
        const translations = post.post_translations || [];
        translations.forEach((t: { locale: string }) => {
            postRoutes.push({
                url: `${baseUrl}/${t.locale}/blog/${post.slug}`,
                lastModified: new Date(post.updated_at),
                changeFrequency: 'monthly',
                priority: 0.6,
            });
        });
    });

    return [...staticRoutes, ...projectRoutes, ...skillRoutes, ...postRoutes];
}
