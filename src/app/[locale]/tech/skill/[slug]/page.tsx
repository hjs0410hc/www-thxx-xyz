import { createClient } from '@/lib/supabase/server';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { TiptapRenderer } from '@/components/blog/tiptap-renderer';
import { Skill } from '@/types/tech';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    const supabase = await createClient();

    const { data: skill } = await supabase
        .from('skills')
        .select('*')
        .eq('slug', slug)
        .eq('locale', locale)
        .single();

    if (!skill) {
        return {};
    }

    return generateSEOMetadata({
        title: skill.title,
        description: skill.description || skill.title,
        path: `/${locale}/tech/skill/${slug}`,
        locale,
        tags: skill.technologies,
    });
}

export default async function SkillDetailPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    const supabase = await createClient();

    const { data: skill } = await supabase
        .from('skills')
        .select('*')
        .eq('slug', slug)
        .eq('locale', locale)
        .single();

    if (!skill) {
        notFound();
    }

    return (
        <div className="max-w-4xl">
            {/* Back Button */}
            <Button variant="ghost" asChild className="mb-6">
                <Link href={`/${locale}/tech/skill`}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Skills
                </Link>
            </Button>

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl font-bold">{skill.title}</h1>
                            {skill.category && (
                                <p className="text-muted-foreground mt-1 text-lg">{skill.category}</p>
                            )}
                        </div>
                        {skill.level && (
                            <Badge variant="outline" className="text-sm px-3 py-1">
                                {skill.level}
                            </Badge>
                        )}
                    </div>
                </div>

                <Separator />

                {/* Description */}
                {skill.description && (
                    <div className="text-lg text-muted-foreground">
                        {skill.description}
                    </div>
                )}

                {/* Main Content */}
                {skill.contents && (
                    <div className="mt-8">
                        <TiptapRenderer content={skill.contents} />
                    </div>
                )}

                <Separator className="my-8" />

                {/* Related Technologies/Tags */}
                {skill.technologies && skill.technologies.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Related Technologies</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {skill.technologies.map((tech: string) => (
                                    <Badge key={tech} variant="secondary">
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
