import { createClient } from '@/lib/supabase/server';
import { TiptapRenderer } from '@/components/blog/tiptap-renderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Locale } from '@/i18n';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }): Promise<Metadata> {
    const { locale, slug } = await params;
    const supabase = await createClient();
    const { data: item } = await supabase.from('awards').select('*, award_translations(*)').eq('slug', slug).single();

    if (!item) return { title: 'Award' };

    const t = await getTranslations({ locale, namespace: 'profile.awards' });
    const trans = item.award_translations?.find((t: any) => t.locale === locale)
        || item.award_translations?.find((t: any) => t.locale === 'ko')
        || item.award_translations?.find((t: any) => t.locale === 'en')
        || item.award_translations?.[0]
        || {};
    return {
        title: t('detailTitle', { title: trans.title || item.title }),
    };
}

export default async function AwardDetailPage({
    params,
}: {
    params: Promise<{ locale: Locale; slug: string }>;
}) {
    const { locale, slug } = await params;
    const supabase = await createClient();

    // Fetch award data
    const { data: awardData } = await supabase
        .from('awards')
        .select('*, award_translations(*)')
        .eq('slug', slug)
        .single();

    if (!awardData) {
        notFound();
    }

    const t = await getTranslations({ locale, namespace: 'profile.awards' });

    // Helper to extract localized content
    const getLocalized = (item: any) => {
        if (!item) return null;
        const translations = item.award_translations || [];
        const trans = translations.find((t: any) => t.locale === locale)
            || translations.find((t: any) => t.locale === 'ko')
            || translations.find((t: any) => t.locale === 'en')
            || translations[0]
            || {};
        return { ...item, ...trans };
    };

    const award = getLocalized(awardData);

    return (
        <div className="container max-w-4xl py-8">
            <div className="mb-6">
                <Link href={`/${locale}/profile/awards`}>
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
                                <Trophy className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                                <div>
                                    <CardTitle className="text-3xl">{award.title}</CardTitle>
                                    <p className="text-xl text-muted-foreground mt-2">{award.issuer}</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {new Date(award.date).toLocaleDateString()}
                                    </p>
                                    {award.description && (
                                        <p className="text-muted-foreground mt-3">{award.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        {award.preview_image && (
                            <div className="h-32 flex-shrink-0 border rounded-md overflow-hidden w-fit mx-auto sm:mx-0">
                                <Image
                                    src={award.preview_image}
                                    alt={award.title}
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

                {award.content && (
                    <CardContent>
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <TiptapRenderer content={award.content} />
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
