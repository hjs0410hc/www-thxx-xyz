
import { LoginForm } from '@/components/admin/login-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login',
};

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <LoginForm />
        </div>
    );
}
