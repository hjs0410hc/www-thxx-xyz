import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Plus, Edit, Layers } from 'lucide-react';
import { DeleteSkillButton } from '@/components/admin/delete-skill-button';

export default async function AdminSkillsPage() {
    const supabase = await createClient();

    const { data: skills } = await supabase
        .from('skills')
        .select('*')
        .order('category')
        .order('display_order', { ascending: true });

    return (
        <div className="container py-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Skills</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your technical skills and stack
                    </p>
                </div>
                <Link href="/admin/skills/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Skill
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {skills && skills.length > 0 ? (
                    skills.map((skill) => (
                        <Card key={skill.id}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-xl font-semibold">{skill.title}</h3>
                                            <Badge variant="outline">{skill.category || 'Other'}</Badge>
                                            {skill.level && (
                                                <Badge variant="secondary">{skill.level}</Badge>
                                            )}
                                        </div>

                                        {skill.description && (
                                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                                {skill.description}
                                            </p>
                                        )}

                                        <div className="text-xs text-muted-foreground">
                                            Slug: {skill.slug} | Locale: {skill.locale}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Link href={`/admin/skills/${skill.id}/edit`}>
                                            <Button variant="outline" size="icon">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <DeleteSkillButton id={skill.id} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>No Skills Yet</CardTitle>
                            <CardDescription>
                                Create your first skill to get started.
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
