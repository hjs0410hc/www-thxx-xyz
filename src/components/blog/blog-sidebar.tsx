'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchInput } from './search-input';

import { useTranslations } from 'next-intl';

interface BlogSidebarProps {
    tags: { name: string; count: number }[];
    currentTag?: string;
    locale: string;
}

export function BlogSidebar({ tags, currentTag, locale }: BlogSidebarProps) {
    const t = useTranslations('common');
    return (
        <div className="space-y-6">
            <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="px-0 pt-0">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Tag className="h-4 w-4" />
                        {t('topics')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                    <div className="mb-6 px-1">
                        <SearchInput />
                    </div>
                    <div className="flex flex-col space-y-1">
                        <Link href={`/${locale}/blog`} className="w-full">
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full justify-between font-normal hover:bg-muted/50",
                                    !currentTag ? "bg-muted font-medium text-primary" : "text-muted-foreground"
                                )}
                            >
                                <span>{t('allPosts')}</span>
                            </Button>
                        </Link>
                        {tags.map((tag) => (
                            <Link key={tag.name} href={`/${locale}/blog?tag=${encodeURIComponent(tag.name)}`} className="w-full">
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-between font-normal hover:bg-muted/50",
                                        currentTag === tag.name ? "bg-muted font-medium text-primary" : "text-muted-foreground"
                                    )}
                                >
                                    <span className="truncate mr-2 capitalize">{tag.name}</span>
                                    <Badge variant="secondary" className="ml-auto text-xs h-5 px-1.5 min-w-[1.25rem] justify-center text-muted-foreground bg-muted-foreground/10 group-hover:bg-muted-foreground/20">
                                        {tag.count}
                                    </Badge>
                                </Button>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
