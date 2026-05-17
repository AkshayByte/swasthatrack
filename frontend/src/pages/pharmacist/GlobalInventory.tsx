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
    Building2,
    Download
} from 'lucide-react';
import { useRoleHome } from '@/hooks/useRoleHome';

interface InventoryItem {
    id: string;
    medicineName: string;
    category: string;
    totalStock: number;
    facilities: {
        name: string;
        stock: number;
        reorderLevel: number;
    }[];
    unit: string;
    expiryDate: string;
    status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

export default function GlobalInventory() {
    const navigate = useNavigate();
    const roleHome = useRoleHome();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    const [inventory, setInventory] = useState<InventoryItem[]>([
        {
            id: '1',
            medicineName: 'Paracetamol 500mg',
            category: 'Analgesics',
            totalStock: 5420,
            facilities: [
                { name: 'Main Hospital', stock: 3200, reorderLevel: 1000 },
                { name: 'North Clinic', stock: 1500, reorderLevel: 500 },
                { name: 'South Clinic', stock: 720, reorderLevel: 500 }
            ],
            unit: 'tablets',
            expiryDate: '2026-12-31',
            status: 'in-stock'
        },
        {
            id: '2',
            medicineName: 'Amoxicillin 250mg',
            category: 'Antibiotics',
            totalStock: 890,
            facilities: [
                { name: 'Main Hospital', stock: 450, reorderLevel: 500 },
                { name: 'North Clinic', stock: 340, reorderLevel: 300 },
                { name: 'South Clinic', stock: 100, reorderLevel: 200 }
            ],
            unit: 'capsules',
            expiryDate: '2025-08-15',
            status: 'low-stock'
        },
        {
            id: '3',
            medicineName: 'Insulin Glargine',
            category: 'Diabetes',
            totalStock: 0,
            facilities: [
                { name: 'Main Hospital', stock: 0, reorderLevel: 100 },
                { name: 'North Clinic', stock: 0, reorderLevel: 50 },
                { name: 'South Clinic', stock: 0, reorderLevel: 50 }
            ],
            unit: 'vials',
            expiryDate: '2025-06-30',
            status: 'out-of-stock'
        }
    ]);

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'in-stock': 'bg-green-500',
            'low-stock': 'bg-orange-500',
            'out-of-stock': 'bg-red-500'
        };
        return colors[status] || 'bg-gray-500';
    };

    const filteredInventory = inventory.filter(item => {
        const matchesSearch = item.medicineName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Global Inventory</h1>
                    <p className="text-muted-foreground">
                        View medicine inventory across all facilities
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate(roleHome)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                    <Button>
                        <Download className="mr-2 h-4 w-4" />
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inventory.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Unique medicines
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Stock</CardTitle>
                        <Package className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {inventory.filter(i => i.status === 'in-stock').length}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                        <TrendingDown className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {inventory.filter(i => i.status === 'low-stock').length}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {inventory.filter(i => i.status === 'out-of-stock').length}
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
                                    placeholder="Search medicines..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="w-[180px]">
                            <Select value={filterCategory} onValueChange={setFilterCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value="Analgesics">Analgesics</SelectItem>
                                    <SelectItem value="Antibiotics">Antibiotics</SelectItem>
                                    <SelectItem value="Diabetes">Diabetes</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-[180px]">
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="in-stock">In Stock</SelectItem>
                                    <SelectItem value="low-stock">Low Stock</SelectItem>
                                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Inventory List */}
            <div className="space-y-4">
                {filteredInventory.map((item) => (
                    <Card key={item.id}>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <CardTitle className="text-lg">{item.medicineName}</CardTitle>
                                        <Badge variant="outline">{item.category}</Badge>
                                        <Badge variant="outline" className="capitalize">
                                            {item.status.replace('-', ' ')}
                                        </Badge>
                                    </div>
                                    <CardDescription>
                                        Total Stock: {item.totalStock} {item.unit} | Expiry: {item.expiryDate}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium">Stock by Facility</h4>
                                {item.facilities.map((facility, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Building2 className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <div className="font-medium">{facility.name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    Reorder Level: {facility.reorderLevel} {item.unit}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="text-2xl font-bold">{facility.stock}</div>
                                                <div className="text-xs text-muted-foreground">{item.unit}</div>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    facility.stock === 0 ? 'bg-red-50 text-red-600' :
                                                        facility.stock < facility.reorderLevel ? 'bg-orange-50 text-orange-600' :
                                                            'bg-green-50 text-green-600'
                                                }
                                            >
                                                {facility.stock === 0 ? 'Out' :
                                                    facility.stock < facility.reorderLevel ? 'Low' :
                                                        'OK'}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
