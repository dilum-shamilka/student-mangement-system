'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import { EnrollmentResponse } from '@/types/enrollment';
import { Role } from '@/types/auth';
import { BookOpen, Calendar } from 'lucide-react';
import AlertBanner from '@/components/ui/AlertBanner';

export default function EnrollmentsPage() {
    const [enrollments, setEnrollments] = useState<EnrollmentResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEnrollments = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get<EnrollmentResponse[]>('/enrollments/me');
                setEnrollments(response.data);
            } catch (error) {
                console.error('Error fetching enrollments:', error);
                setError('Failed to load enrollments. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollments();
    }, []);

    return (
        <DashboardLayout allowedRoles={[Role.STUDENT]}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B132B] tracking-tight">My Enrollments</h1>
                    <p className="text-slate-500 text-base md:text-lg mt-1 font-medium">Courses you are currently enrolled in.</p>
                </div>
            </div>

            {error && <div className="mb-6"><AlertBanner message={error} /></div>}

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-48 animate-pulse bg-slate-100/80 rounded-3xl border border-slate-200/50" />
                    ))}
                </div>
            ) : enrollments.length === 0 ? (
                <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-2xl shadow-slate-200/50 rounded-3xl p-12 text-center">
                    <p className="text-slate-400 font-semibold">You are not enrolled in any courses yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrollments.map((enrollment) => (
                        <div key={enrollment.id} className="bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-6 rounded-3xl flex flex-col justify-between hover:shadow-2xl hover:border-indigo-200 transition-all duration-300">
                            <div>
                                <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mb-4 text-[#4361EE] shadow-inner">
                                    <BookOpen className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-bold text-[#0B132B] mb-1">{enrollment.courseName}</h3>
                                <p className="text-xs font-bold text-[#4361EE] uppercase tracking-wider mb-4">{enrollment.courseCode}</p>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-medium text-slate-400">
                                <Calendar className="h-3.5 w-3.5" />
                                Enrolled on {new Date(enrollment.enrolledAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}