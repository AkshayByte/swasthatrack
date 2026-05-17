import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useRoleHome } from '@/hooks/useRoleHome';
import {
    BarChart3,
    TrendingUp,
    Users,
    Activity,
    Download,
    ArrowLeft,
    Calendar,
    FileText,
    PieChart
} from 'lucide-react';

export default function Reports() {
    const navigate = useNavigate();
    const roleHome = useRoleHome();
    const [timeRange, setTimeRange] = useState('month');
    const [reportType, setReportType] = useState('overview');

    // Mock data for different report types
    const mockStats = {
        overview: {
            totalPatients: 1245,
            totalVisits: 3456,
            revenue: '₹12,45,000',
            satisfaction: '94%'
        },
        doctor: {
            consultations: 156,
            avgDuration: '23 min',
            patientsSeen: 142,
            prescriptions: 134
        },
        pharmacy: {
            dispensed: 892,
            revenue: '₹3,45,000',
            stockValue: '₹8,90,000',
            lowStock: 12
        },
        lab: {
            testsCompleted: 456,
            pending: 23,
            avgTurnaround: '4.2 hrs',
            revenue: '₹2,34,000'
        }
    };

    const handleExport = (format: string) => {
        console.log(`Exporting report as ${format}`);
        // In real app, this would trigger download
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
                    <p className="text-muted-foreground">
                        View comprehensive analytics and generate reports
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate(roleHome)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                    <Button onClick={() => handleExport('pdf')}>
                        <Download className="mr-2 h-4 w-4" />
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Report Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <Select value={reportType} onValueChange={setReportType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select report type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="overview">Overview</SelectItem>
                                    <SelectItem value="doctor">Doctor Performance</SelectItem>
                                    <SelectItem value="pharmacy">Pharmacy Analytics</SelectItem>
                                    <SelectItem value="lab">Laboratory Metrics</SelectItem>
                                    <SelectItem value="financial">Financial Report</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <Select value={timeRange} onValueChange={setTimeRange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select time range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="today">Today</SelectItem>
                                    <SelectItem value="week">This Week</SelectItem>
                                    <SelectItem value="month">This Month</SelectItem>
                                    <SelectItem value="quarter">This Quarter</SelectItem>
                                    <SelectItem value="year">This Year</SelectItem>
                                    <SelectItem value="custom">Custom Range</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button variant="outline">
                            <Calendar className="mr-2 h-4 w-4" />
                            Custom Date
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockStats.overview.totalPatients}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">+12%</span> from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockStats.overview.totalVisits}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">+8%</span> from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockStats.overview.revenue}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">+15%</span> from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockStats.overview.satisfaction}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">+2%</span> from last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Reports */}
            <Tabs defaultValue="charts" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="charts">
                        <PieChart className="mr-2 h-4 w-4" />
                        Charts
                    </TabsTrigger>
                    <TabsTrigger value="tables">
                        <FileText className="mr-2 h-4 w-4" />
                        Tables
                    </TabsTrigger>
                    <TabsTrigger value="trends">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Trends
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="charts" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Patient Distribution</CardTitle>
                                <CardDescription>By department and specialty</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
                                    <div className="text-center text-muted-foreground">
                                        <PieChart className="h-12 w-12 mx-auto mb-2" />
                                        <p>Pie Chart Visualization</p>
                                        <p className="text-sm">(Chart library integration pending)</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Revenue Trends</CardTitle>
                                <CardDescription>Monthly revenue breakdown</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
                                    <div className="text-center text-muted-foreground">
                                        <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                                        <p>Bar Chart Visualization</p>
                                        <p className="text-sm">(Chart library integration pending)</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Appointment Trends</CardTitle>
                                <CardDescription>Daily appointment volume</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
                                    <div className="text-center text-muted-foreground">
                                        <Activity className="h-12 w-12 mx-auto mb-2" />
                                        <p>Line Chart Visualization</p>
                                        <p className="text-sm">(Chart library integration pending)</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Department Performance</CardTitle>
                                <CardDescription>Comparative analysis</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
                                    <div className="text-center text-muted-foreground">
                                        <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                                        <p>Multi-line Chart Visualization</p>
                                        <p className="text-sm">(Chart library integration pending)</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="tables" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detailed Report Data</CardTitle>
                            <CardDescription>Tabular view of all metrics</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="p-3 text-left font-medium">Metric</th>
                                            <th className="p-3 text-left font-medium">Current</th>
                                            <th className="p-3 text-left font-medium">Previous</th>
                                            <th className="p-3 text-left font-medium">Change</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b">
                                            <td className="p-3">Total Patients</td>
                                            <td className="p-3">1,245</td>
                                            <td className="p-3">1,112</td>
                                            <td className="p-3 text-green-600">+12%</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="p-3">Total Visits</td>
                                            <td className="p-3">3,456</td>
                                            <td className="p-3">3,200</td>
                                            <td className="p-3 text-green-600">+8%</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="p-3">Revenue</td>
                                            <td className="p-3">₹12,45,000</td>
                                            <td className="p-3">₹10,82,000</td>
                                            <td className="p-3 text-green-600">+15%</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3">Satisfaction Rate</td>
                                            <td className="p-3">94%</td>
                                            <td className="p-3">92%</td>
                                            <td className="p-3 text-green-600">+2%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="trends" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Performance Trends</CardTitle>
                            <CardDescription>Key performance indicators over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Patient Growth</span>
                                        <span className="font-medium text-green-600">+12%</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500" style={{ width: '75%' }}></div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Revenue Growth</span>
                                        <span className="font-medium text-green-600">+15%</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: '85%' }}></div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Satisfaction Score</span>
                                        <span className="font-medium text-green-600">+2%</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500" style={{ width: '94%' }}></div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Operational Efficiency</span>
                                        <span className="font-medium text-green-600">+8%</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-orange-500" style={{ width: '88%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Export Options */}
            <Card>
                <CardHeader>
                    <CardTitle>Export Options</CardTitle>
                    <CardDescription>Download reports in various formats</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" onClick={() => handleExport('pdf')}>
                            <FileText className="mr-2 h-4 w-4" />
                            Export as PDF
                        </Button>
                        <Button variant="outline" onClick={() => handleExport('excel')}>
                            <FileText className="mr-2 h-4 w-4" />
                            Export as Excel
                        </Button>
                        <Button variant="outline" onClick={() => handleExport('csv')}>
                            <FileText className="mr-2 h-4 w-4" />
                            Export as CSV
                        </Button>
                        <Button variant="outline" onClick={() => handleExport('json')}>
                            <FileText className="mr-2 h-4 w-4" />
                            Export as JSON
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
