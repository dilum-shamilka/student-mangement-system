import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

type AlertVariant = 'error' | 'success' | 'warning' | 'info';

const variantStyles: Record<AlertVariant, string> = {
    error: 'bg-rose-50/80 border-rose-200/80 text-rose-700 shadow-sm',
    success: 'bg-emerald-50/80 border-emerald-200/80 text-emerald-700 shadow-sm',
    warning: 'bg-amber-50/80 border-amber-200/80 text-amber-700 shadow-sm',
    info: 'bg-indigo-50/80 border-indigo-200/80 text-indigo-700 shadow-sm',
};

const variantIcons: Record<AlertVariant, React.ReactNode> = {
    error: <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />,
    success: <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />,
    warning: <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />,
    info: <Info className="h-4 w-4 text-indigo-600 shrink-0" />,
};

interface AlertBannerProps {
    message: string;
    variant?: AlertVariant;
    className?: string;
}

export default function AlertBanner({ message, variant = 'error', className }: AlertBannerProps) {
    return (
        <div
            role="alert"
            className={cn('flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm font-semibold backdrop-blur-xl', variantStyles[variant], className)}
        >
            {variantIcons[variant]}
            <span>{message}</span>
        </div>
    );
}