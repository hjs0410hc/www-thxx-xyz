import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Github } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function ProjectsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const supabase = await createClient();

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
    const t = await getTranslations({ locale, namespace: 'projects' });
    const ct = await getTranslations({ locale, namespace: 'common' });

    return (
        <div className="container py-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">{t('title')}</h1>
                <p className="text-muted-foreground mt-2">
                    {t('description')}
                </p>
            </div>

            {/* Card List Pattern - 3 columns on desktop */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects && projects.length > 0 ? (
                    projects.map((project) => (
                        <Card key={project.id} className="h-full transition-all hover:shadow-lg">
                            {/* Project Image */}
                            {project.images && project.images.length > 0 && (
                                <div className="overflow-hidden rounded-t-lg">
                                    <AspectRatio ratio={16 / 9}>
                                        <Image
                                            src={project.images[0]}
                                            alt={project.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </AspectRatio>
                                </div>
                            )}

                            <CardHeader>
                                <CardTitle>
                                    <Link href={`/${locale}/projects/${project.slug}`} className="hover:underline">
                                        {project.title}
                                    </Link>
                                </CardTitle>
                                {project.description && (
                                    <CardDescription className="line-clamp-2">
                                        {project.description}
                                    </CardDescription>
                                )}
                            </CardHeader>

                            <CardContent>
                                {/* Technologies */}
                                {project.technologies && project.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies.slice(0, 3).map((tech: string) => (
                                            <Badge key={tech} variant="secondary" className="text-xs">
                                                {tech}
                                            </Badge>
                                        ))}
                                        {project.technologies.length > 3 && (
                                            <Badge variant="secondary" className="text-xs">
                                                +{project.technologies.length - 3}
                                            </Badge>
                                        )}
                                    </div>
                                )}
                            </CardContent>

                            <CardFooter className="flex gap-2">
                                {project.demo_url && (
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-4 w-4 mr-1" />
                                            {ct('demo')}
                                        </a>
                                    </Button>
                                )}
                                {project.github_url && (
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                                            <Github className="h-4 w-4 mr-1" />
                                            {ct('code')}
                                        </a>
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <Card className="col-span-full">
                        <CardHeader>
                            <CardTitle>{t('noProjects')}</CardTitle>
                            <CardDescription>
                                {t('emptyState')}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                )}
            </div>
        </div>
    );
}
