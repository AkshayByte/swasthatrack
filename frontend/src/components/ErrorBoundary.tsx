import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null
        };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error Boundary caught an error:', error, errorInfo);

        this.setState({
            error,
            errorInfo
        });

        // Log to error reporting service (e.g., Sentry)
        // logErrorToService(error, errorInfo);
    }

    private handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    private handleGoHome = () => {
        window.location.href = '/dashboard';
    };

    public render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <Card className="max-w-2xl w-full">
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-3 rounded-full bg-red-100">
                                    <AlertTriangle className="h-6 w-6 text-red-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">Something went wrong</CardTitle>
                                    <CardDescription>
                                        We're sorry for the inconvenience. The application encountered an unexpected error.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Error Details (Development Only) */}
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-red-900 mb-2">Error Details:</h3>
                                    <pre className="text-sm text-red-800 overflow-auto max-h-40">
                                        {this.state.error.toString()}
                                    </pre>
                                    {this.state.errorInfo && (
                                        <details className="mt-2">
                                            <summary className="cursor-pointer text-sm font-medium text-red-900">
                                                Component Stack
                                            </summary>
                                            <pre className="text-xs text-red-700 mt-2 overflow-auto max-h-40">
                                                {this.state.errorInfo.componentStack}
                                            </pre>
                                        </details>
                                    )}
                                </div>
                            )}

                            {/* User-friendly message */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-medium text-blue-900 mb-2">What you can do:</h4>
                                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                                    <li>Try refreshing the page</li>
                                    <li>Go back to the dashboard</li>
                                    <li>If the problem persists, contact support</li>
                                </ul>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <Button
                                    onClick={this.handleReset}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Try Again
                                </Button>
                                <Button
                                    onClick={this.handleGoHome}
                                    className="flex-1"
                                >
                                    <Home className="mr-2 h-4 w-4" />
                                    Go to Dashboard
                                </Button>
                            </div>

                            {/* Support Info */}
                            <div className="text-center text-sm text-muted-foreground pt-2 border-t">
                                Need help? Contact support at{' '}
                                <a href="mailto:support@swasthatrack.com" className="text-primary hover:underline">
                                    support@swasthatrack.com
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
