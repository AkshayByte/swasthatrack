import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import {
    Activity,
    Server,
    Database,
    Cpu,
    HardDrive,
    Wifi,
    AlertTriangle,
    CheckCircle2,
    ArrowLeft,
    RefreshCw,
    TrendingUp,
    Clock
} from 'lucide-react';
import { useRoleHome } from '@/hooks/useRoleHome';

interface SystemMetric {
    name: string;
    value: number;
    unit: string;
    status: 'healthy' | 'warning' | 'critical';
    trend: 'up' | 'down' | 'stable';
}

export default function Monitoring() {
    const navigate = useNavigate();
    const roleHome = useRoleHome();
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [autoRefresh, setAutoRefresh] = useState(true);

    // Mock system metrics
    const [metrics, setMetrics] = useState<SystemMetric[]>([
        { name: 'CPU Usage', value: 45, unit: '%', status: 'healthy', trend: 'stable' },
        { name: 'Memory Usage', value: 68, unit: '%', status: 'healthy', trend: 'up' },
        { name: 'Disk Usage', value: 72, unit: '%', status: 'warning', trend: 'up' },
        { name: 'Network Traffic', value: 234, unit: 'Mbps', status: 'healthy', trend: 'stable' },
        { name: 'Active Sessions', value: 156, unit: 'users', status: 'healthy', trend: 'up' },
        { name: 'API Response Time', value: 245, unit: 'ms', status: 'healthy', trend: 'down' }
    ]);

    const [services, setServices] = useState([
        { name: 'Web Server', status: 'running', uptime: '15d 4h 23m', cpu: 12, memory: 45 },
        { name: 'Database', status: 'running', uptime: '15d 4h 23m', cpu: 28, memory: 62 },
        { name: 'API Gateway', status: 'running', uptime: '15d 4h 23m', cpu: 8, memory: 34 },
        { name: 'Cache Server', status: 'running', uptime: '15d 4h 23m', cpu: 5, memory: 28 },
        { name: 'Background Jobs', status: 'running', uptime: '15d 4h 23m', cpu: 15, memory: 38 }
    ]);

    const [recentLogs, setRecentLogs] = useState([
        { time: '2025-11-20 03:42:15', level: 'info', message: 'User login successful: john.smith@swasthatrack.com' },
        { time: '2025-11-20 03:41:52', level: 'info', message: 'Database backup completed successfully' },
        { time: '2025-11-20 03:40:33', level: 'warning', message: 'High memory usage detected on web server' },
        { time: '2025-11-20 03:39:18', level: 'info', message: 'API request processed: GET /api/patients' },
        { time: '2025-11-20 03:38:45', level: 'error', message: 'Failed to send email notification: SMTP timeout' }
    ]);

    useEffect(() => {
        if (autoRefresh) {
            const interval = setInterval(() => {
                setLastUpdate(new Date());
                // In real app, this would fetch fresh data
            }, 30000); // Refresh every 30 seconds

            return () => clearInterval(interval);
        }
    }, [autoRefresh]);

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            healthy: 'text-green-600 bg-green-50',
            warning: 'text-orange-600 bg-orange-50',
            critical: 'text-red-600 bg-red-50',
            running: 'text-green-600 bg-green-50'
        };
        return colors[status] || 'text-gray-600 bg-gray-50';
    };

    const getLogLevelColor = (level: string) => {
        const colors: Record<string, string> = {
            info: 'text-blue-600',
            warning: 'text-orange-600',
            error: 'text-red-600',
            success: 'text-green-600'
        };
        return colors[level] || 'text-gray-600';
    };

    const handleRefresh = () => {
        setLastUpdate(new Date());
        // In real app, this would fetch fresh data
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Monitoring</h1>
                    <p className="text-muted-foreground">
                        Monitor system health, performance, and logs
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate(roleHome)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                    <Button onClick={handleRefresh}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* System Status Overview */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>System Status</CardTitle>
                            <CardDescription>
                                Last updated: {lastUpdate.toLocaleTimeString()}
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-green-50 text-green-600">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                All Systems Operational
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Metrics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {metrics.map((metric, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                            <div className={`p-2 rounded-full ${getStatusColor(metric.status)}`}>
                                {metric.status === 'healthy' ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                ) : metric.status === 'warning' ? (
                                    <AlertTriangle className="h-4 w-4" />
                                ) : (
                                    <AlertTriangle className="h-4 w-4" />
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {metric.value} {metric.unit}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="capitalize">
                                    {metric.status}
                                </Badge>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <TrendingUp className={`h-3 w-3 ${metric.trend === 'up' ? 'text-red-500' :
                                        metric.trend === 'down' ? 'text-green-500' :
                                            'text-gray-500'
                                        }`} />
                                    {metric.trend}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Detailed Monitoring */}
            <Tabs defaultValue="services" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="services">
                        <Server className="mr-2 h-4 w-4" />
                        Services
                    </TabsTrigger>
                    <TabsTrigger value="performance">
                        <Activity className="mr-2 h-4 w-4" />
                        Performance
                    </TabsTrigger>
                    <TabsTrigger value="logs">
                        <Database className="mr-2 h-4 w-4" />
                        Logs
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="services" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Running Services</CardTitle>
                            <CardDescription>Status of all system services</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {services.map((service, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className={`w-10 h-10 rounded-full ${getStatusColor(service.status)} flex items-center justify-center`}>
                                                <Server className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold">{service.name}</h3>
                                                    <Badge variant="outline" className={getStatusColor(service.status)}>
                                                        {service.status}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        Uptime: {service.uptime}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Cpu className="h-3 w-3" />
                                                        CPU: {service.cpu}%
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <HardDrive className="h-3 w-3" />
                                                        Memory: {service.memory}%
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">Restart</Button>
                                            <Button variant="outline" size="sm">Logs</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="performance" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Performance Metrics</CardTitle>
                            <CardDescription>Real-time system performance data</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg">
                                <div className="text-center text-muted-foreground">
                                    <Activity className="h-12 w-12 mx-auto mb-2" />
                                    <p>Performance Chart Visualization</p>
                                    <p className="text-sm">(Chart library integration pending)</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="logs" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Logs</CardTitle>
                            <CardDescription>System activity and error logs</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {recentLogs.map((log, index) => (
                                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg font-mono text-sm">
                                        <span className="text-muted-foreground whitespace-nowrap">{log.time}</span>
                                        <Badge variant="outline" className={`${getLogLevelColor(log.level)} uppercase`}>
                                            {log.level}
                                        </Badge>
                                        <span className="flex-1">{log.message}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 flex justify-center">
                                <Button variant="outline">Load More Logs</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
