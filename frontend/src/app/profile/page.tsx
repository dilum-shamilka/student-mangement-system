'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import AlertBanner from '@/components/ui/AlertBanner';
import { UserProfileResponse, UserProfileUpdateRequest } from '@/types/profile';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { isBlank, isFutureDate, isValidEmail, isValidPhone, minLength } from '@/lib/validation';

export default function ProfilePage() {
    const { updateUser, logout } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        dateOfBirth: '',
    });
    const [originalEmail, setOriginalEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const today = new Date();
    const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        .toISOString()
        .split('T')[0];

    const hasSensitiveChange =
        (originalEmail !== '' && formData.email.trim() !== originalEmail) || formData.password.trim() !== '';

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setError(null);
                const response = await api.get<UserProfileResponse>('/users/me');
                const profile = response.data;
                setOriginalEmail(profile.email || '');
                setFormData({
                    firstName: profile.firstName || '',
                    lastName: profile.lastName || '',
                    email: profile.email || '',
                    password: '',
                    phone: profile.phone || '',
                    dateOfBirth: profile.dateOfBirth || '',
                });
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load profile. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

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

        if (formData.password.trim() !== '' && !minLength(formData.password, 6)) {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'dateOfBirth' && value && value > maxDate) {
            setFieldErrors((prev) => ({ ...prev, dateOfBirth: 'Date of birth cannot be in the future.' }));
            return;
        }
        setFormData({ ...formData, [name]: value });
        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (!validate()) return;
        setSaving(true);

        try {
            const payload: UserProfileUpdateRequest = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone.trim() === '' ? null : formData.phone,
                dateOfBirth: formData.dateOfBirth === '' ? null : formData.dateOfBirth,
            };

            if (formData.password.trim() !== '') {
                payload.password = formData.password;
            }

            const response = await api.put<UserProfileResponse>('/users/me', payload);
            const updated = response.data;

            setFormData({
                firstName: updated.firstName || '',
                lastName: updated.lastName || '',
                email: updated.email || '',
                password: '',
                phone: updated.phone || '',
                dateOfBirth: updated.dateOfBirth || '',
            });

            if (hasSensitiveChange) {
                logout('/login?reauth=true');
                return;
            }

            updateUser({
                firstName: updated.firstName,
                lastName: updated.lastName,
                email: updated.email,
            });

            setSuccess('Profile updated successfully.');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-2">
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">My Profile</h1>
                <p className="text-slate-500 text-lg">Update your personal details and account credentials.</p>
            </div>

            {error && <AlertBanner message={error} />}
            {success && <AlertBanner message={success} variant="success" />}
            {hasSensitiveChange && (
                <AlertBanner
                    message="Changing your email or password will require you to sign in again."
                    variant="warning"
                />
            )}

            {loading ? (
                <div className="card h-48 animate-pulse bg-slate-100 border-none" />
            ) : (
                <div className="card p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 ml-1">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={cn(
                                        'input-field',
                                        fieldErrors.firstName && 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                    )}
                                    placeholder="John"
                                    aria-invalid={!!fieldErrors.firstName}
                                    aria-describedby={fieldErrors.firstName ? 'profile-first-name-error' : undefined}
                                />
                                {fieldErrors.firstName && (
                                    <p id="profile-first-name-error" className="text-xs text-red-600 ml-1">
                                        {fieldErrors.firstName}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 ml-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={cn(
                                        'input-field',
                                        fieldErrors.lastName && 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                    )}
                                    placeholder="Doe"
                                    aria-invalid={!!fieldErrors.lastName}
                                    aria-describedby={fieldErrors.lastName ? 'profile-last-name-error' : undefined}
                                />
                                {fieldErrors.lastName && (
                                    <p id="profile-last-name-error" className="text-xs text-red-600 ml-1">
                                        {fieldErrors.lastName}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className={cn(
                                    'input-field',
                                    fieldErrors.email && 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                )}
                                placeholder="name@example.com"
                                aria-invalid={!!fieldErrors.email}
                                aria-describedby={fieldErrors.email ? 'profile-email-error' : undefined}
                            />
                            {fieldErrors.email && (
                                <p id="profile-email-error" className="text-xs text-red-600 ml-1">
                                    {fieldErrors.email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={cn(
                                    'input-field',
                                    fieldErrors.password && 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                )}
                                placeholder="Leave blank to keep current password"
                                aria-invalid={!!fieldErrors.password}
                                aria-describedby={fieldErrors.password ? 'profile-password-error' : undefined}
                            />
                            {fieldErrors.password && (
                                <p id="profile-password-error" className="text-xs text-red-600 ml-1">
                                    {fieldErrors.password}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 ml-1">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={cn(
                                        'input-field',
                                        fieldErrors.phone && 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                    )}
                                    placeholder="+94 77 123 4567"
                                    aria-invalid={!!fieldErrors.phone}
                                    aria-describedby={fieldErrors.phone ? 'profile-phone-error' : undefined}
                                />
                                {fieldErrors.phone && (
                                    <p id="profile-phone-error" className="text-xs text-red-600 ml-1">
                                        {fieldErrors.phone}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 ml-1">Date of Birth</label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    max={maxDate}
                                    className={cn(
                                        'input-field',
                                        fieldErrors.dateOfBirth && 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                    )}
                                    aria-invalid={!!fieldErrors.dateOfBirth}
                                    aria-describedby={fieldErrors.dateOfBirth ? 'profile-dob-error' : undefined}
                                />
                                {fieldErrors.dateOfBirth && (
                                    <p id="profile-dob-error" className="text-xs text-red-600 ml-1">
                                        {fieldErrors.dateOfBirth}
                                    </p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary w-full md:w-auto px-6 py-3"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            )}
        </DashboardLayout>
    );
}
