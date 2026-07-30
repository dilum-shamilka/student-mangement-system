'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  color?: 'cyan' | 'indigo' | 'emerald' | 'amber';
}

export default function StatCard({ title, value, subtitle, icon: Icon, trend, color = 'cyan' }: StatCardProps) {
  const colorMap = {
    cyan: 'from-cyan-50 to-blue-50 text-cyan-600 border-cyan-200',
    indigo: 'from-indigo-50 to-purple-50 text-indigo-600 border-indigo-200',
    emerald: 'from-emerald-50 to-teal-50 text-emerald-600 border-emerald-200',
    amber: 'from-amber-50 to-orange-50 text-amber-600 border-amber-200',
  };

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 relative overflow-hidden transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{value}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${colorMap[color]} border shadow-sm`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
          <span>↑ {trend}</span>
          <span className="text-slate-400 font-normal">vs last month</span>
        </div>
      )}
    </div>
  );
}