import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Clock, User, Shield, CheckCircle, XCircle, Download, RefreshCw, Calendar, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

type ConsentRequest = {
  id: string;
  patientName: string;
  patientAbhaAddress: string;
  hiuId: string;
  hiuName: string;
  requestTimestamp: string;
  consentStatus: 'granted' | 'denied' | 'expired' | 'pending';
  dataRange: {
    from: string;
    to: string;
  };
  purpose: string;
  requestedData: string[];
  notifyCallback: string;
  expiresAt: string;
  processedAt?: string;
};

const ConsentRequests = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'granted' | 'denied' | 'expired' | 'pending'>('all');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'all'>('24h');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data - replace with real API calls from notify callback
  const [consentRequests] = useState<ConsentRequest[]>([
    {
      id: 'consent-001',
      patientName: 'John Doe',
      patientAbhaAddress: 'john.doe@abdm',
      hiuId: 'HIU-001',
      hiuName: 'City General Hospital',
      requestTimestamp: '2024-01-15T10:30:00Z',
      consentStatus: 'granted',
      dataRange: {
        from: '2024-01-01',
        to: '2024-01-15'
      },
      purpose: 'Continuity of Care',
      requestedData: ['encounters', 'medicines', 'diagnosis'],
      notifyCallback: 'https://hiu-001.example.com/notify',
      expiresAt: '2024-01-16T10:30:00Z',
      processedAt: '2024-01-15T10:32:00Z'
    },
    {
      id: 'consent-002',
      patientName: 'Jane Smith',
      patientAbhaAddress: 'jane.smith@abdm',
      hiuId: 'HIU-002',
      hiuName: 'Specialist Clinic',
      requestTimestamp: '2024-01-15T09:15:00Z',
      consentStatus: 'denied',
      dataRange: {
        from: '2024-01-01',
        to: '2024-01-15'
      },
      purpose: 'Second Opinion',
      requestedData: ['encounters', 'diagnosis'],
      notifyCallback: 'https://hiu-002.example.com/notify',
      expiresAt: '2024-01-16T09:15:00Z',
      processedAt: '2024-01-15T09:20:00Z'
    },
    {
      id: 'consent-003',
      patientName: 'Mike Johnson',
      patientAbhaAddress: 'mike.johnson@abdm',
      hiuId: 'HIU-003',
      hiuName: 'Community Health Center',
      requestTimestamp: '2024-01-15T08:45:00Z',
      consentStatus: 'expired',
      dataRange: {
        from: '2024-01-01',
        to: '2024-01-15'
      },
      purpose: 'Research Study',
      requestedData: ['encounters', 'medicines'],
      notifyCallback: 'https://hiu-003.example.com/notify',
      expiresAt: '2024-01-15T08:45:00Z'
    },
    {
      id: 'consent-004',
      patientName: 'Sarah Wilson',
      patientAbhaAddress: 'sarah.wilson@abdm',
      hiuId: 'HIU-004',
      hiuName: 'Research Institute',
      requestTimestamp: '2024-01-15T11:00:00Z',
      consentStatus: 'pending',
      dataRange: {
        from: '2024-01-01',
        to: '2024-01-15'
      },
      purpose: 'Clinical Trial',
      requestedData: ['encounters', 'medicines', 'diagnosis', 'lab_results'],
      notifyCallback: 'https://hiu-004.example.com/notify',
      expiresAt: '2024-01-16T11:00:00Z'
    }
  ]);

  const filteredRequests = consentRequests.filter(request => {
    const matchesSearch = request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.patientAbhaAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.hiuName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.consentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ConsentRequest['consentStatus']) => {
    const variants = {
      granted: 'default',
      denied: 'destructive',
      expired: 'secondary',
      pending: 'outline'
    } as const;
    
    const labels = {
      granted: 'Granted',
      denied: 'Denied',
      expired: 'Expired',
      pending: 'Pending'
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const getStatusIcon = (status: ConsentRequest['consentStatus']) => {
    switch (status) {
      case 'granted':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'denied':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'expired':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Mock API call to refresh from notify callback
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Success",
        description: "Consent requests refreshed successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh consent requests",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = () => {
    // Mock export functionality
    toast({
      title: "Export Started",
      description: "Consent requests export in progress..."
    });
  };

  // Calculate statistics
  const totalRequests = consentRequests.length;
  const grantedRequests = consentRequests.filter(req => req.consentStatus === 'granted').length;
  const deniedRequests = consentRequests.filter(req => req.consentStatus === 'denied').length;
  const expiredRequests = consentRequests.filter(req => req.consentStatus === 'expired').length;
  const pendingRequests = consentRequests.filter(req => req.consentStatus === 'pending').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Consent Requests Log</h2>
          <p className="text-sm text-muted-foreground">Monitor data sharing consent requests from ABDM gateway</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-bold">{totalRequests}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Granted</p>
                <p className="text-2xl font-bold text-green-600">{grantedRequests}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Denied</p>
                <p className="text-2xl font-bold text-red-600">{deniedRequests}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expired</p>
                <p className="text-2xl font-bold text-yellow-600">{expiredRequests}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-blue-600">{pendingRequests}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by patient name, ABHA address, or HIU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="granted">Granted</SelectItem>
                <SelectItem value="denied">Denied</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Consent Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Consent Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{request.patientName}</h3>
                        <p className="text-sm text-muted-foreground">{request.patientAbhaAddress}</p>
                      </div>
                      {getStatusBadge(request.consentStatus)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Requesting HIU</p>
                        <p className="font-medium">{request.hiuName}</p>
                        <p className="text-xs text-muted-foreground">ID: {request.hiuId}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Purpose</p>
                        <p className="font-medium">{request.purpose}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Data Range</p>
                        <p className="font-medium">
                          {new Date(request.dataRange.from).toLocaleDateString()} - {new Date(request.dataRange.to).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Expires</p>
                        <div className="flex items-center gap-2">
                          {isExpired(request.expiresAt) && <Clock className="w-4 h-4 text-red-600" />}
                          <span className={`font-medium ${isExpired(request.expiresAt) ? 'text-red-600' : ''}`}>
                            {new Date(request.expiresAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(request.expiresAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    {request.requestedData.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Requested Data</p>
                        <div className="flex gap-2 flex-wrap">
                          {request.requestedData.map((data, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {data.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Notify Callback</p>
                        <p className="font-mono text-xs bg-muted p-2 rounded">
                          {request.notifyCallback}
                        </p>
                      </div>
                      {request.processedAt && (
                        <div>
                          <p className="text-muted-foreground">Processed At</p>
                          <p className="font-medium">
                            {new Date(request.processedAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(request.processedAt).toLocaleTimeString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right text-sm text-muted-foreground">
                    <p>Requested</p>
                    <p>{new Date(request.requestTimestamp).toLocaleDateString()}</p>
                    <p>{new Date(request.requestTimestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredRequests.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No consent requests found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'No consent requests have been received yet'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsentRequests;
