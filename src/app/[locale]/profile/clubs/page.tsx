import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import type { Locale } from '@/i18n';

export default async function ClubsPage({
    params,
}: {
    params: Promise<{ locale: Locale }>;
}) {
    const { locale } = await params;
    const supabase = await createClient();

    const { data: clubsData } = await supabase
        .from('clubs')
        .select('*, club_translations(*)').order('start_date', { ascending: false });

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

    const clubs = (clubsData || []).map(getLocalized);

    const formatDate = (date: string | null) => {
        if (!date) return 'Present';
        const d = new Date(date);
        return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Clubs & Activities</h1>
                <p className="text-muted-foreground mt-2">
                    Organizations and activities I've been involved with
                </p>
            </div>

            {/* Card List Pattern from design.md */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {clubs && clubs.length > 0 ? (
                    clubs.map((club) => (
                        <Link key={club.id} href={`/${locale}/profile/clubs/${club.slug}`}>
                            <Card className="h-full transition-all hover:shadow-lg hover:scale-105 cursor-pointer overflow-hidden pt-0">
                                {/* Preview Image */}
                                <div className="relative w-full h-48 bg-muted">
                                    {club.preview_image ? (
                                        <Image
                                            src={club.preview_image}
                                            alt={club.name}
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
                                    <CardTitle>{club.name}</CardTitle>
                                    {club.role && <p className="text-sm text-muted-foreground">{club.role}</p>}
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <Badge variant="outline">
                                            {formatDate(club.start_date)} ~ {formatDate(club.end_date)}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                {club.description && (
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground line-clamp-3">
                                            {club.description}
                                        </p>
                                    </CardContent>
                                )}
                            </Card>
                        </Link>
                    ))
                ) : (
                    <Card className="col-span-full">
                        <CardHeader>
                            <CardTitle>No Clubs & Activities Added</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Add your clubs and activities through the admin panel.
                            </p>
                        </CardHeader>
                    </Card>
                )}
            </div>
        </div>
    );
}
