import type { Metadata } from 'next';

interface SEOProps {
    title: string;
    description: string;
    path: string;
    locale?: string;
    image?: string;
    type?: 'website' | 'article';
    publishedTime?: string;
    tags?: string[];
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.thxx.xyz';

export function generateMetadata({
    title,
    description,
    path,
    locale = 'ko',
    image,
    type = 'website',
    publishedTime,
    tags,
}: SEOProps): Metadata {
    const url = `${baseUrl}${path}`;
    const ogImage = image || `${baseUrl}/og-image.jpg`;

    return {
        title,
        description,
        metadataBase: new URL(baseUrl),
        alternates: {
            canonical: url,
            languages: {
                'ko': `${baseUrl}/ko${path.replace(/^\/(ko|en|ja)/, '')}`,
                'en': `${baseUrl}/en${path.replace(/^\/(ko|en|ja)/, '')}`,
                'ja': `${baseUrl}/ja${path.replace(/^\/(ko|en|ja)/, '')}`,
            },
        },
        openGraph: {
            title,
            description,
            url,
            siteName: 'thxx.xyz',
            locale: locale === 'ko' ? 'ko_KR' : locale === 'en' ? 'en_US' : 'ja_JP',
            type,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            ...(publishedTime && type === 'article' && {
                publishedTime,
            }),
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
        },
        ...(tags && {
            keywords: tags,
        }),
    };
}

export function generatePersonStructuredData() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Your Name',
        url: baseUrl,
        sameAs: [
            // Add your social media URLs here
            'https://github.com/yourusername',
            'https://linkedin.com/in/yourusername',
        ],
        jobTitle: 'Software Engineer',
        description: 'Portfolio and blog',
    };
}

export function generateArticleStructuredData({
    title,
    description,
    publishedTime,
    image,
    tags,
}: {
    title: string;
    description: string;
    publishedTime: string;
    image?: string;
    tags?: string[];
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description,
        image: image || `${baseUrl}/og-image.jpg`,
        datePublished: publishedTime,
        author: {
            '@type': 'Person',
            name: 'Your Name',
            url: baseUrl,
        },
        publisher: {
            '@type': 'Person',
            name: 'Your Name',
            url: baseUrl,
        },
        ...(tags && {
            keywords: tags.join(', '),
        }),
    };
}

export function generateProjectStructuredData({
    title,
    description,
    image,
    url,
}: {
    title: string;
    description: string;
    image?: string;
    url?: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: title,
        description,
        image: image || `${baseUrl}/og-image.jpg`,
        ...(url && { url }),
        author: {
            '@type': 'Person',
            name: 'Your Name',
            url: baseUrl,
        },
    };
}
