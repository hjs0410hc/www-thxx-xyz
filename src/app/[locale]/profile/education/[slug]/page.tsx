
import { createClient } from '@/lib/supabase/server';
import { TiptapRenderer } from '@/components/blog/tiptap-renderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
    const { locale, slug } = await params;
    const supabase = await createClient();
    const { data: item } = await supabase
        .from('education')
        .select('*, education_translations(*)')
        .eq('slug', slug)
        .single();

    if (!item) return;

    const t = await getTranslations({ locale, namespace: 'profile.education' });
    const trans = item.education_translations?.find((t: any) => t.locale === locale)
        || item.education_translations?.find((t: any) => t.locale === 'ko')
        || item.education_translations?.find((t: any) => t.locale === 'en')
        || item.education_translations?.[0]
        || {};

    return generateSEOMetadata({
        title: t('detailTitle', { title: trans.institution || item.institution }),
        description: trans.description || item.description,
        path: `/ ${locale} /profile/education / ${slug} `,
        locale,
    });
}

export default async function EducationDetailPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    const supabase = await createClient();

    // Fetch education data
    const { data: educationData } = await supabase
        .from('education')
        .select('*, education_translations(*)')
        .eq('slug', slug)
        .single();

    if (!educationData) {
        notFound();
    }

    const t = await getTranslations({ locale, namespace: 'profile.education' });

    // Helper to extract localized content
    const getLocalized = (item: any) => {
        if (!item) return null;
        const translations = item.education_translations || [];
        const trans = translations.find((t: any) => t.locale === locale)
            || translations.find((t: any) => t.locale === 'ko')
            || translations.find((t: any) => t.locale === 'en')
            || translations[0]
            || {};
        return { ...item, ...trans };
    };

    const education = getLocalized(educationData);

    return (
        <div className="container max-w-4xl py-8">
            <div className="mb-6">
                <Link href={`/${locale}/profile/education`}>
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
                                <GraduationCap className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <CardTitle className="text-3xl">{education.institution}</CardTitle>
                                        {education.type && (
                                            <Badge variant="secondary">
                                                {t(education.type)}
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="mt-2 text-xl text-muted-foreground">
                                        <p>{education.degree}</p>
                                        {education.field && <p>{education.field}</p>}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {new Date(education.start_date).toISOString().split('T')[0]} ~ {education.end_date ? new Date(education.end_date).toISOString().split('T')[0] : 'Present'}
                                    </p>
                                    {education.description && (
                                        <p className="text-muted-foreground mt-3">{education.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        {education.preview_image && (
                            <div className="h-32 flex-shrink-0 border rounded-md overflow-hidden">
                                <Image
                                    src={education.preview_image}
                                    alt={education.institution}
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

                {education.content && (
                    <CardContent>
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <TiptapRenderer content={education.content} />
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
