import { createClient } from '@/lib/supabase/server';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Code, Terminal, Database, Wrench, FileCode, Cloud, Box } from 'lucide-react';
import { TiptapRenderer } from '@/components/blog/tiptap-renderer';
import { SkillWithDetails } from '@/types/tech';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    const supabase = await createClient();

    const { data: skillData } = await supabase
        .from('skills')
        .select('*, skill_translations(*)')
        .eq('slug', slug)
        .single();

    if (!skillData) {
        return {};
    }

    const t = await getTranslations({ locale, namespace: 'tech' });
    const translations = skillData.skill_translations || [];
    const trans = translations.find((t: any) => t.locale === locale)
        || translations.find((t: any) => t.locale === 'ko')
        || translations.find((t: any) => t.locale === 'en')
        || translations[0]
        || {};

    const skill = { ...skillData, ...trans } as SkillWithDetails;

    return generateSEOMetadata({
        title: t('skills.detailTitle', { title: skill.title }),
        description: skill.description || skill.title,
        path: `/${locale}/tech/skill/${slug}`,
        locale,
        tags: skill.technologies || undefined,
    });
}

export default async function SkillDetailPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    const supabase = await createClient();

    const { data: skillData } = await supabase
        .from('skills')
        .select('*, skill_translations(*)')
        .eq('slug', slug)
        .single();

    if (!skillData) {
        notFound();
    }

    const t = await getTranslations({ locale, namespace: 'tech' });
    const translations = skillData.skill_translations || [];
    const trans = translations.find((t: any) => t.locale === locale)
        || translations.find((t: any) => t.locale === 'ko')
        || translations.find((t: any) => t.locale === 'en')
        || translations[0]
        || {};

    const skill = { ...skillData, ...trans } as SkillWithDetails;

    const categoryIconMap: Record<string, any> = {
        frontend: Code,
        backend: Terminal,
        database: Database,
        devops: Wrench,
        programming_language: FileCode,
        cloud: Cloud,
        other: Box,
    };

    const normalizedCategory = skill.category ? skill.category.toLowerCase() : 'other';
    const Icon = categoryIconMap[normalizedCategory] || Box;
    const isKnownCategory = ['frontend', 'backend', 'database', 'devops', 'programming_language', 'cloud', 'other'].includes(normalizedCategory);
    const displayCategory = skill.category ? (isKnownCategory ? t(`categories.${normalizedCategory}`) : skill.category) : '';

    return (
        <div className="max-w-4xl">
            {/* Back Button */}
            <Button variant="ghost" asChild className="mb-6">
                <Link href={`/${locale}/tech/skill`}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t('skills.back')}
                </Link>
            </Button>

            <div className="space-y-6">


                {/* Header */}
                <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-4xl font-bold">{skill.title}</h1>
                                {skill.category && (
                                    <div className="flex items-center gap-2 text-muted-foreground mt-1 text-lg">
                                        <Icon className="h-5 w-5" />
                                        <p>{displayCategory}</p>
                                    </div>
                                )}
                            </div>
                            {skill.level && (
                                <Badge variant="outline" className="text-sm px-3 py-1">
                                    {skill.level}
                                </Badge>
                            )}
                        </div>
                    </div>
                    {skill.cover_image && (
                        <div className="h-32 flex-shrink-0 border rounded-md overflow-hidden">
                            <Image
                                src={skill.cover_image}
                                alt={skill.title}
                                width={0}
                                height={0}
                                sizes="100vw"
                                style={{ width: 'auto', height: '100%' }}
                                className="object-cover"
                            />
                        </div>
                    )}
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
                            <CardTitle>{t('skills.relatedTechnologies')}</CardTitle>
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
