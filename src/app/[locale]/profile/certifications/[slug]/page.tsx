import { createClient } from '@/lib/supabase/server';
import { TiptapRenderer } from '@/components/blog/tiptap-renderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Award } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Locale } from '@/i18n';

export default async function CertificationDetailPage({
    params,
}: {
    params: Promise<{ locale: Locale; slug: string }>;
}) {
    const { locale, slug } = await params;
    const supabase = await createClient();

    const { data: certificationData } = await supabase
        .from('certifications')
        .select('*, certification_translations(*)')
        .eq('slug', slug)
        .single();

    if (!certificationData) {
        notFound();
    }

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

    const certification = getLocalized(certificationData);

    const isExpired = certification.expiry_date && new Date(certification.expiry_date) < new Date();

    return (
        <div className="container max-w-4xl py-8">
            <div className="mb-6">
                <Link href={`/${locale}/profile/certifications`}>
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Certifications
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-start gap-4">
                        <Award className="h-8 w-8 text-primary mt-1" />
                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-3xl">{certification.name}</CardTitle>
                                    <p className="text-xl text-muted-foreground mt-2">{certification.issuer}</p>
                                </div>
                                {isExpired && (
                                    <Badge variant="destructive">Expired</Badge>
                                )}
                            </div>

                            <div className="mt-3 space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    Issued: {new Date(certification.issue_date).toLocaleDateString()}
                                </p>
                                {certification.expiry_date && (
                                    <p className="text-sm text-muted-foreground">
                                        Expires: {new Date(certification.expiry_date).toLocaleDateString()}
                                    </p>
                                )}
                            </div>

                            {certification.description && (
                                <p className="text-muted-foreground mt-4">{certification.description}</p>
                            )}
                        </div>
                    </div>
                </CardHeader>

                {certification.content && (
                    <CardContent>
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <TiptapRenderer content={certification.content} />
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
