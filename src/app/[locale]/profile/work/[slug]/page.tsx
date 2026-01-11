import { createClient } from '@/lib/supabase/server';
import { TiptapRenderer } from '@/components/blog/tiptap-renderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Briefcase } from 'lucide-react';
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
        .from('work_experience')
        .select('*, work_experience_translations(*)')
        .eq('slug', slug)
        .single();

    if (!item) return;

    const t = await getTranslations({ locale, namespace: 'profile.work' });
    const trans = item.work_experience_translations?.find((t: any) => t.locale === locale)
        || item.work_experience_translations?.find((t: any) => t.locale === 'ko')
        || item.work_experience_translations?.find((t: any) => t.locale === 'en')
        || item.work_experience_translations?.[0]
        || {};

    return generateSEOMetadata({
        title: t('detailTitle', { title: trans.position || item.position }),
        description: trans.description || item.description,
        path: `/${locale}/profile/work/${slug}`,
        locale,
    });
}

export default async function WorkDetailPage({
    params,
}: {
    params: Promise<{ locale: Locale; slug: string }>;
}) {
    const { locale, slug } = await params;
    const supabase = await createClient();

    const { data: workData } = await supabase
        .from('work_experience')
        .select('*, work_experience_translations(*)')
        .eq('slug', slug)
        .single();

    if (!workData) {
        notFound();
    }

    // Helper to extract localized content
    // Helper to extract localized content
    const getLocalized = (item: any) => {
        if (!item) return null;
        const translations = item.work_experience_translations || [];
        const trans = translations.find((t: any) => t.locale === locale)
            || translations.find((t: any) => t.locale === 'ko')
            || translations.find((t: any) => t.locale === 'en')
            || translations[0]
            || {};
        return { ...item, ...trans };
    };

    const work = getLocalized(workData);
    const t = await getTranslations({ locale, namespace: 'profile.work' });

    return (
        <div className="container max-w-4xl py-8">
            <div className="mb-6">
                <Link href={`/${locale}/profile/work`}>
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {t('back')}
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-1 space-y-2">
                            <div className="flex items-start gap-4">
                                <Briefcase className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                                <div className="flex-1">
                                    <CardTitle className="text-3xl">{work.position}</CardTitle>
                                    <p className="text-xl text-muted-foreground mt-2">{work.company}</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {new Date(work.start_date).toLocaleDateString()} - {work.end_date ? new Date(work.end_date).toLocaleDateString() : 'Present'}
                                        {work.location && ` \u2022 ${work.location}`}
                                    </p>
                                    {work.description && (
                                        <p className="text-muted-foreground mt-3">{work.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        {work.preview_image && (
                            <div className="h-32 flex-shrink-0 border rounded-md overflow-hidden">
                                <Image
                                    src={work.preview_image}
                                    alt={work.position}
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

                {work.content && (
                    <CardContent>
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <TiptapRenderer content={work.content} />
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
