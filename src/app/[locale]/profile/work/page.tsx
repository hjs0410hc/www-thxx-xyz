import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/i18n';

export default async function WorkPage({
    params,
}: {
    params: Promise<{ locale: Locale }>;
}) {
    const { locale } = await params;
    const supabase = await createClient();

    const { data: workData } = await supabase
        .from('work_experience')
        .select('*, work_experience_translations(*)').order('start_date', { ascending: false });

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

    const workExperience = (workData || []).map(getLocalized);

    const formatDate = (date: string | null) => {
        if (!date) return 'Present';
        const d = new Date(date);
        return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Work Experience</h1>
                <p className="text-muted-foreground mt-2">
                    My professional journey and career history
                </p>
            </div>

            {/* Compact Row List Pattern */}
            <div className="space-y-4">
                {workExperience && workExperience.length > 0 ? (
                    workExperience.map((work) => (
                        <Link key={work.id} href={`/${locale}/profile/work/${work.slug}`}>
                            <Card className="transition-all mb-3 hover:shadow-md hover:scale-[1.01] cursor-pointer overflow-hidden">
                                <CardContent>
                                    <div className="flex gap-4 items-start">
                                        {/* Preview Image */}
                                        <div className="relative w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                                            {work.preview_image ? (
                                                <Image
                                                    src={work.preview_image}
                                                    alt={work.position}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full">
                                                    <Briefcase className="h-8 w-8 text-muted-foreground/30" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-y-2 gap-x-4 mb-2">
                                                <div className="space-y-1">
                                                    <h3 className="text-lg font-bold leading-tight">
                                                        {work.position}
                                                    </h3>
                                                    <p className="text-base font-medium text-muted-foreground">
                                                        {work.company}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col items-start sm:items-end gap-1 flex-shrink-0">
                                                    {work.type && (
                                                        <Badge variant="secondary" className="text-xs px-2 py-0.5 font-medium">
                                                            {work.type === 'internship' && 'Internship'}
                                                            {work.type === 'part_time' && 'Part-time'}
                                                            {work.type === 'full_time' && 'Full-time'}
                                                            {work.type === 'military_service' && 'Military Service'}
                                                        </Badge>
                                                    )}
                                                    <span className="text-sm text-foreground font-medium whitespace-nowrap">
                                                        {formatDate(work.start_date)} ~ {formatDate(work.end_date)}
                                                    </span>
                                                </div>
                                            </div>

                                            {work.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                                                    {work.description}
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
                                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No Work Experience Added</h3>
                                <p className="text-sm text-muted-foreground">
                                    Add your work experience through the admin panel.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
