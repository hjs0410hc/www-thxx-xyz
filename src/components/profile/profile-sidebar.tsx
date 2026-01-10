'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import type { Locale } from '@/i18n';
import { User, Heart, Briefcase, GraduationCap, Users, Award, FileCheck, Trophy, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { FaGithub, FaYoutube, FaLinkedin, FaSoundcloud } from 'react-icons/fa';

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

export function ProfileSidebar() {
    const t = useTranslations('profile.nav');
    const params = useParams();
    const pathname = usePathname();
    const locale = params.locale as Locale;
    const [profile, setProfile] = useState<any>(null);
    const [socialLinks, setSocialLinks] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient();
            const { data: profileData } = await supabase.from('profiles').select('*, profile_translations(*)').single();
            const { data: socialLinksData } = await supabase.from('social_links').select('*').order('display_order', { ascending: true });

            if (profileData) {
                const translations = profileData.profile_translations || [];
                const trans = translations.find((t: any) => t.locale === locale)
                    || translations.find((t: any) => t.locale === 'ko')
                    || translations.find((t: any) => t.locale === 'en')
                    || translations[0]
                    || {};
                setProfile({ ...profileData, ...trans });
            }

            setSocialLinks(socialLinksData || []);
        };
        fetchData();
    }, []);

    return (
        <aside className="hidden md:flex w-80 flex-col gap-6 border-r pr-8">
            {/* Profile Avatar & Info */}
            <div className="flex flex-col items-center text-center pb-6 border-b">
                <Avatar className="h-32 w-32 mb-4">
                    <AvatarImage src={profile?.profile_image_url || ''} alt={profile?.name || ''} />
                    <AvatarFallback className="text-2xl">{profile?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{profile?.name || 'Your Name'}</h2>
                {profile?.bio && <p className="text-sm text-muted-foreground mt-2">{profile.bio}</p>}
            </div>

            {/* Contact Section */}
            <div className="space-y-3 pb-6 border-b">
                <h3 className="text-sm font-semibold text-muted-foreground">CONTACT</h3>
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

                {/* Social Links */}
                {socialLinks.length > 0 && (
                    <div className="pt-2 space-y-2">
                        {socialLinks.map((link) => {
                            // Map platform names to icons
                            const platformIcons: Record<string, any> = {
                                'github': FaGithub,
                                'youtube': FaYoutube,
                                'linkedin': FaLinkedin,
                                'soundcloud': FaSoundcloud,
                            };

                            const IconComponent = platformIcons[link.platform.toLowerCase()];

                            return (
                                <Link
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                                >
                                    {IconComponent && (
                                        <IconComponent className="w-4 h-4 flex-shrink-0" />
                                    )}
                                    <span>{link.platform}</span>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const href = `/${locale}/profile${item.href}`;
                    const isActive = pathname === href;

                    return (
                        <Link
                            key={item.key}
                            href={href}
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
        </aside>
    );
}
