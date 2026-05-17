import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import {
    Stethoscope,
    Search,
    Calendar,
    Clock,
    ArrowLeft,
    User,
    FileText,
    Plus,
    AlertCircle
} from 'lucide-react';
import encountersAPI, { Encounter } from '@/services/encountersAPI';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRoleHome } from '@/hooks/useRoleHome';

export default function Encounters() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const [encounters, setEncounters] = useState<Encounter[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const roleHome = useRoleHome();

    useEffect(() => {
        const fetchEncounters = async () => {
            try {
                setLoading(true);
                const data = await encountersAPI.getAllEncounters();
                setEncounters(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching encounters:', err);
                setError('Failed to load encounters. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchEncounters();
    }, []);

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            scheduled: 'bg-blue-500',
            'in-progress': 'bg-orange-500',
            completed: 'bg-green-500',
            cancelled: 'bg-red-500'
        };
        return colors[status] || 'bg-gray-500';
    };

    const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            Consultation: 'text-blue-600 bg-blue-50',
            'Follow-up': 'text-green-600 bg-green-50',
            Emergency: 'text-red-600 bg-red-50',
            Routine: 'text-gray-600 bg-gray-50'
        };
        return colors[type] || 'text-gray-600 bg-gray-50';
    };

    const filteredEncounters = encounters.filter(encounter => {
        const matchesSearch = encounter.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            encounter.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            encounter.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || encounter.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Helper to check if date is today
    const isToday = (dateString: string) => {
        const today = new Date();
        const date = new Date(dateString);
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const todayEncounters = encounters.filter(e => isToday(e.date));
    const completedEncounters = encounters.filter(e => e.status === 'completed');
    const inProgressEncounters = encounters.filter(e => e.status === 'in-progress');

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <LoadingSpinner size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Patient Encounters</h1>
                    <p className="text-muted-foreground">
                        View and manage patient visits and encounters
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate(roleHome)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Encounter
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today's Encounters</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{todayEncounters.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Scheduled for today
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                        <Clock className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inProgressEncounters.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <Stethoscope className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completedEncounters.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {completedEncounters.length > 0 ? Math.round(
                                completedEncounters.reduce((sum, e) => sum + (e.duration || 0), 0) /
                                completedEncounters.filter(e => e.duration).length
                            ) : 0} min
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[250px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by patient name, ID, or complaint..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="w-[200px]">
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="scheduled">Scheduled</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Encounters List */}
            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">All Encounters</TabsTrigger>
                    <TabsTrigger value="today">Today</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                    {filteredEncounters.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">No encounters found.</div>
                    ) : (
                        filteredEncounters.map((encounter) => (
                            <Card key={encounter.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CardTitle className="text-lg">{encounter.patientName}</CardTitle>
                                                <Badge variant="outline" className={getTypeColor(encounter.type)}>
                                                    {encounter.type}
                                                </Badge>
                                                <Badge variant="outline" className="capitalize">
                                                    {encounter.status.replace('-', ' ')}
                                                </Badge>
                                            </div>
                                            <CardDescription>
                                                Encounter ID: {encounter.id} | Patient ID: {encounter.patientId}
                                            </CardDescription>
                                        </div>
                                        <div className={`w-10 h-10 rounded-full ${getStatusColor(encounter.status)} flex items-center justify-center text-white`}>
                                            <Stethoscope className="h-5 w-5" />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <div className="text-muted-foreground">Date & Time</div>
                                                <div className="font-medium flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {encounter.date} at {encounter.time}
                                                </div>
                                            </div>
                                            {encounter.duration && (
                                                <div>
                                                    <div className="text-muted-foreground">Duration</div>
                                                    <div className="font-medium flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {encounter.duration} minutes
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <div className="text-sm text-muted-foreground">Chief Complaint</div>
                                            <div className="font-medium">{encounter.chiefComplaint}</div>
                                        </div>

                                        {encounter.diagnosis && (
                                            <div>
                                                <div className="text-sm text-muted-foreground">Diagnosis</div>
                                                <div className="font-medium">{encounter.diagnosis}</div>
                                            </div>
                                        )}

                                        <div className="flex gap-2 pt-2">
                                            <Button variant="outline" size="sm">
                                                <FileText className="mr-2 h-4 w-4" />
                                                View Details
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <User className="mr-2 h-4 w-4" />
                                                Patient Profile
                                            </Button>
                                            {encounter.status === 'scheduled' && (
                                                <Button size="sm">
                                                    Start Encounter
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </TabsContent>

                <TabsContent value="today" className="space-y-4">
                    {todayEncounters.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">No encounters scheduled for today.</div>
                    ) : (
                        todayEncounters.map((encounter) => (
                            <Card key={encounter.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CardTitle className="text-lg">{encounter.patientName}</CardTitle>
                                                <Badge variant="outline" className={getTypeColor(encounter.type)}>
                                                    {encounter.type}
                                                </Badge>
                                                <Badge variant="outline" className="capitalize">
                                                    {encounter.status.replace('-', ' ')}
                                                </Badge>
                                            </div>
                                            <CardDescription>
                                                {encounter.time} | {encounter.chiefComplaint}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))
                    )}
                </TabsContent>

                <TabsContent value="completed" className="space-y-4">
                    {completedEncounters.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">No completed encounters found.</div>
                    ) : (
                        completedEncounters.map((encounter) => (
                            <Card key={encounter.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CardTitle className="text-lg">{encounter.patientName}</CardTitle>
                                                <Badge variant="outline" className={getTypeColor(encounter.type)}>
                                                    {encounter.type}
                                                </Badge>
                                            </div>
                                            <CardDescription>
                                                {encounter.date} | Duration: {encounter.duration} min | Diagnosis: {encounter.diagnosis}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
