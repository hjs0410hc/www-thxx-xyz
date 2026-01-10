import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/i18n';

export default async function EducationPage({
    params,
}: {
    params: Promise<{ locale: Locale }>;
}) {
    const { locale } = await params;
    const supabase = await createClient();

    const { data: educationData } = await supabase
        .from('education')
        .select('*, education_translations(*)')
        .order('start_date', { ascending: false });

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

    const education = (educationData || []).map(getLocalized);

    const formatDate = (date: string | null) => {
        if (!date) return 'Present';
        const d = new Date(date);
        return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Education</h1>
                <p className="text-muted-foreground mt-2">
                    My academic background and learning journey
                </p>
            </div>

            {/* Compact Row List Pattern */}
            <div className="space-y-4">
                {education && education.length > 0 ? (
                    education.map((edu) => (
                        <Link key={edu.id} href={`/${locale}/profile/education/${edu.slug}`}>
                            <Card className="transition-all mb-3 hover:shadow-md hover:scale-[1.01] cursor-pointer overflow-hidden">
                                <CardContent>
                                    <div className="flex gap-4 items-start">
                                        {/* Preview Image */}
                                        <div className="relative w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                                            {edu.preview_image ? (
                                                <Image
                                                    src={edu.preview_image}
                                                    alt={edu.institution}
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
                                                        {edu.degree} {edu.field && `in ${edu.field}`}
                                                    </h3>
                                                    <p className="text-base font-medium text-muted-foreground">
                                                        {edu.institution}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col items-start sm:items-end gap-1 flex-shrink-0">
                                                    {edu.type && (
                                                        <Badge variant="secondary" className="text-xs px-2 py-0.5 font-medium">
                                                            {edu.type === 'university' && 'University'}
                                                            {edu.type === 'study_abroad' && 'Study Abroad'}
                                                            {edu.type === 'course' && 'Course'}
                                                        </Badge>
                                                    )}
                                                    <span className="text-sm text-foreground font-medium whitespace-nowrap">
                                                        {formatDate(edu.start_date)} ~ {formatDate(edu.end_date)}
                                                    </span>
                                                </div>
                                            </div>

                                            {edu.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                                                    {edu.description}
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
                                <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No Education Added</h3>
                                <p className="text-sm text-muted-foreground">
                                    Add your education through the admin panel.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
