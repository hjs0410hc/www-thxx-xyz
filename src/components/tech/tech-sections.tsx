'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Rocket, Layers, Code, Database, Terminal, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Project, Skill } from '@/types/tech';
import Image from 'next/image';

interface TechSectionsProps {
    projects: Project[];
    skills: Skill[];
    locale: string;
}

export function TechSections({
    projects,
    skills,
    locale,
}: TechSectionsProps) {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        projects: true,
        skills: true,
    });

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const toggleAll = () => {
        const allExpanded = Object.values(expandedSections).some(v => v);
        if (allExpanded) {
            setExpandedSections({});
        } else {
            setExpandedSections({
                projects: true,
                skills: true,
            });
        }
    };

    const allExpanded = Object.values(expandedSections).some(v => v);

    const renderSectionHeader = (icon: React.ReactNode, title: string, count: number, sectionId: string, displayCount: number, link?: string) => {
        const hasMore = count > displayCount;
        const isExpanded = expandedSections[sectionId];

        return (
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        {icon}
                        {link ? (
                            <Link href={link} className="hover:underline hover:text-primary transition-colors">
                                <h2 className="text-2xl font-bold">{title}</h2>
                            </Link>
                        ) : (
                            <h2 className="text-2xl font-bold">{title}</h2>
                        )}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        {count}
                    </Badge>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSection(sectionId)}
                        className="gap-1 h-8 px-2"
                    >
                        {isExpanded ? (
                            <>
                                <ChevronUp className="h-4 w-4" />
                                <span className="text-xs">Collapse</span>
                            </>
                        ) : (
                            <>
                                <ChevronDown className="h-4 w-4" />
                                <span className="text-xs">Expand</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>
        );
    };

    // Group skills by category
    const groupedSkills = skills.reduce((acc, skill) => {
        const category = skill.category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(skill);
        return acc;
    }, {} as Record<string, Skill[]>);

    return (
        <div className="space-y-8">
            {/* Global Expand/Collapse All Button */}
            <div className="flex justify-end">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleAll}
                    className="gap-2"
                >
                    {allExpanded ? (
                        <>
                            <ChevronUp className="h-4 w-4" />
                            Collapse All
                        </>
                    ) : (
                        <>
                            <ChevronDown className="h-4 w-4" />
                            Expand All
                        </>
                    )}
                </Button>
            </div>

            {/* Projects Section */}
            {projects && projects.length > 0 && (
                <section>
                    {renderSectionHeader(
                        <Rocket className="h-5 w-5" />,
                        "Featured Projects",
                        projects.length,
                        "projects",
                        3,
                        `/${locale}/tech/project`
                    )}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {(expandedSections.projects ? projects : projects.slice(0, 3)).map((project) => (
                            <div key={project.id} className="border-l-2 border-primary pl-4 py-2 group">
                                <Link href={`/${locale}/tech/project/${project.slug}`} className="block">
                                    {project.cover_image && (
                                        <div className="relative w-full aspect-video rounded-md overflow-hidden mb-3 hidden group-hover:block transition-all">
                                            <Image
                                                src={project.cover_image}
                                                alt={project.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">{project.title}</h4>
                                </Link>
                                <p className="text-sm text-muted-foreground line-clamp-2 my-1">
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {project.technologies?.slice(0, 3).map((tech) => (
                                        <Badge key={tech} variant="outline" className="text-xs">
                                            {tech}
                                        </Badge>
                                    ))}
                                    {project.technologies && project.technologies.length > 3 && (
                                        <span className="text-xs text-muted-foreground">+{project.technologies.length - 3}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills Section */}
            {skills && skills.length > 0 && (
                <section>
                    {renderSectionHeader(
                        <Layers className="h-5 w-5" />,
                        "Skills & Stack",
                        skills.length,
                        "skills",
                        10,
                        `/${locale}/tech/skill`
                    )}

                    {expandedSections.skills ? (
                        <div className="space-y-6">
                            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                                <div key={category}>
                                    <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                                        {category === 'Frontend' && <Code className="h-3 w-3" />}
                                        {category === 'Backend' && <Terminal className="h-3 w-3" />}
                                        {category === 'Database' && <Database className="h-3 w-3" />}
                                        {category === 'DevOps' && <Wrench className="h-3 w-3" />}
                                        {category}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {categorySkills.map((skill) => (
                                            <Badge key={skill.id} variant="secondary" className="text-sm py-1.5 px-3 flex items-center gap-2">
                                                {skill.cover_image && (
                                                    <div className="relative w-4 h-4 overflow-hidden">
                                                        <Image
                                                            src={skill.cover_image}
                                                            alt={skill.title}
                                                            fill
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                )}
                                                {skill.title}
                                                {skill.level && <span className="ml-1 opacity-60 text-xs">• {skill.level}</span>}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {skills.slice(0, 10).map((skill) => (
                                <Badge key={skill.id} variant="secondary" className="text-sm py-1.5 px-3 flex items-center gap-2">
                                    {skill.cover_image && (
                                        <div className="relative w-4 h-4 overflow-hidden">
                                            <Image
                                                src={skill.cover_image}
                                                alt={skill.title}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    )}
                                    {skill.title}
                                </Badge>
                            ))}
                            {skills.length > 10 && (
                                <span className="text-sm text-muted-foreground flex items-center">
                                    +{skills.length - 10} more
                                </span>
                            )}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}
