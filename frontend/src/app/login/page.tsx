'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import AlertBanner from '@/components/ui/AlertBanner';
import { cn } from '@/lib/utils';
import { isBlank, isValidEmail, minLength } from '@/lib/validation';

function LoginPageContent() {
    const searchParams = useSearchParams();
    const wasRegistered = searchParams.get('registered') === 'true';
    const requiresReauth = searchParams.get('reauth') === 'true';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const { login } = useAuth();

    const validate = () => {
        const nextErrors: Record<string, string> = {};

        if (isBlank(email)) {
            nextErrors.email = 'Email is required.';
        } else if (!isValidEmail(email)) {
            nextErrors.email = 'Enter a valid email address.';
        }

        if (isBlank(password)) {
            nextErrors.password = 'Password is required.';
        } else if (!minLength(password, 6)) {
            nextErrors.password = 'Password must be at least 6 characters.';
        }

        setFieldErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!validate()) return;
        setIsSubmitting(true);

        try {
            await login({ email, password });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 gradient-bg">
            <div className="w-full max-w-md">
                <div className="card glass p-8 shadow-xl">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                            <LogIn className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
                        <p className="text-slate-500 mt-2 text-center">
                            Sign in to manage your student records and courses
                        </p>
                    </div>

                    {wasRegistered && (
                        <AlertBanner message="Registration successful. Please sign in." variant="success" />
                    )}
                    {requiresReauth && (
                        <AlertBanner message="Your email or password was updated. Please sign in again." variant="warning" />
                    )}
                    {error && <AlertBanner message={error} />}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 ml-1">Email address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    autoComplete="username"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (fieldErrors.email) {
                                            setFieldErrors((prev) => ({ ...prev, email: '' }));
                                        }
                                    }}
                                    className={cn(
                                        'input-field pl-10',
                                        fieldErrors.email && 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                    )}
                                    placeholder="name@example.com"
                                    aria-invalid={!!fieldErrors.email}
                                    aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
                                />
                            </div>
                            {fieldErrors.email && (
                                <p id="login-email-error" className="text-xs text-red-600 ml-1">
                                    {fieldErrors.email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (fieldErrors.password) {
                                            setFieldErrors((prev) => ({ ...prev, password: '' }));
                                        }
                                    }}
                                    className={cn(
                                        'input-field pl-10',
                                        fieldErrors.password && 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                    )}
                                    placeholder="••••••••"
                                    aria-invalid={!!fieldErrors.password}
                                    aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
                                />
                            </div>
                            {fieldErrors.password && (
                                <p id="login-password-error" className="text-xs text-red-600 ml-1">
                                    {fieldErrors.password}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-lg"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                        <p className="text-slate-600">
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="text-primary font-semibold hover:underline">
                                Register as a Admin or Student
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center p-4 gradient-bg">
                    <div className="card glass p-8 shadow-xl text-slate-600">Loading login…</div>
                </div>
            }
        >
            <LoginPageContent />
        </Suspense>
    );
}
