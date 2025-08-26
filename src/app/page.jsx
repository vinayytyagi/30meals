import { LoginForm } from '@/components/auth/login-form';
import { AuthProvider } from '@/components/auth/auth-provider';

export default function LoginPage() {
  return (
    <AuthProvider>
        <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
            <LoginForm />
        </div>
        </main>
    </AuthProvider>
  );
}
