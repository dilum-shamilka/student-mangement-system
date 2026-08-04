'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
    Search,
    Filter,
    CheckCircle,
    XCircle,
    Clock,
    Mail,
    Phone,
    Calendar,
    Trash2,
    UserCheck,
    UserX,
    Loader2
} from 'lucide-react';
import api from '@/lib/api';
import { StudentResponse, EnrollmentStatus } from '@/types/student';
import { Role } from '@/types/auth';
import AlertBanner from '@/components/ui/AlertBanner';

export default function StudentsPage() {
    const [students, setStudents] = useState<StudentResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [processingId, setProcessingId] = useState<number | null>(null);

    const fetchStudents = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/students');
            // @ts-ignore
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
            setError('Failed to load students. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleUpdateStatus = async (id: number, status: EnrollmentStatus) => {
        setProcessingId(id);
        setError(null);
        try {
            await api.patch(`/students/${id}/status?status=${status}`);
            setStudents(students.map(s => s.id === id ? { ...s, enrollmentStatus: status } : s));
        } catch (error) {
            console.error('Error updating status:', error);
            setError('Failed to update student status. Please try again.');
        } finally {
            setProcessingId(null);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this student account?')) return;

        setProcessingId(id);
        setError(null);
        try {
            await api.delete(`/students/${id}`);
            setStudents(students.filter(s => s.id !== id));
        } catch (error) {
            console.error('Error deleting student:', error);
            setError('Failed to delete student. Please try again.');
        } finally {
            setProcessingId(null);
        }
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch =
            `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || student.enrollmentStatus === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: EnrollmentStatus) => {
        switch (status) {
            case EnrollmentStatus.APPROVED:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <CheckCircle className="h-3.5 w-3.5" /> Approved
                    </span>
                );
            case EnrollmentStatus.REJECTED:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                        <XCircle className="h-3.5 w-3.5" /> Rejected
                    </span>
                );
            case EnrollmentStatus.PENDING:
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100">
                        <Clock className="h-3.5 w-3.5" /> Pending
                    </span>
                );
        }
    };

    return (
        <DashboardLayout allowedRoles={[Role.ADMIN]}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B132B] tracking-tight">Student Accounts</h1>
                    <p className="text-slate-500 text-base md:text-lg mt-1 font-medium">Review and manage student self-registrations.</p>
                </div>
            </div>

            {error && <div className="mb-6"><AlertBanner message={error} /></div>}

            <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-2xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-[#4361EE] transition-all shadow-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Filter className="h-4 w-4 text-slate-400" />
                        <select
                            className="w-full md:w-44 px-3 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-2xl text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-[#4361EE] transition-all shadow-sm font-medium"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Joined</th>
                            <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            [1, 2, 3].map((i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={5} className="px-6 py-8">
                                        <div className="h-4 bg-slate-100 rounded-2xl w-full" />
                                    </td>
                                </tr>
                            ))
                        ) : filteredStudents.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center">
                                    <p className="text-slate-400 font-medium">No students found matching your criteria</p>
                                </td>
                            </tr>
                        ) : (
                            filteredStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-[#4361EE] flex items-center justify-center font-bold shadow-inner">
                                                {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 leading-none mb-1">
                                                    {student.firstName} {student.lastName}
                                                </p>
                                                <p className="text-xs font-bold text-slate-400">ID: #{student.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                                <Mail className="h-3.5 w-3.5 text-slate-400" />
                                                {student.email}
                                            </div>
                                            {student.phone && (
                                                <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                                                    {student.phone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        {getStatusBadge(student.enrollmentStatus)}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-sm text-slate-600 font-medium flex items-center gap-2">
                                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                            {new Date(student.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                            {student.enrollmentStatus !== EnrollmentStatus.APPROVED && (
                                                <button
                                                    onClick={() => handleUpdateStatus(student.id, EnrollmentStatus.APPROVED)}
                                                    disabled={processingId === student.id}
                                                    className="p-2.5 text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all border border-transparent hover:border-emerald-200"
                                                    title="Approve"
                                                >
                                                    {processingId === student.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCheck className="h-4 w-4" />}
                                                </button>
                                            )}
                                            {student.enrollmentStatus !== EnrollmentStatus.REJECTED && (
                                                <button
                                                    onClick={() => handleUpdateStatus(student.id, EnrollmentStatus.REJECTED)}
                                                    disabled={processingId === student.id}
                                                    className="p-2.5 text-amber-600 hover:bg-amber-50 rounded-2xl transition-all border border-transparent hover:border-amber-200"
                                                    title="Reject"
                                                >
                                                    {processingId === student.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserX className="h-4 w-4" />}
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(student.id)}
                                                disabled={processingId === student.id}
                                                className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-2xl transition-all border border-transparent hover:border-rose-200"
                                                title="Delete Account"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}