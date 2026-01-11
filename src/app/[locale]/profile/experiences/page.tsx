import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import Link from 'next/link';
import type { Locale } from '@/i18n';
import { getTranslations } from 'next-intl/server';

export default async function ExperiencesPage({
    params,
}: {
    params: Promise<{ locale: Locale }>;
}) {
    const { locale } = await params;
    const supabase = await createClient();
    const t = await getTranslations({ locale, namespace: 'profile.experiences' });

    const { data: experiencesData } = await supabase
        .from('experiences')
        .select('*, experience_translations(*)')
        .order('date', { ascending: false });

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

    const experiences = (experiencesData || []).map(getLocalized);

    const formatDate = (date: string | null) => {
        if (!date) return '';
        const d = new Date(date);
        return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">{t('title')}</h1>
                <p className="text-muted-foreground mt-2">
                    {t('description')}
                </p>
            </div>

            {/* Compact Row List Pattern */}
            <div className="space-y-4">
                {experiences && experiences.length > 0 ? (
                    experiences.map((exp) => (
                        <Link key={exp.id} href={`/${locale}/profile/experiences/${exp.slug}`}>
                            <Card className="transition-all mb-3 hover:shadow-md hover:scale-[1.01] cursor-pointer overflow-hidden">
                                <CardContent>
                                    <div className="flex gap-4 items-start">
                                        {/* Preview Image */}
                                        <div className="relative w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                                            {exp.preview_image ? (
                                                <Image
                                                    src={exp.preview_image}
                                                    alt={exp.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full">
                                                    <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-y-2 gap-x-4 mb-2">
                                                <div className="space-y-1">
                                                    <h3 className="text-lg font-bold leading-tight">
                                                        {exp.title}
                                                    </h3>
                                                    {exp.organization && (
                                                        <p className="text-base font-medium text-muted-foreground">
                                                            {exp.organization}
                                                        </p>
                                                    )}
                                                </div>

                                                {exp.date && (
                                                    <div className="flex flex-col items-start sm:items-end gap-1 flex-shrink-0">
                                                        <span className="text-sm text-foreground font-medium whitespace-nowrap">
                                                            {formatDate(exp.date)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {exp.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                                                    {exp.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                ) : (
                    <Card>
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
