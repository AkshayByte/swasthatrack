import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import {
    Package,
    Search,
    TrendingDown,
    AlertTriangle,
    ArrowLeft,
    Plus,
    Filter,
    Download
} from 'lucide-react';
import { useRoleHome } from '@/hooks/useRoleHome';

interface Shipment {
    id: string;
    trackingNumber: string;
    supplier: string;
    items: number;
    status: 'pending' | 'in-transit' | 'delivered' | 'delayed';
    estimatedDelivery: string;
    actualDelivery?: string;
    value: number;
}

export default function Shipments() {
    const navigate = useNavigate();
    const roleHome = useRoleHome();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const [shipments, setShipments] = useState<Shipment[]>([
        {
            id: '1',
            trackingNumber: 'SHP-2025-001',
            supplier: 'MediSupply Co.',
            items: 45,
            status: 'in-transit',
            estimatedDelivery: '2025-11-22',
            value: 125000
        },
        {
            id: '2',
            trackingNumber: 'SHP-2025-002',
            supplier: 'PharmaDirect Ltd.',
            items: 32,
            status: 'delivered',
            estimatedDelivery: '2025-11-18',
            actualDelivery: '2025-11-18',
            value: 89000
        },
        {
            id: '3',
            trackingNumber: 'SHP-2025-003',
            supplier: 'HealthCare Supplies',
            items: 67,
            status: 'delayed',
            estimatedDelivery: '2025-11-19',
            value: 156000
        },
        {
            id: '4',
            trackingNumber: 'SHP-2025-004',
            supplier: 'MediSupply Co.',
            items: 28,
            status: 'pending',
            estimatedDelivery: '2025-11-25',
            value: 72000
        }
    ]);

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-gray-500',
            'in-transit': 'bg-blue-500',
            delivered: 'bg-green-500',
            delayed: 'bg-red-500'
        };
        return colors[status] || 'bg-gray-500';
    };

    const filteredShipments = shipments.filter(shipment => {
        const matchesSearch = shipment.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            shipment.supplier.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || shipment.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Shipments Tracking</h1>
                    <p className="text-muted-foreground">
                        Track medicine deliveries and shipments
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate(roleHome)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Shipment
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{shipments.length}</div>
                        <p className="text-xs text-muted-foreground">
                            This month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Transit</CardTitle>
                        <Package className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {shipments.filter(s => s.status === 'in-transit').length}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                        <Package className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {shipments.filter(s => s.status === 'delivered').length}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Delayed</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {shipments.filter(s => s.status === 'delayed').length}
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
                                    placeholder="Search by tracking number or supplier..."
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
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="in-transit">In Transit</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                    <SelectItem value="delayed">Delayed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Shipments List */}
            <Card>
                <CardHeader>
                    <CardTitle>All Shipments</CardTitle>
                    <CardDescription>
                        {filteredShipments.length} shipment{filteredShipments.length !== 1 ? 's' : ''} found
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredShipments.map((shipment) => (
                            <div
                                key={shipment.id}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={`w-12 h-12 rounded-full ${getStatusColor(shipment.status)} flex items-center justify-center text-white`}>
                                        <Package className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold">{shipment.trackingNumber}</h3>
                                            <Badge variant="outline" className="capitalize">
                                                {shipment.status.replace('-', ' ')}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                            <div>Supplier: {shipment.supplier}</div>
                                            <div>Items: {shipment.items}</div>
                                            <div>Value: ₹{shipment.value.toLocaleString()}</div>
                                            <div>
                                                {shipment.actualDelivery ? (
                                                    <>Delivered: {shipment.actualDelivery}</>
                                                ) : (
                                                    <>ETA: {shipment.estimatedDelivery}</>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm">
                                        Track
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        Details
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
