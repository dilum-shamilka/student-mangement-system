'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { UserPlus, Mail, Lock, User, Phone, Calendar, Loader2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Role } from '@/types/auth';
import AlertBanner from '@/components/ui/AlertBanner';
import { cn } from '@/lib/utils';
import { isBlank, isFutureDate, isValidEmail, isValidPhone, minLength } from '@/lib/validation';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        dateOfBirth: '',
        role: Role.STUDENT,
    });
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const { register } = useAuth();

    const today = new Date();
    const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        .toISOString()
        .split('T')[0];

    const validate = () => {
        const nextErrors: Record<string, string> = {};

        if (isBlank(formData.firstName)) {
            nextErrors.firstName = 'First name is required.';
        } else if (!minLength(formData.firstName, 2)) {
            nextErrors.firstName = 'First name must be at least 2 characters.';
        }

        if (isBlank(formData.lastName)) {
            nextErrors.lastName = 'Last name is required.';
        } else if (!minLength(formData.lastName, 2)) {
            nextErrors.lastName = 'Last name must be at least 2 characters.';
        }

        if (isBlank(formData.email)) {
            nextErrors.email = 'Email is required.';
        } else if (!isValidEmail(formData.email)) {
            nextErrors.email = 'Enter a valid email address.';
        }

        if (isBlank(formData.password)) {
            nextErrors.password = 'Password is required.';
        } else if (!minLength(formData.password, 6)) {
            nextErrors.password = 'Password must be at least 6 characters.';
        }

        if (formData.phone.trim() !== '' && !isValidPhone(formData.phone)) {
            nextErrors.phone = 'Enter a valid phone number (9-12 digits).';
        }

        if (formData.dateOfBirth && isFutureDate(formData.dateOfBirth)) {
            nextErrors.dateOfBirth = 'Date of birth cannot be in the future.';
        }

        setFieldErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!validate()) return;
        setIsSubmitting(true);

        try {
            await register(formData);
            setIsSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please check your details and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
                <div className="w-full max-w-md">
                    <div className="bg-white/90 backdrop-blur-2xl border border-white/20 p-8 shadow-2xl rounded-3xl text-center">
                        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-inner">
                            <CheckCircle2 className="w-9 h-9 text-emerald-600" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Registration Successful!</h1>
                        <p className="text-slate-600 mb-8 leading-relaxed">
                            Your account has been created with role <span className="font-semibold text-indigo-600">{formData.role}</span>.
                            {formData.role === Role.STUDENT && ' It is currently PENDING approval by an administrator.'}
                        </p>
                        <Link href="/login" className="w-full block py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500 transition-all duration-200 text-center">
                            Go to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 py-12">
            <div className="w-full max-w-2xl">
                <div className="bg-white/90 backdrop-blur-2xl border border-white/20 p-8 md:p-10 shadow-2xl rounded-3xl">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                            <UserPlus className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h1>
                        <p className="text-slate-500 mt-1 text-center text-sm md:text-base">
                            Register as a Student or Administrator
                        </p>
                    </div>

                    {error && <div className="mb-6"><AlertBanner message={error} /></div>}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">First Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="text"
                                        name="firstName"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className={cn(
                                            'w-full pl-11 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-sm',
                                            fieldErrors.firstName && 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/30'
                                        )}
                                        placeholder="John"
                                    />
                                </div>
                                {fieldErrors.firstName && (
                                    <p className="text-xs font-medium text-rose-600 ml-1 mt-1">{fieldErrors.firstName}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Last Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="text"
                                        name="lastName"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className={cn(
                                            'w-full pl-11 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-sm',
                                            fieldErrors.lastName && 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/30'
                                        )}
                                        placeholder="Doe"
                                    />
                                </div>
                                {fieldErrors.lastName && (
                                    <p className="text-xs font-medium text-rose-600 ml-1 mt-1">{fieldErrors.lastName}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={cn(
                                        'w-full pl-11 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-sm',
                                        fieldErrors.email && 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/30'
                                    )}
                                    placeholder="name@example.com"
                                />
                            </div>
                            {fieldErrors.email && (
                                <p className="text-xs font-medium text-rose-600 ml-1 mt-1">{fieldErrors.email}</p>
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
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={cn(
                                        'w-full pl-11 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-sm',
                                        fieldErrors.password && 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/30'
                                    )}
                                    placeholder="••••••••"
                                />
                            </div>
                            {fieldErrors.password && (
                                <p className="text-xs font-medium text-rose-600 ml-1 mt-1">{fieldErrors.password}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Account Role</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <ShieldAlert className="h-5 w-5" />
                                </div>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-sm cursor-pointer"
                                >
                                    <option value={Role.ADMIN}>Admin</option>
                                    <option value={Role.STUDENT}>Student</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Phone Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={cn(
                                            'w-full pl-11 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-sm',
                                            fieldErrors.phone && 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/30'
                                        )}
                                        placeholder="+94 77 123 4567"
                                    />
                                </div>
                                {fieldErrors.phone && (
                                    <p className="text-xs font-medium text-rose-600 ml-1 mt-1">{fieldErrors.phone}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Date of Birth</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        max={maxDate}
                                        className={cn(
                                            'w-full pl-11 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-sm',
                                            fieldErrors.dateOfBirth && 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/30'
                                        )}
                                    />
                                </div>
                                {fieldErrors.dateOfBirth && (
                                    <p className="text-xs font-medium text-rose-600 ml-1 mt-1">{fieldErrors.dateOfBirth}</p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500 transition-all duration-200 flex items-center justify-center gap-2 text-base mt-6 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-200/80 text-center">
                        <p className="text-slate-600 text-sm">
                            Already have an account?{' '}
                            <Link href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}