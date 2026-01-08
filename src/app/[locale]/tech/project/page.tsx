import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ExternalLink, Github } from 'lucide-react';
import { Project } from '@/types/tech';
import Image from 'next/image';

export default async function ProjectsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const supabase = await createClient();

    const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('locale', locale)
        .order('display_order')
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Projects</h1>
                <p className="text-muted-foreground mt-2">
                    Portfolio of my work and side projects
                </p>
            </div>

            {/* Card List Pattern - 3 columns on desktop */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects && projects.length > 0 ? (
                    projects.map((project: Project) => (
                        <Card key={project.id} className="h-full flex flex-col transition-all hover:shadow-lg overflow-hidden">
                            {project.cover_image && (
                                <div className="relative w-full aspect-video">
                                    <Image
                                        src={project.cover_image}
                                        alt={project.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <CardHeader>
                                <div className="flex justify-between items-start gap-2">
                                    <CardTitle className="leading-tight">
                                        <Link href={`/${locale}/tech/project/${project.slug}`} className="hover:underline">
                                            {project.title}
                                        </Link>
                                    </CardTitle>
                                    {project.status && (
                                        <Badge variant={project.status === 'completed' ? 'default' : 'secondary'} className="capitalize shrink-0">
                                            {project.status.replace('_', ' ')}
                                        </Badge>
                                    )}
                                </div>
                                {project.description && (
                                    <CardDescription className="line-clamp-3 mt-2">
                                        {project.description}
                                    </CardDescription>
                                )}
                            </CardHeader>

                            <CardContent className="flex-grow">
                                {/* Technologies */}
                                {project.technologies && project.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies.slice(0, 5).map((tech: string) => (
                                            <Badge key={tech} variant="outline" className="text-xs">
                                                {tech}
                                            </Badge>
                                        ))}
                                        {project.technologies.length > 5 && (
                                            <Badge variant="outline" className="text-xs">
                                                +{project.technologies.length - 5}
                                            </Badge>
                                        )}
                                    </div>
                                )}
                            </CardContent>

                            <CardFooter className="flex gap-2 pt-4 mt-auto">
                                {project.demo_url && (
                                    <Button variant="outline" size="sm" asChild className="flex-1">
                                        <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-4 w-4 mr-1" />
                                            Demo
                                        </a>
                                    </Button>
                                )}
                                {project.github_url && (
                                    <Button variant="outline" size="sm" asChild className="flex-1">
                                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                                            <Github className="h-4 w-4 mr-1" />
                                            Code
                                        </a>
                                    </Button>
                                )}
                                <Button variant="secondary" size="sm" asChild className="flex-1">
                                    <Link href={`/${locale}/tech/project/${project.slug}`}>
                                        Details
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <Card className="col-span-full">
                        <CardHeader>
                            <CardTitle>No Projects Yet</CardTitle>
                            <CardDescription>
                                Projects will appear here once added through the admin panel.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                )}
            </div>
        </div>
    );
}
