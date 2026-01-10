'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Rocket, Layers, Code, Database, Terminal, Wrench, FileCode, Cloud, Box } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ProjectWithDetails, SkillWithDetails } from '@/types/tech';
import Image from 'next/image';

import { useTranslations } from 'next-intl';

interface TechSectionsProps {
    projects: ProjectWithDetails[];
    skills: SkillWithDetails[];
    locale: string;
}

export function TechSections({
    projects,
    skills,
    locale,
}: TechSectionsProps) {
    const t = useTranslations('tech');
    const ct = useTranslations('common');

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
                                <span className="text-xs">{ct('collapse')}</span>
                            </>
                        ) : (
                            <>
                                <ChevronDown className="h-4 w-4" />
                                <span className="text-xs">{ct('expand')}</span>
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
    }, {} as Record<string, SkillWithDetails[]>);

    return (
        <div className="space-y-8">
            {/* Global Expand/Collapse All Button */}
            <div className="flex justify-start">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleAll}
                    className="gap-2"
                >
                    {allExpanded ? (
                        <>
                            <ChevronUp className="h-4 w-4" />
                            {ct('collapseAll')}
                        </>
                    ) : (
                        <>
                            <ChevronDown className="h-4 w-4" />
                            {ct('expandAll')}
                        </>
                    )}
                </Button>
            </div>

            {/* Projects Section */}
            {projects && projects.length > 0 && (
                <section>
                    {renderSectionHeader(
                        <Rocket className="h-5 w-5" />,
                        t('sections.projects'),
                        projects.length,
                        "projects",
                        3,
                        `/${locale}/tech/project`
                    )}
                    <div className="flex flex-col gap-4">
                        {(expandedSections.projects ? projects : projects.slice(0, 3)).map((project) => (
                            <div key={project.id} className="border-l-2 border-primary pl-4 py-2 group">
                                <div className="flex gap-4 items-center">
                                    {project.cover_image && (
                                        <Link href={`/${locale}/tech/project/${project.slug}`} className="relative w-28 shrink-0 aspect-square rounded-md overflow-hidden block transition-all hover:opacity-90">
                                            <Image
                                                src={project.cover_image}
                                                alt={project.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </Link>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between gap-4 mb-1">
                                            <Link href={`/${locale}/tech/project/${project.slug}`} className="block">
                                                <h4 className="font-semibold text-base group-hover:text-primary transition-colors leading-tight">{project.title}</h4>
                                            </Link>
                                            <div className="text-right shrink-0 flex flex-col items-end gap-1">
                                                {project.status && (
                                                    <Badge variant={project.status === 'completed' ? 'default' : 'secondary'} className="text-xs px-2 py-0.5 h-5 capitalize border-transparent">
                                                        {project.status.replace('_', ' ')}
                                                    </Badge>
                                                )}
                                                <div className="text-xs text-muted-foreground font-medium">
                                                    {project.start_date ? new Date(project.start_date).toISOString().slice(0, 7).replace('-', '.') : ''}
                                                    {(project.start_date || project.end_date) && ' - '}
                                                    {project.end_date ? new Date(project.end_date).toISOString().slice(0, 7).replace('-', '.') : ct('present')}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                            {project.description}
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            {project.technologies?.slice(0, 3).map((tech) => (
                                                <Badge key={tech} variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                                                    {tech}
                                                </Badge>
                                            ))}
                                            {project.technologies && project.technologies.length > 3 && (
                                                <span className="text-[10px] text-muted-foreground flex items-center">+{project.technologies.length - 3}</span>
                                            )}
                                        </div>
                                    </div>
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
                        t('sections.skills'),
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
                                        {category.toLowerCase() === 'frontend' && <Code className="h-3 w-3" />}
                                        {category.toLowerCase() === 'backend' && <Terminal className="h-3 w-3" />}
                                        {category.toLowerCase() === 'database' && <Database className="h-3 w-3" />}
                                        {category.toLowerCase() === 'devops' && <Wrench className="h-3 w-3" />}
                                        {category.toLowerCase() === 'programming_language' && <FileCode className="h-3 w-3" />}
                                        {category.toLowerCase() === 'cloud' && <Cloud className="h-3 w-3" />}
                                        {category.toLowerCase() === 'other' && <Box className="h-3 w-3" />}
                                        {['frontend', 'backend', 'database', 'devops', 'programming_language', 'cloud', 'other'].includes(category.toLowerCase())
                                            ? t(`categories.${category.toLowerCase()}`, { defaultMessage: category })
                                            : category}
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
