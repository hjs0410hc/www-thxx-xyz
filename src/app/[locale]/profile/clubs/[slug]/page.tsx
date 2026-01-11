
import { createClient } from '@/lib/supabase/server';
import { TiptapRenderer } from '@/components/blog/tiptap-renderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
    const { locale, slug } = await params;
    const supabase = await createClient();
    const { data: item } = await supabase
        .from('clubs')
        .select('*, club_translations(*)')
        .eq('slug', slug)
        .single();

    if (!item) return;

    const t = await getTranslations({ locale, namespace: 'profile.clubs' });
    const trans = item.club_translations?.find((t: any) => t.locale === locale)
        || item.club_translations?.find((t: any) => t.locale === 'ko')
        || item.club_translations?.find((t: any) => t.locale === 'en')
        || item.club_translations?.[0]
        || {};

    return generateSEOMetadata({
        title: t('detailTitle', { title: trans.name || item.name }),
        description: trans.description || item.description,
        path: `/ ${locale} /profile/clubs / ${slug} `,
        locale,
    });
}

export default async function ClubDetailPage({
    params,
}: {
    params: Promise<{ locale: Locale; slug: string }>;
}) {
    const { locale, slug } = await params;
    const supabase = await createClient();

    const { data: clubData } = await supabase
        .from('clubs')
        .select('*, club_translations(*)')
        .eq('slug', slug)
        .single();

    if (!clubData) {
        notFound();
    }

    const t = await getTranslations({ locale, namespace: 'profile.clubs' });

    // Helper to extract localized content
    const getLocalized = (item: any) => {
        if (!item) return null;
        const translations = item.club_translations || [];
        const trans = translations.find((t: any) => t.locale === locale)
            || translations.find((t: any) => t.locale === 'ko')
            || translations.find((t: any) => t.locale === 'en')
            || translations[0]
            || {};
        return { ...item, ...trans };
    };

    const club = getLocalized(clubData);

    return (
        <div className="container max-w-4xl py-8">
            <div className="mb-6">
                <Link href={`/${locale}/profile/clubs`}>
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {t('back')}
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-start gap-4">
                        <Users className="h-8 w-8 text-primary mt-1" />
                        <div className="flex-1">
                            <CardTitle className="text-3xl">{club.name}</CardTitle>
                            {club.role && <p className="text-xl text-muted-foreground mt-2">{club.role}</p>}
                            <p className="text-sm text-muted-foreground mt-1">
                                {new Date(club.start_date).toLocaleDateString()} - {club.end_date ? new Date(club.end_date).toLocaleDateString() : 'Present'}
                            </p>
                            {club.description && (
                                <p className="text-muted-foreground mt-3">{club.description}</p>
                            )}
                        </div>
                    </div>
                </CardHeader>

                {club.content && (
                    <CardContent>
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <TiptapRenderer content={club.content} />
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
