'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";

export function SearchInput() {
    const t = useTranslations('common');
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [query, setQuery] = useState(searchParams.get('q') || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(() => {
            const params = new URLSearchParams(searchParams);
            if (query) {
                params.set('q', query);
            } else {
                params.delete('q');
            }
            // Reset page to 1 if we had pagination (not needed here yet but good practice)
            // Perform navigation
            router.push(`?${params.toString()}`);
        });
    };

    return (
        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
            <div className="relative w-full">
                <Input
                    type="text"
                    placeholder={t('searchPlaceholder') || "Search..."}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pr-10"
                />
            </div>
            <Button type="submit" size="icon" disabled={isPending}>
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
            </Button>
        </form>
    );
}
