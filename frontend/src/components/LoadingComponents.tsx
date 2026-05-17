import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    className,
    text
}) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16'
    };

    return (
        <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
            <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
            {text && <p className="text-sm text-muted-foreground">{text}</p>}
        </div>
    );
};

interface LoadingOverlayProps {
    text?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ text = 'Loading...' }) => {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-card p-6 rounded-lg shadow-lg border">
                <LoadingSpinner size="lg" text={text} />
            </div>
        </div>
    );
};

interface LoadingPageProps {
    text?: string;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({ text = 'Loading...' }) => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="xl" text={text} />
        </div>
    );
};

interface SkeletonProps {
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
    return (
        <div
            className={cn(
                'animate-pulse rounded-md bg-muted',
                className
            )}
        />
    );
};

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
    rows = 5,
    columns = 4
}) => {
    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex gap-4">
                {Array.from({ length: columns }).map((_, i) => (
                    <Skeleton key={i} className="h-8 flex-1" />
                ))}
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex gap-4">
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <Skeleton key={colIndex} className="h-12 flex-1" />
                    ))}
                </div>
            ))}
        </div>
    );
};

export const CardSkeleton: React.FC = () => {
    return (
        <div className="border rounded-lg p-6 space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-2 pt-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
            </div>
        </div>
    );
};

export const DashboardSkeleton: React.FC = () => {
    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <CardSkeleton key={i} />
                ))}
            </div>

            {/* Table */}
            <div className="border rounded-lg p-6">
                <Skeleton className="h-6 w-1/4 mb-4" />
                <TableSkeleton />
            </div>
        </div>
    );
};
