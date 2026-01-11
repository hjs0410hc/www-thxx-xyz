import { Card, CardContent } from '@/components/ui/card';
import { Code, FileText, Layers, Trophy } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface StatsSectionProps {
    stats: {
        posts: number;
        projects: number;
        skills: number;
        awards: number;
    };
}

export function StatsSection({ stats }: StatsSectionProps) {
    const t = useTranslations('home.stats');

    const items = [
        {
            label: t('posts'),
            value: stats.posts,
            icon: FileText,
            color: 'text-blue-500',
        },
        {
            label: t('projects'),
            value: stats.projects,
            icon: Layers,
            color: 'text-purple-500',
        },
        {
            label: t('skills'),
            value: stats.skills,
            icon: Code,
            color: 'text-green-500',
        },
        {
            label: t('awards'),
            value: stats.awards,
            icon: Trophy,
            color: 'text-yellow-500',
        },
    ];

    return (
        <section className="container px-4 py-8">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {items.map((item) => (
                    <Card key={item.label} className="border-none shadow-sm bg-muted/50 hover:bg-muted transition-colors">
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                            <item.icon className={`h-8 w-8 mb-3 ${item.color}`} />
                            <div className="text-3xl font-bold tracking-tight">{item.value}</div>
                            <div className="text-sm text-muted-foreground mt-1">{item.label}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
