import { createClient } from '@/lib/supabase/server';
import { TiptapRenderer } from '@/components/blog/tiptap-renderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Locale } from '@/i18n';

export default async function WorkDetailPage({
    params,
}: {
    params: Promise<{ locale: Locale; slug: string }>;
}) {
    const { locale, slug } = await params;
    const supabase = await createClient();

    const { data: work } = await supabase
        .from('work_experience')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!work) {
        notFound();
    }

    return (
        <div className="container max-w-4xl py-8">
            <div className="mb-6">
                <Link href={`/${locale}/profile/work`}>
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Work Experience
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-start gap-4">
                        <Briefcase className="h-8 w-8 text-primary mt-1" />
                        <div className="flex-1">
                            <CardTitle className="text-3xl">{work.position}</CardTitle>
                            <p className="text-xl text-muted-foreground mt-2">{work.company}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {new Date(work.start_date).toLocaleDateString()} - {work.end_date ? new Date(work.end_date).toLocaleDateString() : 'Present'}
                                {work.location && ` \u2022 ${work.location}`}
                            </p>
                            {work.description && (
                                <p className="text-muted-foreground mt-3">{work.description}</p>
                            )}
                        </div>
                    </div>
                </CardHeader>

                {work.content && (
                    <CardContent>
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <TiptapRenderer content={work.content} />
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
