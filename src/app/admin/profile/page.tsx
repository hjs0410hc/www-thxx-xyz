import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ProfileForm } from '@/components/admin/profile-form';
import { redirect } from 'next/navigation';

import { getUser } from '@/lib/actions/auth';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Profile Management',
};

export default async function AdminProfilePage() {

    const user = await getUser();

    // Redirect to login if not authenticated
    if (!user) {
        redirect('/admin/login');
    }

    const supabase = await createClient();

    // Fetch profile data
    const { data: profile } = await supabase
        .from('profiles')
        .select('*, profile_translations(*)')
        .single();

    // Fetch social links
    const { data: socialLinks } = await supabase
        .from('social_links')
        .select('*')
        .order('created_at', { ascending: true });

    // Fetch languages
    const { data: languages } = await supabase
        .from('languages')
        .select('*')
        .order('created_at', { ascending: true });

    return (
        <div className="container max-w-4xl py-8">
            <div className="mb-6">
                <Link href="/admin">
                    <Button variant="ghost">← Back to Dashboard</Button>
                </Link>
            </div>

            <ProfileForm
                profile={profile}
                socialLinks={socialLinks || []}
                languages={languages || []}
            />
        </div>
    );
}
