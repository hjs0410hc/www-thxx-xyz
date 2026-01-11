
import { createClient } from '@/lib/supabase/server';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ExternalLink, Github } from 'lucide-react';
import { ProjectWithDetails } from '@/types/tech';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n';

export default async function ProjectsPage({
    params,
}: {
    params: Promise<{ locale: Locale }>;
}) {
    const { locale } = await params;
    const supabase = await createClient();
    const t = await getTranslations({ locale, namespace: 'tech.projects' });

    const { data: projectsData } = await supabase
        .from('projects')
        .select('*, project_translations(*)')
        .order('display_order')
        .order('created_at', { ascending: false });

    // Helper to extract localized content
    const getLocalized = (item: any) => {
        if (!item) return null;
        const translations = item.project_translations || [];
        const trans = translations.find((t: any) => t.locale === locale)
            || translations.find((t: any) => t.locale === 'ko')
            || translations.find((t: any) => t.locale === 'en')
            || translations[0]
            || {};
        return { ...item, ...trans };
    };

    const projects = (projectsData || []).map(getLocalized);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">{t('title')}</h1>
                <p className="text-muted-foreground mt-2">
                    {t('description')}
                </p>
            </div>

            {/* Full Width Card List Pattern */}
            <div className="flex flex-col gap-6">
                {projects && projects.length > 0 ? (
                    projects.map((project: ProjectWithDetails) => (
                        <Card key={project.id} className="group relative flex flex-col md:flex-row overflow-hidden transition-all hover:shadow-lg border-muted/50 p-0">
                            {/* Overlay Link */}
                            <Link
                                href={`/${locale}/tech/project/${project.slug}`}
                                className="absolute inset-0 z-0"
                            >
                                <span className="sr-only">{t('view')}</span>
                            </Link>

                            {/* Image Section - Fixed Desktop Width */}
                            {project.cover_image && (
                                <div className="relative w-full shrink-0 aspect-video md:w-64 md:aspect-[4/3] bg-muted/50">
                                    <Image
                                        src={project.cover_image}
                                        alt={project.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                            )}

                            {/* Content Section */}
                            <div className="flex flex-1 flex-col p-4 md:p-5 min-w-0">
                                <div className="flex flex-col gap-1 mb-2">
                                    <div className="flex items-start justify-between gap-4">
                                        <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors truncate">
                                            {project.title}
                                        </CardTitle>
                                        {project.status && (
                                            <Badge variant={project.status === 'completed' ? 'default' : 'secondary'} className="shrink-0 text-[10px] px-2 py-0.5 h-auto capitalize border-transparent bg-primary/10 text-primary hover:bg-primary/20">
                                                {project.status.replace('_', ' ')}
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                        <span>
                                            {project.start_date ? new Date(project.start_date).toISOString().slice(0, 7) : ''}
                                        </span>
                                        {(project.start_date || project.end_date) && <span className="text-muted-foreground/50">~</span>}
                                        <span>
                                            {project.end_date ? new Date(project.end_date).toISOString().slice(0, 7) : t('present')}
                                        </span>
                                    </div>
                                </div>

                                {project.description && (
                                    <CardDescription className="line-clamp-2 text-sm text-muted-foreground/80 mb-4">
                                        {project.description}
                                    </CardDescription>
                                )}

                                <div className="mt-auto space-y-4">
                                    {/* Technologies */}
                                    {project.technologies && project.technologies.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {project.technologies.slice(0, 10).map((tech: string) => (
                                                <Badge key={tech} variant="secondary" className="text-[10px] px-2 py-0.5 h-auto bg-muted font-normal text-muted-foreground">
                                                    {tech}
                                                </Badge>
                                            ))}
                                            {project.technologies.length > 10 && (
                                                <Badge variant="outline" className="text-[10px] px-2 py-0.5 h-auto">
                                                    +{project.technologies.length - 10}
                                                </Badge>
                                            )}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 relative z-10 pt-1 border-t border-border/50">
                                        {project.demo_url && (
                                            <Button variant="ghost" size="sm" asChild className="h-8 text-xs px-2 hover:bg-primary/5 hover:text-primary -ml-2">
                                                <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                                                    {t('preview')}
                                                </a>
                                            </Button>
                                        )}
                                        {project.github_url && (
                                            <Button variant="ghost" size="sm" asChild className="h-8 text-xs px-2 hover:bg-primary/5 hover:text-primary">
                                                <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                                                    <Github className="h-3.5 w-3.5 mr-1.5" />
                                                    {t('source')}
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <Card className="col-span-full">
                        <CardHeader>
                            <CardTitle>{t('empty')}</CardTitle>
                            <CardDescription>
                                {t('emptyDesc')}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                )}
            </div>
        </div>
    );
}
