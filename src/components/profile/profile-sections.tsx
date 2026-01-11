'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Heart, GraduationCap, Briefcase, Users, Trophy, Award, Star, Languages } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ReactCountryFlag from 'react-country-flag';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface ProfileSectionsProps {
    hobbies: any[];
    education: any[];
    workExperience: any[];
    clubs: any[];
    awards: any[];
    certifications: any[];
    experiences: any[];
    languages: any[];
}

export function ProfileSections({
    hobbies,
    education,
    workExperience,
    clubs,
    awards,
    certifications,
    experiences,
    languages,
}: ProfileSectionsProps) {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const toggleAll = () => {
        const allExpanded = Object.values(expandedSections).some(v => v);
        if (allExpanded) {
            // Collapse all
            setExpandedSections({});
        } else {
            // Expand all
            setExpandedSections({
                hobbies: true,
                education: true,
                work: true,
                clubs: true,
                awards: true,
                certifications: true,
                experiences: true,
            });
        }
    };

    const allExpanded = Object.values(expandedSections).some(v => v);

    const params = useParams();
    const locale = params.locale;
    const t = useTranslations('profile.nav');
    const ct = useTranslations('common');

    const renderSectionHeader = (icon: React.ReactNode, title: string, count: number, sectionId: string, displayCount: number, link?: string) => {
        const hasMore = count > displayCount;
        const isExpanded = expandedSections[sectionId];

        return (
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        {icon}
                        {link ? (
                            <Link href={`/${locale}${link}`} className="hover:underline hover:text-primary transition-colors">
                                <h2 className="text-2xl font-bold">{title}</h2>
                            </Link>
                        ) : (
                            <h2 className="text-2xl font-bold">{title}</h2>
                        )}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        {count}
                    </Badge>
                    {hasMore && (
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
                    )}
                </div>
            </div>
        );
    };

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

            {/* Hobbies & Interests */}
            {hobbies && hobbies.length > 0 && (
                <section>
                    {renderSectionHeader(<Heart className="h-5 w-5" />, t('hobbies'), hobbies.length, "hobbies", 5, "/profile/hobbies")}
                    <div className="flex flex-wrap gap-2">
                        {(expandedSections.hobbies ? hobbies : hobbies.slice(0, 5)).map((hobby) => (
                            <Badge key={hobby.id} variant="secondary" className="text-sm py-1.5 px-3">
                                {hobby.icon && <span className="mr-1">{hobby.icon}</span>}
                                {hobby.name}
                            </Badge>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {education && education.length > 0 && (
                <section>
                    {renderSectionHeader(<GraduationCap className="h-5 w-5" />, t('education'), education.length, "education", 3, "/profile/education")}
                    <div className="space-y-4">
                        {(expandedSections.education ? education : education.slice(0, 3)).map((edu) => (
                            <div key={edu.id} className="border-l-2 border-primary pl-4">
                                <h4 className="font-semibold">{edu.institution}</h4>
                                <p className="text-sm text-muted-foreground">{edu.degree}</p>
                                {edu.field && <p className="text-sm text-muted-foreground">{edu.field}</p>}
                                <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(edu.start_date).toISOString().slice(0, 7)} ~ {edu.end_date ? new Date(edu.end_date).toISOString().slice(0, 7) : ct('present')}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Work Experience */}
            {workExperience && workExperience.length > 0 && (
                <section>
                    {renderSectionHeader(<Briefcase className="h-5 w-5" />, t('work'), workExperience.length, "work", 3, "/profile/work")}
                    <div className="space-y-4">
                        {(expandedSections.work ? workExperience : workExperience.slice(0, 3)).map((job) => (
                            <div key={job.id} className="border-l-2 border-primary pl-4">
                                <h4 className="font-semibold">{job.position}</h4>
                                <p className="text-sm text-muted-foreground">{job.company}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(job.start_date).toISOString().slice(0, 7)} ~ {job.end_date ? new Date(job.end_date).toISOString().slice(0, 7) : ct('present')}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Clubs & Activities */}
            {clubs && clubs.length > 0 && (
                <section>
                    {renderSectionHeader(<Users className="h-5 w-5" />, t('clubs'), clubs.length, "clubs", 3, "/profile/clubs")}
                    <div className="space-y-4">
                        {(expandedSections.clubs ? clubs : clubs.slice(0, 3)).map((club) => (
                            <div key={club.id} className="border-l-2 border-primary pl-4">
                                <h4 className="font-semibold">{club.name}</h4>
                                {club.role && <p className="text-sm text-muted-foreground">{club.role}</p>}
                                <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(club.start_date).toISOString().slice(0, 7)} ~ {club.end_date ? new Date(club.end_date).toISOString().slice(0, 7) : ct('present')}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Awards */}
            {awards && awards.length > 0 && (
                <section>
                    {renderSectionHeader(<Trophy className="h-5 w-5" />, t('awards'), awards.length, "awards", 5, "/profile/awards")}
                    <div className="space-y-4">
                        {(expandedSections.awards ? awards : awards.slice(0, 5)).map((award) => (
                            <div key={award.id} className="border-l-2 border-primary pl-4">
                                <h4 className="font-semibold">{award.title}</h4>
                                <p className="text-sm text-muted-foreground">{award.issuer}</p>
                                {award.date && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {new Date(award.date).toISOString().slice(0, 7)}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
                <section>
                    {renderSectionHeader(<Award className="h-5 w-5" />, t('certifications'), certifications.length, "certifications", 3, "/profile/certifications")}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(expandedSections.certifications ? certifications : certifications.slice(0, 3)).map((cert) => (
                            <Card key={cert.id} className="p-4 gap-1">
                                <h4 className="font-semibold text-sm mb-1">{cert.name}</h4>
                                <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                                {cert.issue_date && (
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {new Date(cert.issue_date).toLocaleDateString()}
                                    </p>
                                )}
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            {/* Other Experiences */}
            {experiences && experiences.length > 0 && (
                <section>
                    {renderSectionHeader(<Star className="h-5 w-5" />, t('experiences'), experiences.length, "experiences", 3, "/profile/experiences")}
                    <div className="space-y-4">
                        {(expandedSections.experiences ? experiences : experiences.slice(0, 3)).map((exp) => (
                            <div key={exp.id} className="border-l-2 border-primary pl-4">
                                <h4 className="font-semibold">{exp.title}</h4>
                                {exp.organization && <p className="text-sm text-muted-foreground">{exp.organization}</p>}
                                {exp.date && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {new Date(exp.date).toLocaleDateString()}
                                        {exp.end_date && ` ~ ${new Date(exp.end_date).toLocaleDateString()}`}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Languages */}
            {languages && languages.length > 0 && (
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-2">
                            <Languages className="h-5 w-5" />
                            <h2 className="text-2xl font-bold">{t('languages')}</h2>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                            {languages.length}
                        </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {languages.map((lang) => (
                            <Badge key={lang.id} variant="outline" className="text-sm py-1.5 px-3 flex items-center gap-2">
                                {lang.nation && (
                                    <ReactCountryFlag
                                        countryCode={lang.nation.split('_')[1] || lang.nation.substring(0, 2)}
                                        svg
                                        style={{
                                            width: '1.2em',
                                            height: '1.2em',
                                        }}
                                        title={lang.nation}
                                    />
                                )}
                                <span>{lang.language} - {lang.proficiency_level}</span>
                            </Badge>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
