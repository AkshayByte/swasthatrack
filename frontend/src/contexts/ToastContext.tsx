import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    description?: string;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    showToast: (toast: Omit<Toast, 'id'>) => void;
    success: (title: string, description?: string) => void;
    error: (title: string, description?: string) => void;
    info: (title: string, description?: string) => void;
    warning: (title: string, description?: string) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(7);
        const newToast: Toast = {
            ...toast,
            id,
            duration: toast.duration || 5000
        };

        setToasts(prev => [...prev, newToast]);

        // Auto remove after duration
        if (newToast.duration) {
            setTimeout(() => {
                removeToast(id);
            }, newToast.duration);
        }
    }, [removeToast]);

    const success = useCallback((title: string, description?: string) => {
        showToast({ type: 'success', title, description });
    }, [showToast]);

    const error = useCallback((title: string, description?: string) => {
        showToast({ type: 'error', title, description });
    }, [showToast]);

    const info = useCallback((title: string, description?: string) => {
        showToast({ type: 'info', title, description });
    }, [showToast]);

    const warning = useCallback((title: string, description?: string) => {
        showToast({ type: 'warning', title, description });
    }, [showToast]);

    return (
        <ToastContext.Provider value={{ toasts, showToast, success, error, info, warning, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

interface ToastContainerProps {
    toasts: Toast[];
    removeToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
            <AnimatePresence>
                {toasts.map(toast => (
                    <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
                ))}
            </AnimatePresence>
        </div>
    );
};

interface ToastItemProps {
    toast: Toast;
    onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
    const icons = {
        success: CheckCircle,
        error: AlertCircle,
        info: Info,
        warning: AlertTriangle
    };

    const colors = {
        success: 'bg-green-50 border-green-200 text-green-900',
        error: 'bg-red-50 border-red-200 text-red-900',
        info: 'bg-blue-50 border-blue-200 text-blue-900',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-900'
    };

    const iconColors = {
        success: 'text-green-600',
        error: 'text-red-600',
        info: 'text-blue-600',
        warning: 'text-yellow-600'
    };

    const Icon = icons[toast.type];

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
                'flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm',
                colors[toast.type]
            )}
        >
            <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', iconColors[toast.type])} />
            <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm">{toast.title}</h4>
                {toast.description && (
                    <p className="text-sm opacity-90 mt-1">{toast.description}</p>
                )}
            </div>
            <button
                onClick={() => onRemove(toast.id)}
                className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
};
