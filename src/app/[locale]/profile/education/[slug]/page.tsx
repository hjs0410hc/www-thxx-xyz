import { createClient } from '@/lib/supabase/server';
import { TiptapRenderer } from '@/components/blog/tiptap-renderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Locale } from '@/i18n';

export default async function EducationDetailPage({
    params,
}: {
    params: Promise<{ locale: Locale; slug: string }>;
}) {
    const { locale, slug } = await params;
    const supabase = await createClient();

    const { data: education } = await supabase
        .from('education')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!education) {
        notFound();
    }

    return (
        <div className="container max-w-4xl py-8">
            <div className="mb-6">
                <Link href={`/${locale}/profile/education`}>
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Education
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-start gap-4">
                        <GraduationCap className="h-8 w-8 text-primary mt-1" />
                        <div className="flex-1">
                            <CardTitle className="text-3xl">{education.degree} {education.field && `in ${education.field}`}</CardTitle>
                            <p className="text-xl text-muted-foreground mt-2">{education.institution}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {new Date(education.start_date).getFullYear()} - {education.end_date ? new Date(education.end_date).getFullYear() : 'Present'}
                            </p>
                            {education.description && (
                                <p className="text-muted-foreground mt-3">{education.description}</p>
                            )}
                        </div>
                    </div>
                </CardHeader>

                {education.content && (
                    <CardContent>
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <TiptapRenderer content={education.content} />
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
