import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import type { Locale } from '@/i18n';

export default async function HobbiesPage({
    params,
}: {
    params: Promise<{ locale: Locale }>;
}) {
    const { locale } = await params;
    const supabase = await createClient();

    const { data: hobbies } = await supabase
        .from('hobbies')
        .select('*');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Hobbies & Interests</h1>
                <p className="text-muted-foreground mt-2">
                    Things I enjoy doing in my free time
                </p>
            </div>

            {/* Card List Pattern from design.md */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {hobbies && hobbies.length > 0 ? (
                    hobbies.map((hobby) => (
                        <Link key={hobby.id} href={`/${locale}/profile/hobbies/${hobby.slug}`}>
                            <Card className="h-full transition-all hover:shadow-lg hover:scale-105 cursor-pointer overflow-hidden pt-0">
                                {/* Preview Image */}
                                <div className="relative w-full h-48 bg-muted">
                                    {hobby.preview_image ? (
                                        <Image
                                            src={hobby.preview_image}
                                            alt={hobby.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                                        </div>
                                    )}
                                </div>
                                <CardHeader>
                                    <CardTitle>{hobby.name}</CardTitle>
                                </CardHeader>
                                {hobby.description && (
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground line-clamp-3">
                                            {hobby.description}
                                        </p>
                                    </CardContent>
                                )}
                            </Card>
                        </Link>
                    ))
                ) : (
                    <Card className="col-span-full">
                        <CardHeader>
                            <CardTitle>No Hobbies Added</CardTitle>
                            <CardDescription>
                                Add your hobbies through the admin panel.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                )}
            </div>
        </div>
    );
}
