'use client';

import { deleteSkill } from '@/lib/actions/skills';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

export function DeleteSkillButton({ id }: { id: string }) {
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        if (!confirm('Are you sure you want to delete this skill?')) {
            return;
        }

        setLoading(true);
        await deleteSkill(id);
    }

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={handleDelete}
            disabled={loading}
        >
            <Trash2 className="h-4 w-4" />
        </Button>
    );
}
