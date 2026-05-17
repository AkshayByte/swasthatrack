import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
    FileCheck,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowLeft,
    Eye,
    AlertCircle
} from 'lucide-react';
import consentAPI, { ConsentRequest } from '@/services/consentAPI';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRoleHome } from '@/hooks/useRoleHome';

export default function Consent() {
    const navigate = useNavigate();
    const roleHome = useRoleHome();
    const { toast } = useToast();
    const [selectedConsent, setSelectedConsent] = useState<ConsentRequest | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [consents, setConsents] = useState<ConsentRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchConsents();
    }, []);

    const fetchConsents = async () => {
        try {
            setLoading(true);
            const patientId = '1'; // Default for demo
            const data = await consentAPI.getConsentsByPatientId(patientId);
            setConsents(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching consents:', err);
            setError('Failed to load consent requests.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-orange-500',
            approved: 'bg-green-500',
            rejected: 'bg-red-500'
        };
        return colors[status] || 'bg-gray-500';
    };

    const getUrgencyColor = (urgency: string) => {
        const colors: Record<string, string> = {
            low: 'text-green-600 bg-green-50',
            medium: 'text-orange-600 bg-orange-50',
            high: 'text-red-600 bg-red-50'
        };
        return colors[urgency] || 'text-gray-600 bg-gray-50';
    };

    const handleApprove = async (id: string) => {
        try {
            await consentAPI.updateConsentStatus(id, 'approved');
            setConsents(consents.map(c =>
                c.id === id ? { ...c, status: 'approved' as const } : c
            ));
            setIsViewOpen(false);
            toast({
                title: "Consent Approved",
                description: "The consent request has been approved successfully.",
            });
        } catch (err) {
            console.error('Error approving consent:', err);
            toast({
                title: "Error",
                description: "Failed to approve consent request. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleReject = async (id: string) => {
        try {
            await consentAPI.updateConsentStatus(id, 'rejected');
            setConsents(consents.map(c =>
                c.id === id ? { ...c, status: 'rejected' as const } : c
            ));
            setIsViewOpen(false);
            toast({
                title: "Consent Rejected",
                description: "The consent request has been rejected.",
            });
        } catch (err) {
            console.error('Error rejecting consent:', err);
            toast({
                title: "Error",
                description: "Failed to reject consent request. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleView = (consent: ConsentRequest) => {
        setSelectedConsent(consent);
        setIsViewOpen(true);
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <LoadingSpinner size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button variant="outline" className="mt-4" onClick={() => navigate(roleHome)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    const pendingConsents = consents.filter(c => c.status === 'pending');
    const approvedConsents = consents.filter(c => c.status === 'approved');
    const rejectedConsents = consents.filter(c => c.status === 'rejected');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Consent Management</h1>
                    <p className="text-muted-foreground">
                        Manage your consent requests for treatments and procedures
                    </p>
                </div>
                <Button variant="outline" onClick={() => navigate(roleHome)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                        <FileCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{consents.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingConsents.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{approvedConsents.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                        <XCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{rejectedConsents.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Consent Tabs */}
            <Tabs defaultValue="pending" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="pending">
                        <Clock className="mr-2 h-4 w-4" />
                        Pending ({pendingConsents.length})
                    </TabsTrigger>
                    <TabsTrigger value="approved">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Approved ({approvedConsents.length})
                    </TabsTrigger>
                    <TabsTrigger value="rejected">
                        <XCircle className="mr-2 h-4 w-4" />
                        Rejected ({rejectedConsents.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="space-y-4">
                    {pendingConsents.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <FileCheck className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">No pending consent requests</p>
                            </CardContent>
                        </Card>
                    ) : (
                        pendingConsents.map((consent) => (
                            <Card key={consent.id} className="border-l-4 border-l-orange-500">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CardTitle className="text-lg">{consent.title}</CardTitle>
                                                <Badge variant="outline">{consent.category}</Badge>
                                                <Badge variant="outline" className={getUrgencyColor(consent.urgency)}>
                                                    {consent.urgency} urgency
                                                </Badge>
                                            </div>
                                            <CardDescription>{consent.description}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1 text-sm text-muted-foreground">
                                            <div>Requested by: {consent.requestedBy}</div>
                                            <div>Requested on: {consent.requestedDate}</div>
                                            <div className="flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                Expires on: {consent.expiryDate}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => handleView(consent)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View Details
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => handleApprove(consent.id)}>
                                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                                Approve
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => handleReject(consent.id)}>
                                                <XCircle className="mr-2 h-4 w-4" />
                                                Reject
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </TabsContent>

                <TabsContent value="approved" className="space-y-4">
                    {approvedConsents.map((consent) => (
                        <Card key={consent.id} className="border-l-4 border-l-green-500">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CardTitle className="text-lg">{consent.title}</CardTitle>
                                            <Badge variant="outline">{consent.category}</Badge>
                                            <Badge variant="outline" className="bg-green-50 text-green-600">
                                                Approved
                                            </Badge>
                                        </div>
                                        <CardDescription>{consent.description}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1 text-sm text-muted-foreground">
                                        <div>Requested by: {consent.requestedBy}</div>
                                        <div>Requested on: {consent.requestedDate}</div>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => handleView(consent)}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Details
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="rejected" className="space-y-4">
                    {rejectedConsents.map((consent) => (
                        <Card key={consent.id} className="border-l-4 border-l-red-500">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CardTitle className="text-lg">{consent.title}</CardTitle>
                                            <Badge variant="outline">{consent.category}</Badge>
                                            <Badge variant="outline" className="bg-red-50 text-red-600">
                                                Rejected
                                            </Badge>
                                        </div>
                                        <CardDescription>{consent.description}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1 text-sm text-muted-foreground">
                                        <div>Requested by: {consent.requestedBy}</div>
                                        <div>Requested on: {consent.requestedDate}</div>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => handleView(consent)}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Details
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>

            {/* View Consent Dialog */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{selectedConsent?.title}</DialogTitle>
                        <DialogDescription>
                            Review consent request details
                        </DialogDescription>
                    </DialogHeader>
                    {selectedConsent && (
                        <div className="space-y-4 py-4">
                            <div className="grid gap-2">
                                <div className="font-medium">Description</div>
                                <div className="text-sm text-muted-foreground">{selectedConsent.description}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <div className="font-medium">Category</div>
                                    <Badge variant="outline" className="w-fit">{selectedConsent.category}</Badge>
                                </div>
                                <div className="grid gap-2">
                                    <div className="font-medium">Urgency</div>
                                    <Badge variant="outline" className={`w-fit ${getUrgencyColor(selectedConsent.urgency)}`}>
                                        {selectedConsent.urgency}
                                    </Badge>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <div className="font-medium">Requested By</div>
                                <div className="text-sm">{selectedConsent.requestedBy}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <div className="font-medium">Requested Date</div>
                                    <div className="text-sm">{selectedConsent.requestedDate}</div>
                                </div>
                                <div className="grid gap-2">
                                    <div className="font-medium">Expiry Date</div>
                                    <div className="text-sm">{selectedConsent.expiryDate}</div>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        {selectedConsent?.status === 'pending' && (
                            <>
                                <Button variant="outline" onClick={() => handleReject(selectedConsent.id)}>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Reject
                                </Button>
                                <Button onClick={() => handleApprove(selectedConsent.id)}>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Approve
                                </Button>
                            </>
                        )}
                        {selectedConsent?.status !== 'pending' && (
                            <Button variant="outline" onClick={() => setIsViewOpen(false)}>
                                Close
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
