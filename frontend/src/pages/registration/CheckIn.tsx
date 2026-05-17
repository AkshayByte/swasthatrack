import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import {
    UserPlus,
    Search,
    QrCode,
    ArrowLeft,
    CheckCircle2,
    Clock,
    User
} from 'lucide-react';
import { useRoleHome } from '@/hooks/useRoleHome';

interface Patient {
    id: string;
    name: string;
    phone: string;
    age: number;
    gender: string;
    lastVisit?: string;
}

export default function CheckIn() {
    const navigate = useNavigate();
    const roleHome = useRoleHome();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [checkInSuccess, setCheckInSuccess] = useState(false);

    // Mock patients data
    const [patients] = useState<Patient[]>([
        {
            id: 'P001',
            name: 'John Doe',
            phone: '+91 98765 43210',
            age: 35,
            gender: 'Male',
            lastVisit: '2025-11-10'
        },
        {
            id: 'P002',
            name: 'Jane Smith',
            phone: '+91 98765 43211',
            age: 28,
            gender: 'Female',
            lastVisit: '2025-11-12'
        },
        {
            id: 'P003',
            name: 'Robert Johnson',
            phone: '+91 98765 43212',
            age: 45,
            gender: 'Male',
            lastVisit: '2025-10-25'
        }
    ]);

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.phone.includes(searchQuery) ||
        patient.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCheckIn = () => {
        if (selectedPatient) {
            setCheckInSuccess(true);
            setTimeout(() => {
                setCheckInSuccess(false);
                setSelectedPatient(null);
                setSearchQuery('');
            }, 3000);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Patient Check-In</h1>
                    <p className="text-muted-foreground">
                        Quick patient check-in for appointments and visits
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate(roleHome)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                    <Button onClick={() => navigate('/dashboard/registration/register')}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        New Patient
                    </Button>
                </div>
            </div>

            {/* Success Message */}
            {checkInSuccess && (
                <Card className="border-green-500 bg-green-50">
                    <CardContent className="flex items-center gap-3 py-4">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                        <div>
                            <div className="font-semibold text-green-900">Check-in Successful!</div>
                            <div className="text-sm text-green-700">
                                {selectedPatient?.name} has been checked in successfully.
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                {/* Search Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Search Patient</CardTitle>
                        <CardDescription>
                            Search by patient ID, name, or phone number
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="search">Search</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="search"
                                    placeholder="Enter patient ID, name, or phone..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {searchQuery && (
                            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                {filteredPatients.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                        <p>No patients found</p>
                                    </div>
                                ) : (
                                    filteredPatients.map((patient) => (
                                        <div
                                            key={patient.id}
                                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedPatient?.id === patient.id
                                                ? 'border-primary bg-primary/5'
                                                : 'hover:bg-muted/50'
                                                }`}
                                            onClick={() => setSelectedPatient(patient)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold">{patient.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        ID: {patient.id} | {patient.phone}
                                                    </div>
                                                </div>
                                                <Badge variant="outline">
                                                    {patient.age}y, {patient.gender}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        <div className="pt-4 border-t">
                            <Button variant="outline" className="w-full">
                                <QrCode className="mr-2 h-4 w-4" />
                                Scan Patient ID Card
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Check-In Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Check-In Details</CardTitle>
                        <CardDescription>
                            {selectedPatient ? 'Review and confirm check-in' : 'Select a patient to check in'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {selectedPatient ? (
                            <>
                                <div className="space-y-4">
                                    <div className="p-4 border rounded-lg bg-muted/30">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="font-semibold text-lg">{selectedPatient.name}</h3>
                                                <p className="text-sm text-muted-foreground">Patient ID: {selectedPatient.id}</p>
                                            </div>
                                            <Badge variant="outline" className="bg-background">
                                                {selectedPatient.age}y, {selectedPatient.gender}
                                            </Badge>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <div className="text-muted-foreground">Phone</div>
                                                <div className="font-medium">{selectedPatient.phone}</div>
                                            </div>
                                            <div>
                                                <div className="text-muted-foreground">Last Visit</div>
                                                <div className="font-medium">{selectedPatient.lastVisit || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="visitType">Visit Type</Label>
                                        <Select defaultValue="consultation">
                                            <SelectTrigger id="visitType">
                                                <SelectValue placeholder="Select visit type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="consultation">Consultation</SelectItem>
                                                <SelectItem value="follow-up">Follow-up</SelectItem>
                                                <SelectItem value="emergency">Emergency</SelectItem>
                                                <SelectItem value="lab-test">Lab Test</SelectItem>
                                                <SelectItem value="vaccination">Vaccination</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="department">Department</Label>
                                        <Select defaultValue="general">
                                            <SelectTrigger id="department">
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="general">General Medicine</SelectItem>
                                                <SelectItem value="cardiology">Cardiology</SelectItem>
                                                <SelectItem value="orthopedics">Orthopedics</SelectItem>
                                                <SelectItem value="pediatrics">Pediatrics</SelectItem>
                                                <SelectItem value="emergency">Emergency</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="doctor">Assigned Doctor (Optional)</Label>
                                        <Select>
                                            <SelectTrigger id="doctor">
                                                <SelectValue placeholder="Select doctor" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="dr-smith">Dr. John Smith</SelectItem>
                                                <SelectItem value="dr-johnson">Dr. Sarah Johnson</SelectItem>
                                                <SelectItem value="dr-wilson">Dr. Mike Wilson</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="notes">Notes (Optional)</Label>
                                        <Input
                                            id="notes"
                                            placeholder="Add any additional notes..."
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 space-y-2">
                                    <Button className="w-full" onClick={handleCheckIn}>
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Complete Check-In
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => setSelectedPatient(null)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Clock className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                                <p className="text-muted-foreground">
                                    Search and select a patient to begin check-in process
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today's Check-ins</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">42</div>
                        <p className="text-xs text-muted-foreground">
                            +8 from yesterday
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Waiting Patients</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">
                            In queue
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">18 min</div>
                        <p className="text-xs text-muted-foreground">
                            -5 min from average
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
