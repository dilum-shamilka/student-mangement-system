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
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
            <div className="w-full max-w-md">
                <div className="bg-white/90 backdrop-blur-2xl border border-white/20 p-8 md:p-10 shadow-2xl rounded-3xl">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                            <LogIn className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h1>
                        <p className="text-slate-500 mt-1 text-center text-sm">
                            Sign in to manage your student records and courses
                        </p>
                    </div>

                    <div className="space-y-3 mb-6">
                        {wasRegistered && (
                            <AlertBanner message="Registration successful. Please sign in." variant="success" />
                        )}
                        {requiresReauth && (
                            <AlertBanner message="Your email or password was updated. Please sign in again." variant="warning" />
                        )}
                        {error && <AlertBanner message={error} />}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
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
                                        'w-full pl-11 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-sm',
                                        fieldErrors.email && 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/30'
                                    )}
                                    placeholder="name@example.com"
                                    aria-invalid={!!fieldErrors.email}
                                    aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
                                />
                            </div>
                            {fieldErrors.email && (
                                <p id="login-email-error" className="text-xs font-medium text-rose-600 ml-1 mt-1">
                                    {fieldErrors.email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
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
                                        'w-full pl-11 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-sm',
                                        fieldErrors.password && 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/30'
                                    )}
                                    placeholder="••••••••"
                                    aria-invalid={!!fieldErrors.password}
                                    aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
                                />
                            </div>
                            {fieldErrors.password && (
                                <p id="login-password-error" className="text-xs font-medium text-rose-600 ml-1 mt-1">
                                    {fieldErrors.password}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500 transition-all duration-200 flex items-center justify-center gap-2 text-base mt-2 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-200/80 text-center">
                        <p className="text-slate-600 text-sm">
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline">
                                Register Here
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
                <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
                    <div className="bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-xl text-slate-600 font-medium">Loading login…</div>
                </div>
            }
        >
            <LoginPageContent />
        </Suspense>
    );
}