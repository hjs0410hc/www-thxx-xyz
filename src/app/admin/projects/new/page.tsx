'use client';

import { ProjectForm } from '@/components/admin/edit-project-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NewProjectPage() {
    return (
        <div className="container max-w-4xl py-8">
            <div className="mb-6">
                <Link href="/admin/projects">
                    <Button variant="ghost">← Back to Projects</Button>
                </Link>
            </div>

            <ProjectForm />
        </div>
    );
}
