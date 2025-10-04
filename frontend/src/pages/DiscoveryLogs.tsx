import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Clock, User, AlertTriangle, CheckCircle, XCircle, Download, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

type DiscoveryRequest = {
  id: string;
  patientName: string;
  patientAbhaAddress: string;
  timestamp: string;
  responseTime: number; // in milliseconds
  status: 'success' | 'timeout' | 'error';
  requestType: 'user_initiated' | 'system_generated';
  facilityId: string;
  facilityName: string;
  errorMessage?: string;
  dataRequested: string[];
};

const DiscoveryLogs = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'timeout' | 'error'>('all');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'all'>('24h');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data - replace with real API calls
  const [discoveryLogs] = useState<DiscoveryRequest[]>([
    {
      id: 'disc-001',
      patientName: 'John Doe',
      patientAbhaAddress: 'john.doe@abdm',
      timestamp: '2024-01-15T10:30:00Z',
      responseTime: 1850,
      status: 'success',
      requestType: 'user_initiated',
      facilityId: 'HIP-001',
      facilityName: 'City General Hospital',
      dataRequested: ['encounters', 'medicines', 'diagnosis']
    },
    {
      id: 'disc-002',
      patientName: 'Jane Smith',
      patientAbhaAddress: 'jane.smith@abdm',
      timestamp: '2024-01-15T10:25:00Z',
      responseTime: 2100,
      status: 'timeout',
      requestType: 'user_initiated',
      facilityId: 'HIP-002',
      facilityName: 'Specialist Clinic',
      errorMessage: 'Facility is taking longer than expected',
      dataRequested: ['encounters', 'medicines']
    },
    {
      id: 'disc-003',
      patientName: 'Mike Johnson',
      patientAbhaAddress: 'mike.johnson@abdm',
      timestamp: '2024-01-15T10:20:00Z',
      responseTime: 500,
      status: 'success',
      requestType: 'system_generated',
      facilityId: 'HIP-003',
      facilityName: 'Community Health Center',
      dataRequested: ['encounters']
    },
    {
      id: 'disc-004',
      patientName: 'Sarah Wilson',
      patientAbhaAddress: 'sarah.wilson@abdm',
      timestamp: '2024-01-15T10:15:00Z',
      responseTime: 0,
      status: 'error',
      requestType: 'user_initiated',
      facilityId: 'HIP-001',
      facilityName: 'City General Hospital',
      errorMessage: 'Invalid ABHA address format',
      dataRequested: []
    }
  ]);

  const filteredLogs = discoveryLogs.filter(log => {
    const matchesSearch = log.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.patientAbhaAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.facilityName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: DiscoveryRequest['status']) => {
    const variants = {
      success: 'default',
      timeout: 'secondary',
      error: 'destructive'
    } as const;
    
    const labels = {
      success: 'Success',
      timeout: 'Timeout',
      error: 'Error'
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const getResponseTimeColor = (responseTime: number) => {
    if (responseTime <= 1000) return 'text-green-600';
    if (responseTime <= 2000) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getResponseTimeIcon = (responseTime: number) => {
    if (responseTime <= 1000) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (responseTime <= 2000) return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    return <XCircle className="w-4 h-4 text-red-600" />;
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Success",
        description: "Discovery logs refreshed successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh logs",
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
      description: "Discovery logs export in progress..."
    });
  };

  // Calculate statistics
  const totalRequests = discoveryLogs.length;
  const successfulRequests = discoveryLogs.filter(log => log.status === 'success').length;
  const timeoutRequests = discoveryLogs.filter(log => log.status === 'timeout').length;
  const errorRequests = discoveryLogs.filter(log => log.status === 'error').length;
  const avgResponseTime = discoveryLogs.reduce((sum, log) => sum + log.responseTime, 0) / discoveryLogs.length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Discovery Requests Log</h2>
          <p className="text-sm text-muted-foreground">Monitor user-initiated discovery requests and response times</p>
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
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Successful</p>
                <p className="text-2xl font-bold text-green-600">{successfulRequests}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Timeouts</p>
                <p className="text-2xl font-bold text-yellow-600">{timeoutRequests}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Errors</p>
                <p className="text-2xl font-bold text-red-600">{errorRequests}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold">{Math.round(avgResponseTime)}ms</p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
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
                  placeholder="Search by patient name, ABHA address, or facility..."
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
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="timeout">Timeout</SelectItem>
                <SelectItem value="error">Error</SelectItem>
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

      {/* Discovery Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Discovery Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log, index) => (
              <motion.div
                key={log.id}
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
                        <h3 className="font-semibold">{log.patientName}</h3>
                        <p className="text-sm text-muted-foreground">{log.patientAbhaAddress}</p>
                      </div>
                      {getStatusBadge(log.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Facility</p>
                        <p className="font-medium">{log.facilityName}</p>
                        <p className="text-xs text-muted-foreground">ID: {log.facilityId}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Response Time</p>
                        <div className="flex items-center gap-2">
                          {getResponseTimeIcon(log.responseTime)}
                          <span className={`font-medium ${getResponseTimeColor(log.responseTime)}`}>
                            {log.responseTime}ms
                          </span>
                        </div>
                        {log.responseTime > 2000 && (
                          <p className="text-xs text-red-600">Exceeds 2-second limit</p>
                        )}
                      </div>
                      <div>
                        <p className="text-muted-foreground">Request Type</p>
                        <Badge variant="outline" className="text-xs">
                          {log.requestType.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>

                    {log.dataRequested.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Data Requested</p>
                        <div className="flex gap-2 flex-wrap">
                          {log.dataRequested.map((data, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {data}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {log.errorMessage && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-red-800">Error Message</p>
                        <p className="text-sm text-red-700">{log.errorMessage}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right text-sm text-muted-foreground">
                    <p>{new Date(log.timestamp).toLocaleDateString()}</p>
                    <p>{new Date(log.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredLogs.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No discovery requests found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'No discovery requests have been logged yet'
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

export default DiscoveryLogs;
