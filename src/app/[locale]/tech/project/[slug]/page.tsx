import { createClient } from '@/lib/supabase/server';
import { generateMetadata as generateSEOMetadata, generateProjectStructuredData } from '@/lib/seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
// import { AspectRatio } from '@/components/ui/aspect-ratio';
// import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink, Github, Calendar, ArrowLeft } from 'lucide-react';
import { TiptapRenderer } from '@/components/blog/tiptap-renderer';
import { Project } from '@/types/tech';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    const supabase = await createClient();

    const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .eq('locale', locale)
        .single();

    if (!project) {
        return {};
    }

    return generateSEOMetadata({
        title: project.title,
        description: project.description || project.title,
        path: `/${locale}/tech/project/${slug}`,
        locale,
        image: undefined, // Images removed
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

    const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .eq('locale', locale)
        .single();

    if (!project) {
        notFound();
    }

    const formatDate = (date: string | null) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    };

    // Generate structured data
    const structuredData = generateProjectStructuredData({
        title: project.title,
        description: project.description || project.title,
        image: undefined,
        url: project.demo_url || undefined,
    });

    return (
        <>
            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <div className="max-w-4xl">
                {/* Back Button */}
                <Button variant="ghost" asChild className="mb-6">
                    <Link href={`/${locale}/tech/project`}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Projects
                    </Link>
                </Button>

                <div className="space-y-6">
                    {/* Project Header */}
                    <div>
                        <div className="flex justify-between items-start">
                            <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
                            {project.status && (
                                <Badge variant={project.status === 'completed' ? 'default' : 'secondary'} className="capitalize">
                                    {project.status.replace('_', ' ')}
                                </Badge>
                            )}
                        </div>

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

                    {/* Brief Description */}
                    {project.description && (
                        <div className="text-lg text-muted-foreground">
                            {project.description}
                        </div>
                    )}

                    {/* Main Content (Tiptap) */}
                    {project.contents && (
                        <div className="mt-8">
                            <TiptapRenderer content={project.contents} />
                        </div>
                    )}

                    <Separator className="my-8" />

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
