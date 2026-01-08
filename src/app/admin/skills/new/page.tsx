import { EditSkillForm } from '@/components/admin/edit-skill-form';

export default function NewSkillPage() {
    return (
        <div className="container py-8 max-w-4xl">
            <EditSkillForm mode="create" />
        </div>
    );
}
