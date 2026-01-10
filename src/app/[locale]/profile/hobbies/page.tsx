import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import type { Locale } from '@/i18n';
import { getTranslations } from 'next-intl/server';

export default async function HobbiesPage({
    params,
}: {
    params: Promise<{ locale: Locale }>;
}) {
    const { locale } = await params;
    const supabase = await createClient();
    const t = await getTranslations({ locale, namespace: 'profile.hobbies' });

    const { data: hobbiesData } = await supabase
        .from('hobbies')
        .select('*, hobby_translations(*)');

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

    const hobbies = (hobbiesData || []).map(getLocalized);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">{t('title')}</h1>
                <p className="text-muted-foreground mt-2">
                    {t('description')}
                </p>
            </div>

            {/* Card List Pattern from design.md */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {hobbies && hobbies.length > 0 ? (
                    hobbies.map((hobby) => (
                        <Link key={hobby.id} href={`/${locale}/profile/hobbies/${hobby.slug}`}>
                            <Card className="h-full transition-all hover:shadow-lg hover:scale-105 cursor-pointer overflow-hidden pt-0">
                                {/* Preview Image */}
                                <div className="relative w-full h-48 bg-muted">
                                    {hobby.preview_image ? (
                                        <Image
                                            src={hobby.preview_image}
                                            alt={hobby.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                                        </div>
                                    )}
                                </div>
                                <CardHeader>
                                    <CardTitle>{hobby.name}</CardTitle>
                                </CardHeader>
                                {hobby.description && (
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground line-clamp-3">
                                            {hobby.description}
                                        </p>
                                    </CardContent>
                                )}
                            </Card>
                        </Link>
                    ))
                ) : (
                    <Card className="col-span-full">
                        <CardHeader>
                            <CardTitle>{t('empty')}</CardTitle>
                            <CardDescription>
                                {t('emptyDesc')}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                )}
            </div>
        </div>
    );
}
