'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Calendar as CalendarIcon, Clock } from 'lucide-react';

interface HeaderProps {
    title: string;
    description?: string;
    onOpenEmail?: () => void; // Email Modal එක ඕපන් කිරීමට prop එකක් එක් කළා
}

export default function Header({ title, description, onOpenEmail }: HeaderProps) {
    const [currentTime, setCurrentTime] = useState<string>('');
    const [currentDate, setCurrentDate] = useState<string>('');

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString());
            setCurrentDate(now.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }));
        };

        updateDateTime();
        const interval = setInterval(updateDateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="h-20 border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 bg-slate-950/80 backdrop-blur-md z-30">
            <div>
                <h1 className="text-xl font-bold text-slate-100">{title}</h1>
                {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-3 bg-slate-900 border border-slate-800 text-slate-300 text-xs px-3.5 py-1.5 rounded-xl font-medium">
                    <div className="flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{currentDate || 'Loading...'}</span>
                    </div>
                    <div className="w-px h-3 bg-slate-700"></div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="font-mono">{currentTime || 'Loading...'}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-1.5 rounded-full font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Online System
                </div>

                {/* Email Modal Open Button */}
                <button
                    onClick={onOpenEmail}
                    title="Send Email"
                    className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-slate-700 transition-all relative"
                >
                    <Mail className="w-4 h-4" />
                </button>
            </div>
        </header>
    );
}