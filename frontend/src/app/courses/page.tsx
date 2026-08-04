'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
    Plus,
    Search,
    BookOpen,
    Edit2,
    Trash2,
    Loader2,
    X,
    FileText,
    Hash,
    Clock
} from 'lucide-react';
import api from '@/lib/api';
import { CourseResponse, CourseRequest } from '@/types/course';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/types/auth';
import AlertBanner from '@/components/ui/AlertBanner';
import { EnrollmentResponse } from '@/types/enrollment';
import { isBlank, isValidCourseCode, maxLength, minLength } from '@/lib/validation';

export default function CoursesPage() {
    const { user } = useAuth();
    const canManageCourses = user?.role === Role.ADMIN || user?.role === Role.LECTURER;
    const isStudent = user?.role === Role.STUDENT;
    const [courses, setCourses] = useState<CourseResponse[]>([]);
    const [enrolledCourseIds, setEnrolledCourseIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<CourseResponse | null>(null);
    const [formData, setFormData] = useState<CourseRequest>({
        courseName: '',
        courseCode: '',
        description: '',
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [enrollingId, setEnrollingId] = useState<number | null>(null);

    const fetchCourses = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/courses');
            // @ts-ignore
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setError('Failed to load courses. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (!isStudent) return;

        const fetchEnrollments = async () => {
            try {
                const response = await api.get<EnrollmentResponse[]>('/enrollments/me');
                setEnrolledCourseIds(response.data.map((enrollment) => enrollment.courseId));
            } catch (error) {
                console.error('Error fetching enrollments:', error);
            }
        };

        fetchEnrollments();
    }, [isStudent]);

    const handleOpenModal = (course?: CourseResponse) => {
        if (!canManageCourses) return;
        setFormErrors({});
        if (course) {
            setEditingCourse(course);
            setFormData({
                courseName: course.courseName,
                courseCode: course.courseCode,
                description: course.description || '',
            });
        } else {
            setEditingCourse(null);
            setFormData({
                courseName: '',
                courseCode: '',
                description: '',
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCourse(null);
    };

    const validateForm = () => {
        const nextErrors: Record<string, string> = {};
        const courseName = formData.courseName.trim();
        const courseCode = formData.courseCode.trim().toUpperCase();
        const description = formData.description?.trim() ?? '';

        if (isBlank(courseName)) {
            nextErrors.courseName = 'Course name is required.';
        } else if (!minLength(courseName, 2)) {
            nextErrors.courseName = 'Course name must be at least 2 characters.';
        } else if (!maxLength(courseName, 100)) {
            nextErrors.courseName = 'Course name must be 100 characters or less.';
        }

        if (isBlank(courseCode)) {
            nextErrors.courseCode = 'Course code is required.';
        } else if (!isValidCourseCode(courseCode)) {
            nextErrors.courseCode = 'Use 2-20 letters, numbers, or hyphens.';
        }

        if (description && !maxLength(description, 500)) {
            nextErrors.description = 'Description must be 500 characters or less.';
        }

        setFormErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        setError(null);
        try {
            const payload: CourseRequest = {
                courseName: formData.courseName.trim(),
                courseCode: formData.courseCode.trim().toUpperCase(),
                description: formData.description?.trim() || '',
            };
            if (editingCourse) {
                await api.put(`/courses/${editingCourse.id}`, payload);
            } else {
                await api.post('/courses', payload);
            }
            fetchCourses();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving course:', error);
            setError('Failed to save course. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this course?')) return;
        try {
            setError(null);
            await api.delete(`/courses/${id}`);
            setCourses(courses.filter(c => c.id !== id));
        } catch (error) {
            console.error('Error deleting course:', error);
            setError('Failed to delete course. Please try again.');
        }
    };

    const handleEnroll = async (courseId: number) => {
        setEnrollingId(courseId);
        setError(null);
        try {
            await api.post('/enrollments', { courseId });
            setEnrolledCourseIds((prev) => [...prev, courseId]);
        } catch (error: any) {
            console.error('Error enrolling in course:', error);
            setError(error.response?.data || 'Failed to enroll in course. Please try again.');
        } finally {
            setEnrollingId(null);
        }
    };

    const isEnrolled = (courseId: number) => enrolledCourseIds.includes(courseId);

    const filteredCourses = courses.filter(course =>
        course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B132B] tracking-tight">Academic Courses</h1>
                    <p className="text-slate-500 text-base md:text-lg mt-1 font-medium">Manage the curriculum and course certificates</p>
                </div>
                {canManageCourses && (
                    <button
                        onClick={() => handleOpenModal()}
                        className="py-3 px-5 rounded-2xl bg-gradient-to-r from-[#0B132B] to-[#4361EE] text-white font-semibold shadow-lg shadow-[#0B132B]/15 hover:opacity-95 transition-all duration-300 flex items-center justify-center gap-2 h-12 active:scale-[0.98]"
                    >
                        <Plus className="h-5 w-5" />
                        Add New Course
                    </button>
                )}
            </div>

            {error && <div className="mb-6"><AlertBanner message={error} /></div>}

            <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or code..."
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200/80 rounded-2xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-[#4361EE] transition-all shadow-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {loading ? (
                        [1, 2, 3].map((i) => (
                            <div key={i} className="h-48 animate-pulse bg-slate-100/80 rounded-2xl border border-slate-200/50" />
                        ))
                    ) : filteredCourses.length === 0 ? (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-slate-400 font-semibold">No courses discovered yet.</p>
                        </div>
                    ) : (
                        filteredCourses.map((course) => (
                            <div key={course.id} className="bg-white border border-slate-200/80 p-6 rounded-3xl flex flex-col justify-between hover:shadow-xl hover:border-indigo-200 transition-all duration-300 group relative">
                                {canManageCourses && (
                                    <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleOpenModal(course)}
                                            className="p-2 text-slate-400 hover:text-[#4361EE] hover:bg-indigo-50 rounded-2xl transition-colors"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(course.id)}
                                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}

                                <div>
                                    <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mb-4 text-[#4361EE] shadow-inner">
                                        <BookOpen className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-[#0B132B] mb-1">{course.courseName}</h3>
                                    <p className="text-xs font-extrabold text-[#4361EE] uppercase tracking-wider mb-3">{course.courseCode}</p>
                                    <p className="text-sm text-slate-500 line-clamp-2 min-h-[40px] leading-relaxed font-medium">
                                        {course.description || 'No description provided for this course.'}
                                    </p>
                                    {isStudent && (
                                        <div className="mt-4">
                                            {isEnrolled(course.id) ? (
                                                <button
                                                    type="button"
                                                    disabled
                                                    className="w-full h-11 rounded-2xl bg-emerald-50 text-emerald-700 font-semibold text-sm border border-emerald-200/60 shadow-sm flex items-center justify-center"
                                                >
                                                    Enrolled
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => handleEnroll(course.id)}
                                                    disabled={enrollingId === course.id}
                                                    className="w-full h-11 rounded-2xl bg-[#0B132B] text-white font-semibold text-sm hover:bg-[#1C2541] transition-all shadow-md shadow-[#0B132B]/10 flex items-center justify-center gap-2 active:scale-[0.98]"
                                                >
                                                    {enrollingId === course.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enroll'}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5" />
                                        Added {new Date(course.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="font-bold text-slate-500 uppercase tracking-wider">ID: #{course.id}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Course Modal */}
            {isModalOpen && canManageCourses && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-[#0B132B]/50 backdrop-blur-md transition-opacity" onClick={handleCloseModal} />
                    <div className="bg-white/95 backdrop-blur-2xl border border-white/20 w-full max-w-lg relative z-10 shadow-2xl rounded-3xl animate-in zoom-in-95 duration-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h2 className="text-xl font-bold text-[#0B132B]">
                                {editingCourse ? 'Edit Course' : 'Create New Course'}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-2xl transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wider ml-1">Course Name</label>
                                <div className="relative">
                                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        required
                                        className={cn(
                                            'w-full pl-11 pr-4 py-3 bg-slate-50/80 border border-slate-200/80 rounded-2xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-[#4361EE] transition-all shadow-sm font-medium',
                                            formErrors.courseName && 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/30'
                                        )}
                                        placeholder="e.g. Introduction to Computer Science"
                                        value={formData.courseName}
                                        onChange={(e) => {
                                            setFormData({ ...formData, courseName: e.target.value });
                                            if (formErrors.courseName) {
                                                setFormErrors((prev) => ({ ...prev, courseName: '' }));
                                            }
                                        }}
                                        aria-invalid={!!formErrors.courseName}
                                        aria-describedby={formErrors.courseName ? 'course-name-error' : undefined}
                                    />
                                </div>
                                {formErrors.courseName && (
                                    <p id="course-name-error" className="text-xs font-semibold text-rose-600 ml-1 mt-1">
                                        {formErrors.courseName}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wider ml-1">Course Code</label>
                                <div className="relative">
                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        required
                                        maxLength={20}
                                        pattern="[A-Z0-9-]{2,20}"
                                        title="Use 2-20 letters, numbers, or hyphens."
                                        className={cn(
                                            'w-full pl-11 pr-4 py-3 bg-slate-50/80 border border-slate-200/80 rounded-2xl text-slate-800 placeholder-slate-400 text-sm font-mono uppercase focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-[#4361EE] transition-all shadow-sm font-bold',
                                            formErrors.courseCode && 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/30'
                                        )}
                                        placeholder="e.g. CS101"
                                        value={formData.courseCode}
                                        onChange={(e) => {
                                            const nextValue = e.target.value.toUpperCase().replace(/\s+/g, '');
                                            setFormData({ ...formData, courseCode: nextValue });
                                            if (!nextValue.trim()) {
                                                setFormErrors((prev) => ({ ...prev, courseCode: 'Course code is required.' }));
                                            } else if (!isValidCourseCode(nextValue)) {
                                                setFormErrors((prev) => ({ ...prev, courseCode: 'Use 2-20 letters, numbers, or hyphens.' }));
                                            } else if (formErrors.courseCode) {
                                                setFormErrors((prev) => ({ ...prev, courseCode: '' }));
                                            }
                                        }}
                                        aria-invalid={!!formErrors.courseCode}
                                        aria-describedby={formErrors.courseCode ? 'course-code-error' : undefined}
                                    />
                                </div>
                                {formErrors.courseCode && (
                                    <p id="course-code-error" className="text-xs font-semibold text-rose-600 ml-1 mt-1">
                                        {formErrors.courseCode}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wider ml-1">Description</label>
                                <textarea
                                    className={cn(
                                        'w-full px-4 py-3 bg-slate-50/80 border border-slate-200/80 rounded-2xl text-slate-800 placeholder-slate-400 text-sm min-h-[120px] resize-none focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-[#4361EE] transition-all shadow-sm font-medium',
                                        formErrors.description && 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/30'
                                    )}
                                    placeholder="Optional course overview..."
                                    value={formData.description}
                                    onChange={(e) => {
                                        setFormData({ ...formData, description: e.target.value });
                                        if (formErrors.description) {
                                            setFormErrors((prev) => ({ ...prev, description: '' }));
                                        }
                                    }}
                                    aria-invalid={!!formErrors.description}
                                    aria-describedby={formErrors.description ? 'course-description-error' : undefined}
                                />
                                {formErrors.description && (
                                    <p id="course-description-error" className="text-xs font-semibold text-rose-600 ml-1 mt-1">
                                        {formErrors.description}
                                    </p>
                                )}
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-3.5 rounded-2xl border border-slate-200/80 text-slate-600 font-semibold hover:bg-slate-100 transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-[2] py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#0B132B] to-[#4361EE] text-white font-semibold shadow-lg shadow-[#0B132B]/15 hover:opacity-95 transition-all duration-300 flex items-center justify-center gap-2 text-sm disabled:opacity-50 active:scale-[0.98]"
                                >
                                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Save Course'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}