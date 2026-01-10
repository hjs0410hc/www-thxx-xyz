import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/i18n';

export default async function CertificationsPage({
    params,
}: {
    params: Promise<{ locale: Locale }>;
}) {
    const { locale } = await params;
    const supabase = await createClient();

    const { data: certificationsData } = await supabase
        .from('certifications')
        .select('*, certification_translations(*)')
        .order('issue_date', { ascending: false });

    // Helper to extract localized content
    const getLocalized = (item: any) => {
        if (!item) return null;
        const translations = item.certification_translations || [];
        const trans = translations.find((t: any) => t.locale === locale)
            || translations.find((t: any) => t.locale === 'ko')
            || translations.find((t: any) => t.locale === 'en')
            || translations[0]
            || {};
        return { ...item, ...trans };
    };

    const certifications = (certificationsData || []).map(getLocalized);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Certifications</h1>
                <p className="text-muted-foreground">
                    Professional certifications and licenses
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {certifications && certifications.length > 0 ? (
                    certifications.map((cert) => (
                        <Link key={cert.id} href={`/${locale}/profile/certifications/${cert.slug}`}>
                            <Card className="h-full transition-all hover:shadow-md hover:scale-[1.01] cursor-pointer overflow-hidden pt-0">
                                {/* Preview Image */}
                                <div className="relative w-full h-48 bg-muted">
                                    {cert.preview_image ? (
                                        <Image
                                            src={cert.preview_image}
                                            alt={cert.name}
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
                                    <div>
                                        <CardTitle>{cert.name}</CardTitle>
                                        <CardDescription>{cert.issuer}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col h-full justify-between gap-4">
                                        {cert.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {cert.description}
                                            </p>
                                        )}
                                        <div className="flex flex-wrap gap-2 mt-auto">
                                            <Badge variant="outline">
                                                Issued: {new Date(cert.issue_date).toLocaleDateString()}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                ) : (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            No certifications yet
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
