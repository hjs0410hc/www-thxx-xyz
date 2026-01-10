import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/i18n';

export default async function AwardsPage({
    params,
}: {
    params: Promise<{ locale: Locale }>;
}) {
    const { locale } = await params;
    const supabase = await createClient();

    const { data: awardsData } = await supabase
        .from('awards')
        .select('*, award_translations(*)')
        .order('date', { ascending: false });

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

    const awards = (awardsData || []).map(getLocalized);

    const formatDate = (date: string | null) => {
        if (!date) return '';
        const d = new Date(date);
        return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Awards & Recognition</h1>
                <p className="text-muted-foreground mt-2">
                    Achievements and awards received
                </p>
            </div>

            {/* Compact Row List Pattern */}
            <div className="space-y-4">
                {awards && awards.length > 0 ? (
                    awards.map((award) => (
                        <Link key={award.id} href={`/${locale}/profile/awards/${award.slug}`}>
                            <Card className="transition-all mb-3 hover:shadow-md hover:scale-[1.01] cursor-pointer overflow-hidden">
                                <CardContent>
                                    <div className="flex gap-4 items-start">
                                        {/* Preview Image */}
                                        <div className="relative w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                                            {award.preview_image ? (
                                                <Image
                                                    src={award.preview_image}
                                                    alt={award.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full">
                                                    <Trophy className="h-8 w-8 text-muted-foreground/30" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-y-2 gap-x-4 mb-2">
                                                <div className="space-y-1">
                                                    <h3 className="text-lg font-bold leading-tight">
                                                        {award.title}
                                                    </h3>
                                                    {award.issuer && (
                                                        <p className="text-base font-medium text-muted-foreground">
                                                            {award.issuer}
                                                        </p>
                                                    )}
                                                </div>

                                                {award.date && (
                                                    <div className="flex flex-col items-start sm:items-end gap-1 flex-shrink-0">
                                                        <span className="text-sm text-foreground font-medium whitespace-nowrap">
                                                            {formatDate(award.date)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {award.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                                                    {award.description}
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
                        <CardContent className="p-6">
                            <div className="text-center py-8">
                                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No Awards Added</h3>
                                <p className="text-sm text-muted-foreground">
                                    Add your awards through the admin panel.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
