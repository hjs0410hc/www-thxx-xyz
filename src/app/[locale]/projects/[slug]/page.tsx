import { createClient } from '@/lib/supabase/server';
import { generateMetadata as generateSEOMetadata, generateProjectStructuredData } from '@/lib/seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink, Github, Calendar, ArrowLeft } from 'lucide-react';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    const supabase = await createClient();

    const { data: projectData } = await supabase
        .from('projects')
        .select('*, project_translations(*)')
        .eq('slug', slug)
        .single();

    if (!projectData) {
        return {};
    }

    const translations = projectData.project_translations || [];
    const project = {
        ...projectData,
        ...(translations.find((t: any) => t.locale === locale)
            || translations.find((t: any) => t.locale === 'ko')
            || translations.find((t: any) => t.locale === 'en')
            || translations[0]
            || {})
    };

    return generateSEOMetadata({
        title: project.title,
        description: project.description || project.title,
        path: `/${locale}/projects/${slug}`,
        locale,
        image: project.images?.[0] || undefined,
        tags: project.technologies,
    });
}

export default async function ProjectDetailPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    const supabase = await createClient();

    const { data: projectData } = await supabase
        .from('projects')
        .select('*, project_translations(*)')
        .eq('slug', slug)
        .single();

    if (!projectData) {
        notFound();
    }

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

    const project = getLocalized(projectData);

    const formatDate = (date: string | null) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    };

    // Generate structured data
    const structuredData = generateProjectStructuredData({
        title: project.title,
        description: project.description || project.title,
        image: project.images?.[0],
        url: project.demo_url || undefined,
    });

    return (
        <>
            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <div className="container py-8 max-w-4xl">
                {/* Back Button */}
                <Button variant="ghost" asChild className="mb-6">
                    <Link href={`/${locale}/projects`}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Projects
                    </Link>
                </Button>

                <div className="space-y-6">
                    {/* Project Header */}
                    <div>
                        <h1 className="text-4xl font-bold mb-4">{project.title}</h1>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                            {(project.start_date || project.end_date) && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                        {formatDate(project.start_date)}
                                        {project.end_date && ` - ${formatDate(project.end_date)}`}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            {project.demo_url && (
                                <Button asChild>
                                    <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        View Demo
                                    </a>
                                </Button>
                            )}
                            {project.github_url && (
                                <Button variant="outline" asChild>
                                    <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                                        <Github className="h-4 w-4 mr-2" />
                                        View Code
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Project Images */}
                    {project.images && project.images.length > 0 && (
                        <div className="space-y-4">
                            {project.images.map((image: string, index: number) => (
                                <div key={index} className="overflow-hidden rounded-lg">
                                    <AspectRatio ratio={16 / 9}>
                                        <Image
                                            src={image}
                                            alt={`${project.title} - Image ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </AspectRatio>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Description */}
                    {project.description && (
                        <Card>
                            <CardHeader>
                                <CardTitle>About This Project</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground whitespace-pre-line">
                                    {project.description}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Technologies */}
                    {project.technologies && project.technologies.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Technologies Used</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {project.technologies.map((tech: string) => (
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
        </>
    );
}
