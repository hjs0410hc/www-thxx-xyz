'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowLeft, Globe } from 'lucide-react';
import { TiptapRenderer } from '@/components/blog/tiptap-renderer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BlogPostViewerProps {
    post: any; // PostWithDetails-ish, but with all translations
    locale: string;
    backLink: string;
}

export function BlogPostViewer({ post, locale: initialLocale, backLink }: BlogPostViewerProps) {
    const [currentLocale, setCurrentLocale] = useState(initialLocale);

    // Find translation for current locale
    const translations = post.post_translations || [];

    // Fallback logic: Current -> KO -> EN -> First
    const translation = translations.find((t: any) => t.locale === currentLocale)
        // If explicitly switched to a locale that doesn't exist, we might want to fallback or show empty?
        // User said "fallback is kr->en".
        // But for "switching", if user selects "English" and it doesn't exist, what happens?
        // Ideally we only show available languages in the switcher.
        || translations.find((t: any) => t.locale === 'ko')
        || translations.find((t: any) => t.locale === 'en')
        || translations[0]
        || {};

    // Available locales for switcher
    const availableLocales = Array.from(new Set(translations.map((t: any) => t.locale)));

    // If current locale is not in available, add it (though it will use fallback)?
    // Better: Helper to display locale name
    const getLocaleName = (loc: string) => {
        switch (loc) {
            case 'ko': return '한국어';
            case 'en': return 'English';
            case 'ja': return '日本語';
            default: return loc.toUpperCase();
        }
    };

    const formatDate = (date: string | null) => {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    return (
        <div className="container py-8 max-w-4xl">
            {/* Header Actions */}
            <div className="flex justify-between items-center mb-6">
                <Button variant="ghost" asChild>
                    <Link href={backLink}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Blog
                    </Link>
                </Button>

                {availableLocales.length > 1 && (
                    <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <Select value={currentLocale} onValueChange={setCurrentLocale}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Language" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableLocales.map((loc: any) => (
                                    <SelectItem key={loc} value={loc}>
                                        {getLocaleName(loc)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            <article className="space-y-6">
                {/* Cover Image */}
                {post.cover_image && (
                    <div className="overflow-hidden rounded-lg">
                        <AspectRatio ratio={16 / 9}>
                            <Image
                                src={post.cover_image}
                                alt={translation.title || post.title}
                                fill
                                className="object-cover"
                            />
                        </AspectRatio>
                    </div>
                )}

                {/* Post Header */}
                <div>
                    <h1 className="text-4xl font-bold mb-4">{translation.title || post.title}</h1>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                        {post.published_at && (
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(post.published_at)}</span>
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    {post.post_tags && post.post_tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {post.post_tags.map((tagObj: any) => (
                                <Badge key={tagObj.id} variant="secondary">
                                    {tagObj.tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                <Separator />

                {/* Post Content */}
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                    {translation.excerpt && (
                        <p className="lead text-xl text-muted-foreground font-medium italic">
                            {translation.excerpt}
                        </p>
                    )}

                    {translation.content ? (
                        <div className="mt-6">
                            <TiptapRenderer content={translation.content} />
                        </div>
                    ) : (
                        <div className="mt-6 p-8 text-center text-muted-foreground bg-muted/50 rounded-lg">
                            No translation available for this language.
                        </div>
                    )}
                </div>
            </article>
        </div>
    );
}
