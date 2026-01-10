import { createClient } from '@/lib/supabase/server';
import { TiptapRenderer } from '@/components/blog/tiptap-renderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Locale } from '@/i18n';

export default async function HobbyDetailPage({
    params,
}: {
    params: Promise<{ locale: Locale; slug: string }>;
}) {
    const { locale, slug } = await params;
    const supabase = await createClient();

    const { data: hobbyData } = await supabase
        .from('hobbies')
        .select('*, hobby_translations(*)')
        .eq('slug', slug)
        .single();

    if (!hobbyData) {
        notFound();
    }

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

    const hobby = getLocalized(hobbyData);

    return (
        <div className="container max-w-4xl py-8">
            {/* Breadcrumb */}
            <div className="mb-6">
                <Link href={`/${locale}/profile/hobbies`}>
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Hobbies
                    </Button>
                </Link>
            </div>

            {/* Main Content */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        {hobby.icon && <span className="text-4xl">{hobby.icon}</span>}
                        <div>
                            <CardTitle className="text-3xl">{hobby.name}</CardTitle>
                            {hobby.description && (
                                <p className="text-muted-foreground mt-2">{hobby.description}</p>
                            )}
                        </div>
                    </div>
                </CardHeader>

                {hobby.content && (
                    <CardContent>
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <TiptapRenderer content={hobby.content} />
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
