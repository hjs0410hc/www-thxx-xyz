import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';

import { DeleteProjectButton } from '@/components/admin/delete-project-button';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Projects',
};

export default async function AdminProjectsPage() {

    const supabase = await createClient();

    const { data: projects } = await supabase
        .from('projects')
        .select('*, project_translations(*)')
        .order('created_at', { ascending: false });

    return (
        <div className="container py-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Projects</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your portfolio projects
                    </p>
                </div>
                <Link href="/admin/projects/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Project
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {projects && projects.length > 0 ? (
                    projects.map((project: any) => {
                        const trans = project.project_translations?.find((t: any) => t.locale === 'ko')
                            || project.project_translations?.find((t: any) => t.locale === 'en')
                            || project.project_translations?.[0]
                            || {};

                        return (
                            <Card key={project.id}>
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-xl font-semibold">{trans.title || 'Untitled'}</h3>
                                                <Badge variant={
                                                    project.status === 'completed' ? 'default' :
                                                        project.status === 'in_progress' ? 'secondary' :
                                                            'outline'
                                                }>
                                                    {project.status === 'in_progress' && 'In Progress'}
                                                    {project.status === 'completed' && 'Completed'}
                                                    {project.status === 'discontinued' && 'Discontinued'}
                                                    {project.status === 'archived' && 'Archived'}
                                                    {project.status === 'on_hold' && 'On Hold'}
                                                    {project.status === 'planned' && 'Planned'}
                                                    {project.status === 'maintenance' && 'Maintenance'}
                                                    {project.status === 'running' && 'Running'}

                                                    {!project.status && 'Unknown'}
                                                </Badge>
                                                {project.featured && (
                                                    <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">Featured</Badge>
                                                )}
                                            </div>

                                            {trans.description && (
                                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                                    {trans.description}
                                                </p>
                                            )}

                                            {project.technologies && project.technologies.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {project.technologies.map((tech: string) => (
                                                        <Badge key={tech} variant="secondary" className="text-xs">
                                                            {tech}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <Link href={`/admin/projects/${project.id}/edit`}>
                                                <Button variant="outline" size="icon">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <DeleteProjectButton id={project.id} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>No Projects Yet</CardTitle>
                            <CardDescription>
                                Create your first project to get started.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                )}
            </div>

            <div className="mt-6">
                <Link href="/admin">
                    <Button variant="ghost">← Back to Dashboard</Button>
                </Link>
            </div>
        </div>
    );
}
