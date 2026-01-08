'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    User,
    Heart,
    GraduationCap,
    Briefcase,
    Users,
    Star,
    Award,
    Trophy,
} from 'lucide-react';

const profileSections = [
    { href: '/admin/profile', label: 'Basic Info', icon: User },
    { href: '/admin/profile/hobbies', label: 'Hobbies', icon: Heart },
    { href: '/admin/profile/education', label: 'Education', icon: GraduationCap },
    { href: '/admin/profile/work', label: 'Work Experience', icon: Briefcase },
    { href: '/admin/profile/clubs', label: 'Clubs & Activities', icon: Users },
    { href: '/admin/profile/experiences-admin', label: 'Experiences', icon: Star },
    { href: '/admin/profile/certifications-admin', label: 'Certifications', icon: Award },
    { href: '/admin/profile/awards-admin', label: 'Awards', icon: Trophy },
];

export function AdminProfileSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r bg-muted/10 p-4">
            <nav className="space-y-1">
                {profileSections.map((section) => {
                    const Icon = section.icon;
                    const isActive = pathname === section.href;

                    return (
                        <Link
                            key={section.href}
                            href={section.href}
                            className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                                isActive
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted'
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {section.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
