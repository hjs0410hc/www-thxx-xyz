import { createClient } from '@/lib/supabase/server';
import { TiptapRenderer } from '@/components/blog/tiptap-renderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Locale } from '@/i18n';

export default async function AwardDetailPage({
    params,
}: {
    params: Promise<{ locale: Locale; slug: string }>;
}) {
    const { locale, slug } = await params;
    const supabase = await createClient();

    const { data: award } = await supabase
        .from('awards')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!award) {
        notFound();
    }

    return (
        <div className="container max-w-4xl py-8">
            <div className="mb-6">
                <Link href={`/${locale}/profile/awards`}>
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Awards
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-start gap-4">
                        <Trophy className="h-8 w-8 text-primary mt-1" />
                        <div className="flex-1">
                            <CardTitle className="text-3xl">{award.title}</CardTitle>
                            <p className="text-xl text-muted-foreground mt-2">{award.issuer}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {new Date(award.date).toLocaleDateString()}
                            </p>
                            {award.description && (
                                <p className="text-muted-foreground mt-3">{award.description}</p>
                            )}
                        </div>
                    </div>
                </CardHeader>

                {award.content && (
                    <CardContent>
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <TiptapRenderer content={award.content} />
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
