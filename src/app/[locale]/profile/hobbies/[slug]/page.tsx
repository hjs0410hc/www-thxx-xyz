import { createClient } from '@/lib/supabase/server';
import { TiptapRenderer } from '@/components/blog/tiptap-renderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
    const { locale, slug } = await params;
    const supabase = await createClient();
    const { data: item } = await supabase
        .from('hobbies')
        .select('*, hobby_translations(*)')
        .eq('slug', slug)
        .single();

    if (!item) return;

    const t = await getTranslations({ locale, namespace: 'profile.hobbies' });
    const trans = item.hobby_translations?.find((t: any) => t.locale === locale)
        || item.hobby_translations?.find((t: any) => t.locale === 'ko')
        || item.hobby_translations?.find((t: any) => t.locale === 'en')
        || item.hobby_translations?.[0]
        || {};

    return generateSEOMetadata({
        title: t('detailTitle', { title: trans.name || item.name }),
        description: trans.description || item.description,
        path: `/${locale}/profile/hobbies/${slug}`,
        locale,
    });
}

export default async function HobbyDetailPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    const supabase = await createClient();

    // Fetch hobby data
    const { data: hobbyData } = await supabase
        .from('hobbies')
        .select('*, hobby_translations(*)')
        .eq('slug', slug)
        .single();

    if (!hobbyData) {
        notFound();
    }

    const t = await getTranslations({ locale, namespace: 'profile.hobbies' });

    // Helper to extract localized content
    const getLocalized = (item: any) => {
        if (!item) return null;
        const translations = item.hobby_translations || [];
        const trans = translations.find((t: any) => t.locale === locale)
            || translations.find((t: any) => t.locale === 'ko')
            || translations.find((t: any) => t.locale === 'en')
            || translations[0]
            || {};
        return { ...item, ...trans };
    };

    const hobby = getLocalized(hobbyData);

    return (
        <div className="container max-w-4xl py-8">
            {/* Breadcrumb */}
            <div className="mb-6">
                <Link href={`/${locale}/profile/hobbies`}>
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {t('back')}
                    </Button>
                </Link>
            </div>

            {/* Main Content */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                                {hobby.icon && <span className="text-4xl">{hobby.icon}</span>}
                                {!hobby.icon && <Heart className="h-8 w-8 text-primary mt-1 flex-shrink-0" />}
                                <div>
                                    <CardTitle className="text-3xl">{hobby.name}</CardTitle>
                                    {hobby.description && (
                                        <p className="text-muted-foreground mt-2">{hobby.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        {hobby.preview_image && (
                            <div className="h-32 flex-shrink-0 border rounded-md overflow-hidden w-fit mx-auto sm:mx-0">
                                <Image
                                    src={hobby.preview_image}
                                    alt={hobby.name}
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    style={{ width: 'auto', height: '100%' }}
                                    className="object-cover"
                                />
                            </div>
                        )}
                    </div>
                </CardHeader>

                {hobby.content && (
                    <CardContent>
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <TiptapRenderer content={hobby.content} />
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
