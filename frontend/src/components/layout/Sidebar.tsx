'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    LogOut,
    Menu,
    X,
    GraduationCap,
    User,
    ChevronRight
} from 'lucide-react';
import { Role } from '@/types/auth';
import { cn } from '@/lib/utils';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Profile', href: '/profile', icon: User },
        { name: 'Students', href: '/students', icon: Users, roles: [Role.ADMIN] },
        { name: 'Courses', href: '/courses', icon: BookOpen },
        { name: 'My Enrollments', href: '/enrollments', icon: GraduationCap, roles: [Role.STUDENT] },
    ];

    const filteredNavigation = navigation.filter(
        item => !item.roles || (user && item.roles.includes(user.role))
    );

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-30 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-[#4361EE] shadow-inner">
                        <GraduationCap className="h-5 w-5" />
                    </div>
                    <span className="font-extrabold text-xl tracking-tight text-[#0B132B]">DspAcademy</span>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-2xl transition-colors"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 w-72 bg-white/95 backdrop-blur-xl border-r border-slate-200/80 shadow-2xl shadow-slate-200/50 z-50 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-[#4361EE] shadow-inner">
                                <GraduationCap className="h-5 w-5" />
                            </div>
                            <span className="font-extrabold text-xl tracking-tight text-[#0B132B]">DspAcademy</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-2xl transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-1 px-4 py-6 space-y-1.5">
                        {filteredNavigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all group",
                                        isActive
                                            ? "bg-gradient-to-r from-[#0B132B] to-[#4361EE] text-white shadow-lg shadow-[#0B132B]/15"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-[#4361EE]")} />
                                        {item.name}
                                    </div>
                                    {isActive && <ChevronRight className="h-4 w-4 text-white" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Section */}
                    <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-3 px-2 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-[#4361EE] flex items-center justify-center font-bold shadow-inner">
                                {user?.firstName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 truncate">
                                    {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.email}
                                </p>
                                <p className="text-xs font-bold text-[#4361EE] uppercase tracking-wider truncate mt-0.5">
                                    {user?.role?.toLowerCase() || 'unknown'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => logout()}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-2xl transition-all border border-transparent hover:border-rose-100"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}