
import { createClient } from '@/lib/supabase/server';
import { TiptapRenderer } from '@/components/blog/tiptap-renderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Locale } from '@/i18n';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }): Promise<Metadata> {
    const { locale, slug } = await params;
    const supabase = await createClient();
    const { data: item } = await supabase.from('experiences').select('*, experience_translations(*)').eq('slug', slug).single();

    if (!item) return { title: 'Experience' };

    const t = await getTranslations({ locale, namespace: 'profile.experiences' });
    const trans = item.experience_translations?.find((t: any) => t.locale === locale)
        || item.experience_translations?.find((t: any) => t.locale === 'ko')
        || item.experience_translations?.find((t: any) => t.locale === 'en')
        || item.experience_translations?.[0]
        || {};
    return {
        title: t('detailTitle', { title: trans.title || item.title }),
    };
}

export default async function ExperienceDetailPage({
    params,
}: {
    params: Promise<{ locale: Locale; slug: string }>;
}) {
    const { locale, slug } = await params;
    const supabase = await createClient();

    const { data: experienceData } = await supabase
        .from('experiences')
        .select('*, experience_translations(*)')
        .eq('slug', slug)
        .single();

    if (!experienceData) {
        notFound();
    }

    const t = await getTranslations({ locale, namespace: 'profile.experiences' });

    // Helper to extract localized content
    const getLocalized = (item: any) => {
        if (!item) return null;
        const translations = item.experience_translations || [];
        const trans = translations.find((t: any) => t.locale === locale)
            || translations.find((t: any) => t.locale === 'ko')
            || translations.find((t: any) => t.locale === 'en')
            || translations[0]
            || {};
        return { ...item, ...trans };
    };

    const experience = getLocalized(experienceData);

    return (
        <div className="container max-w-4xl py-8">
            <div className="mb-6">
                <Link href={`/${locale}/profile/experiences`}>
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
                                <Star className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                                <div>
                                    <CardTitle className="text-3xl">{experience.title}</CardTitle>
                                    {experience.organization && (
                                        <p className="text-xl text-muted-foreground mt-2">{experience.organization}</p>
                                    )}
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {new Date(experience.date).toLocaleDateString()}
                                        {experience.end_date && ` ~ ${new Date(experience.end_date).toLocaleDateString()}`}
                                    </p>
                                    {experience.description && (
                                        <p className="text-muted-foreground mt-3">{experience.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        {experience.preview_image && (
                            <div className="h-32 flex-shrink-0 border rounded-md overflow-hidden">
                                <Image
                                    src={experience.preview_image}
                                    alt={experience.title}
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

                {experience.content && (
                    <CardContent>
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <TiptapRenderer content={experience.content} />
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
