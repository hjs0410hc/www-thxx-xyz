import { getUser } from '@/lib/actions/auth';
import { logout } from '@/lib/actions/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User, Briefcase, FileText, LogOut, Layers } from 'lucide-react';

import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dashboard',
};

export default async function AdminDashboard() {

    const user = await getUser();

    // Redirect to login if not authenticated
    if (!user) {
        redirect('/admin/login');
    }

    const sections = [
        {
            icon: User,
            title: 'Profile',
            description: 'Manage your profile information, social links, and languages',
            href: '/admin/profile',
        },
        {
            icon: Briefcase,
            title: 'Projects',
            description: 'Create and manage your portfolio projects',
            href: '/admin/projects',
        },
        {
            icon: Layers,
            title: 'Skills',
            description: 'Manage your technical skills and tech stack',
            href: '/admin/skills',
        },
        {
            icon: FileText,
            title: 'Blog',
            description: 'Write and publish blog posts',
            href: '/admin/blog',
        },
    ];

    return (
        <div className="container py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome back, {user.email}
                    </p>
                </div>
                <form action={logout}>
                    <Button variant="outline" type="submit">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                    </Button>
                </form>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <Link key={section.href} href={section.href}>
                            <Card className="h-full transition-all hover:shadow-lg hover:scale-105">
                                <CardHeader>
                                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle>{section.title}</CardTitle>
                                    <CardDescription>{section.description}</CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
