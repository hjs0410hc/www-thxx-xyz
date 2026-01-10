'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import type { Locale } from '@/i18n';
import { User, Layers, Rocket, Home } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const navItems = [
    { key: 'home', icon: Home, href: '' },
    { key: 'projects', icon: Rocket, href: '/project' },
    { key: 'skills', icon: Layers, href: '/skill' },
];

interface TechSidebarProps {
    className?: string;
    onLinkClick?: () => void;
    hideProfileInfo?: boolean;
}

export function TechSidebar({ className, onLinkClick, hideProfileInfo = false }: TechSidebarProps) {
    const t = useTranslations('tech.nav');
    const params = useParams();
    const pathname = usePathname();
    const locale = params.locale as Locale;
    const [profile, setProfile] = useState<any>(null);
    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient();
            const { data: profileData } = await supabase.from('profiles').select('*, profile_translations(*)').single();
            if (profileData) {
                const translations = profileData.profile_translations || [];
                const trans = translations.find((t: any) => t.locale === locale)
                    || translations.find((t: any) => t.locale === 'ko')
                    || translations.find((t: any) => t.locale === 'en')
                    || translations[0]
                    || {};
                setProfile({ ...profileData, ...trans });
            }
        };
        fetchData();
    }, [locale]);
    const isActive = (itemHref: string) => {
        const fullHref = `/${locale}/tech${itemHref}`;
        if (itemHref === '') {
            return pathname === fullHref;
        }
        return pathname.startsWith(fullHref);
    };

    return (
        <aside className={cn("flex flex-col gap-6", className)}>
            {/* Profile Avatar & Info - Simplified for Tech Context */}
            {!hideProfileInfo && (
                <div className="flex flex-col items-center text-center pb-6 border-b">
                    <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={profile?.profile_image_url || ''} alt={profile?.name || ''} />
                        <AvatarFallback className="text-xl">{profile?.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-bold">{profile?.name || 'Your Name'}</h2>
                    {/* <p className="text-sm text-muted-foreground mt-1">Tech Portfolio</p> */}
                </div>
            )}

            {/* Navigation */}
            <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const href = `/${locale}/tech${item.href}`;

                    return (
                        <Link
                            key={item.key}
                            href={href}
                            onClick={onLinkClick}
                            className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                isActive(item.href)
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
