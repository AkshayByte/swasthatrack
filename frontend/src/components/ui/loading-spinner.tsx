import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: number;
    className?: string;
    text?: string;
}

export function LoadingSpinner({
    size = 24,
    className,
    text,
    ...props
}: LoadingSpinnerProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-2" {...props}>
            <Loader2
                className={cn("animate-spin text-primary", className)}
                size={size}
            />
            {text && <p className="text-sm text-muted-foreground">{text}</p>}
        </div>
    );
}
