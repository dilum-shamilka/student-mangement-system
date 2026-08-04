'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Users, BookOpen, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { EnrollmentStatus, StudentResponse } from '@/types/student';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/types/auth';
import { CourseResponse } from '@/types/course';
import AlertBanner from '@/components/ui/AlertBanner';

export default function DashboardPage() {
    const { user } = useAuth();
    const isStudent = user?.role === Role.STUDENT;
    const [stats, setStats] = useState({
        totalStudents: 0,
        approvedStudents: 0,
        pendingStudents: 0,
        totalCourses: 0,
    });
    const [courses, setCourses] = useState<CourseResponse[]>([]);
    const [studentStatus, setStudentStatus] = useState<EnrollmentStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        const fetchStats = async () => {
            try {
                setError(null);
                if (isStudent) {
                    const [coursesRes, studentRes] = await Promise.all([
                        api.get('/courses'),
                        api.get<StudentResponse>('/students/me'),
                    ]);
                    // @ts-ignore
                    setCourses(coursesRes.data);
                    setStudentStatus(studentRes.data.enrollmentStatus);
                } else {
                    const [studentsRes, coursesRes] = await Promise.all([
                        api.get('/students'),
                        api.get('/courses'),
                    ]);

                    const students = studentsRes.data;
                    const courseList = coursesRes.data;

                    setStats({
                        totalStudents: students.length,
                        approvedStudents: students.filter((s: any) => s.enrollmentStatus === EnrollmentStatus.APPROVED).length,
                        pendingStudents: students.filter((s: any) => s.enrollmentStatus === EnrollmentStatus.PENDING).length,
                        totalCourses: courseList.length,
                    });
                }
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
                setError('Failed to load dashboard data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user, isStudent]);

    const statCards = [
        {
            label: 'Total Students',
            value: stats.totalStudents,
            icon: Users,
            color: 'bg-indigo-50 border border-indigo-100 text-[#4361EE]',
            trend: 'Total Registered'
        },
        {
            label: 'Approved',
            value: stats.approvedStudents,
            icon: CheckCircle,
            color: 'bg-emerald-50 border border-emerald-100 text-emerald-600',
            trend: 'Active Accounts'
        },
        {
            label: 'Pending Approval',
            value: stats.pendingStudents,
            icon: Clock,
            color: 'bg-amber-50 border border-amber-100 text-amber-600',
            trend: 'Awaiting Review'
        },
        {
            label: 'Total Courses',
            value: stats.totalCourses,
            icon: BookOpen,
            color: 'bg-violet-50 border border-violet-100 text-violet-600',
            trend: 'Offered Programs'
        },
    ];

    if (isStudent) {
        const statusStyle: Record<EnrollmentStatus, string> = {
            [EnrollmentStatus.PENDING]: 'bg-amber-50 text-amber-700 border-amber-200',
            [EnrollmentStatus.APPROVED]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            [EnrollmentStatus.REJECTED]: 'bg-rose-50 text-rose-700 border-rose-200',
        };

        return (
            <DashboardLayout>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B132B] tracking-tight">Student Dashboard</h1>
                            {studentStatus && (
                                <span className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${statusStyle[studentStatus]}`}>
                                    Status: {studentStatus}
                                </span>
                            )}
                        </div>
                        <p className="text-slate-500 text-base md:text-lg mt-1 font-medium">Your learning overview and available courses.</p>
                    </div>
                </div>

                {error && <div className="mb-6"><AlertBanner message={error} /></div>}

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-48 animate-pulse bg-slate-100/80 rounded-3xl border border-slate-200/50" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-2xl shadow-slate-200/50 rounded-3xl p-6 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Available Courses</p>
                                <p className="text-3xl font-extrabold text-[#0B132B]">{courses.length}</p>
                            </div>
                            <Link
                                href="/courses"
                                className="py-3 px-5 rounded-2xl bg-gradient-to-r from-[#0B132B] to-[#4361EE] text-white font-semibold text-sm shadow-lg shadow-[#0B132B]/15 hover:opacity-95 transition-all duration-300 flex items-center gap-2 active:scale-[0.98]"
                            >
                                Browse
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-2xl shadow-slate-200/50 rounded-3xl p-6">
                            <h2 className="text-lg font-bold text-[#0B132B] mb-2">Quick Tips</h2>
                            <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                Check the Courses page to explore new subjects, view details, and enroll in your academic programs.
                            </p>
                        </div>
                    </div>
                )}

                {!loading && (
                    <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-2xl shadow-slate-200/50 rounded-3xl p-6 md:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-[#0B132B]">Latest Courses</h2>
                            <Link href="/courses" className="text-sm font-semibold text-[#4361EE] hover:text-[#0B132B] hover:underline">
                                View all
                            </Link>
                        </div>
                        {courses.length === 0 ? (
                            <p className="text-sm text-slate-400 font-medium">No courses available yet.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {courses.slice(0, 4).map((course) => (
                                    <div key={course.id} className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:border-indigo-200 hover:shadow-md transition-all">
                                        <p className="font-bold text-[#0B132B]">{course.courseName}</p>
                                        <p className="text-xs font-bold text-[#4361EE] uppercase tracking-wider mt-1">{course.courseCode}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B132B] tracking-tight">System Overview</h1>
                    <p className="text-slate-500 text-base md:text-lg mt-1 font-medium">Quick snapshot of your institution&apos;s activity.</p>
                </div>
            </div>

            {error && <div className="mb-6"><AlertBanner message={error} /></div>}

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 animate-pulse bg-slate-100/80 rounded-3xl border border-slate-200/50" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, i) => (
                        <div key={i} className="bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-2xl shadow-slate-200/50 rounded-3xl p-6 flex items-center gap-5 hover:shadow-xl hover:border-indigo-200 transition-all duration-300">
                            <div className={`${stat.color} p-4 rounded-2xl shadow-inner flex items-center justify-center`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
                                <p className="text-2xl font-extrabold text-[#0B132B]">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-2xl shadow-slate-200/50 rounded-3xl p-8">
                    <h2 className="text-xl font-bold text-[#0B132B] mb-6">
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link
                            href="/students"
                            className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-indigo-50/50 hover:border-indigo-200 transition-all group"
                        >
                            <div className="flex items-center gap-3 text-slate-700 group-hover:text-[#4361EE] font-semibold text-sm">
                                <Users className="h-5 w-5 text-slate-400 group-hover:text-[#4361EE] transition-colors" />
                                Manage Students
                            </div>
                            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#4361EE] transition-colors" />
                        </Link>
                        <Link
                            href="/courses"
                            className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-indigo-50/50 hover:border-indigo-200 transition-all group"
                        >
                            <div className="flex items-center gap-3 text-slate-700 group-hover:text-[#4361EE] font-semibold text-sm">
                                <BookOpen className="h-5 w-5 text-slate-400 group-hover:text-[#4361EE] transition-colors" />
                                Manage Courses
                            </div>
                            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#4361EE] transition-colors" />
                        </Link>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-[#0B132B] to-[#4361EE] text-white rounded-3xl p-8 shadow-2xl shadow-[#0B132B]/15 relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
                        <p className="text-indigo-100 text-sm mb-6 max-w-sm leading-relaxed font-medium">
                            You have {stats.pendingStudents} pending student registrations to review. Keep your institution records up to date.
                        </p>
                        <Link
                            href="/students"
                            className="inline-flex items-center px-6 py-3.5 bg-white text-[#0B132B] font-bold rounded-2xl shadow-lg hover:bg-slate-50 transition-all text-sm active:scale-[0.98]"
                        >
                            Review Now
                        </Link>
                    </div>
                    {/* Abstract design elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none" />
                </div>
            </div>
        </DashboardLayout>
    );
}