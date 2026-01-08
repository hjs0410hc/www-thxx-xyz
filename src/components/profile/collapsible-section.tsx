'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import ReactCountryFlag from 'react-country-flag';

interface CollapsibleSectionProps {
    id: string;
    icon: React.ReactNode;
    title: string;
    totalCount: number;
    displayedCount: number;
    children: React.ReactNode;
    allItems: any[];
    renderItem: (item: any) => React.ReactNode;
}

export function CollapsibleSection({
    id,
    icon,
    title,
    totalCount,
    displayedCount,
    allItems,
    renderItem,
}: CollapsibleSectionProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasMore = totalCount > displayedCount;
    const itemsToShow = isExpanded ? allItems : allItems.slice(0, displayedCount);

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        {icon}
                        <h2 className="text-2xl font-bold">{title}</h2>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        {totalCount}
                    </Badge>
                    {hasMore && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="gap-1 h-8 px-2"
                        >
                            {isExpanded ? (
                                <>
                                    <ChevronUp className="h-4 w-4" />
                                    <span className="text-xs">Collapse</span>
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="h-4 w-4" />
                                    <span className="text-xs">Expand</span>
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>
            <div>
                {itemsToShow.map(renderItem)}
            </div>
        </section>
    );
}
