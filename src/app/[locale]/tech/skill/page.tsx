import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skill, SkillWithDetails } from '@/types/tech';
import Image from 'next/image';

export default async function SkillsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const supabase = await createClient();

    const { data: skillsData } = await supabase
        .from('skills')
        .select(`
            *,
            skill_translations (*)
        `)
        .order('display_order')
        .order('created_at', { ascending: false });

    // Helper to extract localized content
    const getLocalized = (item: any) => {
        if (!item) return null;
        const translations = item.skill_translations || [];
        const trans = translations.find((t: any) => t.locale === locale)
            || translations.find((t: any) => t.locale === 'ko')
            || translations.find((t: any) => t.locale === 'en')
            || translations[0]
            || {};
        return { ...item, ...trans };
    };

    const skills = (skillsData || []).map(getLocalized) as SkillWithDetails[];

    // Group skills by category
    const groupedSkills = (skills || []).reduce((acc: Record<string, SkillWithDetails[]>, skill: SkillWithDetails) => {
        const category = skill.category || 'Other';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(skill);
        return acc;
    }, {});

    const categories = Object.keys(groupedSkills).sort();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Skills & Tech Stack</h1>
                <p className="text-muted-foreground mt-2">
                    Technologies, tools, and methodologies I work with
                </p>
            </div>

            {categories.length > 0 ? (
                categories.map((category) => (
                    <div key={category} className="space-y-4">
                        <h2 className="text-2xl font-semibold capitalize">{category}</h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {groupedSkills[category].map((skill: SkillWithDetails) => (
                                <Link key={skill.id} href={`/${locale}/tech/skill/${skill.slug}`} className="block h-full">
                                    <Card className="h-full flex flex-col hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer overflow-hidden gap-1">
                                        <CardHeader className="pb-3 flex flex-row items-center gap-4 space-y-0">
                                            {skill.cover_image && (
                                                <div className="relative h-12 w-12 shrink-0 rounded-md overflow-hidden bg-muted">
                                                    <Image
                                                        src={skill.cover_image}
                                                        alt={skill.title}
                                                        fill
                                                        className="object-contain p-2"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start gap-2">
                                                    <CardTitle className="text-lg truncate">
                                                        {skill.title}
                                                    </CardTitle>
                                                    {skill.level && (
                                                        <Badge variant="outline" className="text-xs shrink-0">
                                                            {skill.level}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-grow pt-0">
                                            {skill.description && (
                                                <CardDescription className="line-clamp-2 mb-3">
                                                    {skill.description}
                                                </CardDescription>
                                            )}
                                            {skill.technologies && skill.technologies.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {skill.technologies.slice(0, 3).map((t) => (
                                                        <Badge key={t} variant="secondary" className="text-[10px] px-1.5 h-5">
                                                            {t}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>No Skills Added</CardTitle>
                        <CardDescription>
                            Skills will appear here once added through the admin panel.
                        </CardDescription>
                    </CardHeader>
                </Card>
            )}
        </div>
    );
}
