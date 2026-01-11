'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Locale } from '@/i18n';
import { User, Heart, Briefcase, GraduationCap, Users, Award, FileCheck, Trophy, Mail, Phone, MapPin, Calendar, Github, Youtube, Linkedin, AudioLines, Globe } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTranslations } from 'next-intl';

interface ProfileSidebarContentProps {
    profile: any;
    socialLinks: any[];
    locale: Locale;
    pathname: string;
    onLinkClick?: () => void;
    hideProfileInfo?: boolean;
    hideNav?: boolean;
}

export function ProfileSidebarContent({
    profile,
    socialLinks,
    locale,
    pathname,
    onLinkClick,
    hideProfileInfo = false,
    hideNav = false,
}: ProfileSidebarContentProps) {
    const t = useTranslations('profile.nav');
    const pt = useTranslations('profile');
    const ct = useTranslations('common');

    const navItems = [
        { key: 'summary', icon: User, href: '' },
        { key: 'education', icon: GraduationCap, href: '/education' },
        { key: 'work', icon: Briefcase, href: '/work' },
        { key: 'clubs', icon: Users, href: '/clubs' },
        { key: 'awards', icon: Trophy, href: '/awards' },
        { key: 'certifications', icon: FileCheck, href: '/certifications' },
        { key: 'hobbies', icon: Heart, href: '/hobbies' },
        { key: 'experiences', icon: Award, href: '/experiences' },
    ];

    return (
        <div className="flex flex-col h-full">
            {/* Profile Avatar & Info */}
            {!hideProfileInfo && (
                <>
                    <div className="flex flex-col items-center text-center pb-6 border-b">
                        <Avatar className="h-32 w-32 mb-4">
                            <AvatarImage src={profile?.profile_image_url || ''} alt={profile?.name || ''} />
                            <AvatarFallback className="text-2xl">{profile?.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <h2 className="text-2xl font-bold">{profile?.name || 'Your Name'}</h2>
                        {profile?.bio && <p className="text-sm text-muted-foreground mt-2">{profile.bio}</p>}
                    </div>

                    {/* Contact Section */}
                    <div className="space-y-3 py-6 border-b">
                        <h3 className="text-sm font-semibold text-muted-foreground">{ct('contact')}</h3>
                        {profile?.email && (
                            <div className="flex items-start gap-3">
                                <Mail className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                <div className="text-sm break-all">{profile.email}</div>
                            </div>
                        )}
                        {profile?.phone && (
                            <div className="flex items-start gap-3">
                                <Phone className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                <div className="text-sm">{profile.phone}</div>
                            </div>
                        )}
                        {profile?.nationality && (
                            <div className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                <div className="text-sm">{profile.nationality}</div>
                            </div>
                        )}
                        {profile?.birth_date && (
                            <div className="flex items-start gap-3">
                                <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                <div className="text-sm">{new Date(profile.birth_date).toLocaleDateString()}</div>
                            </div>
                        )}
                        {profile?.gender && (
                            <div className="flex items-start gap-3">
                                <User className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                <div className="text-sm">{pt(`gender.${profile.gender}`)}</div>
                            </div>
                        )}

                        {/* Social Links */}
                        {socialLinks.length > 0 && (
                            <div className="pt-2 space-y-2">
                                {socialLinks.map((link) => {
                                    const platformIcons: Record<string, any> = {
                                        'github': Github,
                                        'youtube': Youtube,
                                        'linkedin': Linkedin,
                                        'soundcloud': AudioLines,
                                    };

                                    const IconComponent = platformIcons[link.platform.toLowerCase()] || Globe;

                                    return (
                                        <Link
                                            key={link.id}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                                        >
                                            <IconComponent className="w-4 h-4 flex-shrink-0" />
                                            <span>{link.platform}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Navigation */}
            {!hideNav && (
                <nav className="flex flex-col gap-1 py-6">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const href = `/${locale}/profile${item.href}`;
                        const isActive = pathname === href;

                        return (
                            <Link
                                key={item.key}
                                href={href}
                                onClick={onLinkClick}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {t(item.key)}
                            </Link>
                        );
                    })}
                </nav>
            )}
        </div>
    );
}
