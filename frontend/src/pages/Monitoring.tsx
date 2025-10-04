import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Shield, Clock, AlertTriangle, CheckCircle, XCircle, TrendingUp, TrendingDown, Users, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Monitoring = () => {
  const navigate = useNavigate();

  // Mock system health data
  const [systemHealth] = useState({
    status: 'healthy',
    uptime: '99.8%',
    responseTime: '245ms',
    activeConnections: 1247,
    errorRate: '0.2%'
  });

  // Mock performance metrics
  const [performanceData] = useState([
    { time: '00:00', responseTime: 180, errorRate: 0.1, requests: 1250 },
    { time: '04:00', responseTime: 195, errorRate: 0.2, requests: 980 },
    { time: '08:00', responseTime: 220, errorRate: 0.3, requests: 2100 },
    { time: '12:00', responseTime: 280, errorRate: 0.5, requests: 3400 },
    { time: '16:00', responseTime: 245, errorRate: 0.2, requests: 2800 },
    { time: '20:00', responseTime: 200, errorRate: 0.1, requests: 1600 },
  ]);

  // Mock ABDM integration status
  const [abdmStatus] = useState({
    discoveryRequests: { total: 1247, success: 1189, timeout: 45, error: 13 },
    consentRequests: { total: 892, granted: 756, denied: 89, expired: 47 },
    activeConnections: 45,
    lastSync: '2 minutes ago'
  });

  // Mock recent alerts
  const [recentAlerts] = useState([
    {
      id: 'alert-001',
      type: 'warning',
      message: 'Discovery request timeout - Facility HIP-002 taking longer than expected',
      timestamp: '2 minutes ago',
      severity: 'medium'
    },
    {
      id: 'alert-002',
      type: 'info',
      message: 'New consent request received from HIU-003',
      timestamp: '5 minutes ago',
      severity: 'low'
    },
    {
      id: 'alert-003',
      type: 'error',
      message: 'ABDM API connection timeout - retrying in 30 seconds',
      timestamp: '8 minutes ago',
      severity: 'high'
    },
    {
      id: 'alert-004',
      type: 'success',
      message: 'System performance optimized - response time improved by 15%',
      timestamp: '15 minutes ago',
      severity: 'low'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'info': return <Clock className="w-4 h-4 text-blue-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      high: 'destructive',
      medium: 'secondary',
      low: 'outline'
    } as const;

    return <Badge variant={variants[severity as keyof typeof variants]} className="text-xs">
      {severity.toUpperCase()}
    </Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Monitoring & Logs</h2>
          <p className="text-sm text-muted-foreground">System health monitoring and M2M workflow logs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/discovery-logs')}>
            <Activity className="w-4 h-4 mr-2" />
            Discovery Logs
          </Button>
          <Button variant="outline" onClick={() => navigate('/consent-requests')}>
            <Shield className="w-4 h-4 mr-2" />
            Consent Requests
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Status</p>
                <p className={`text-2xl font-bold ${getStatusColor(systemHealth.status)}`}>
                  {systemHealth.status.toUpperCase()}
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Uptime</p>
                <p className="text-2xl font-bold text-green-600">{systemHealth.uptime}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Response Time</p>
                <p className="text-2xl font-bold text-blue-600">{systemHealth.responseTime}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Connections</p>
                <p className="text-2xl font-bold text-purple-600">{systemHealth.activeConnections}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Error Rate</p>
                <p className="text-2xl font-bold text-red-600">{systemHealth.errorRate}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="responseTime" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Response Time (ms)"
                />
                <Line 
                  type="monotone" 
                  dataKey="errorRate" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Error Rate (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ABDM Integration Status */}
        <Card>
          <CardHeader>
            <CardTitle>ABDM Integration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{abdmStatus.discoveryRequests.total}</p>
                  <p className="text-sm text-muted-foreground">Discovery Requests</p>
                  <div className="flex justify-center gap-1 mt-2">
                    <Badge variant="default" className="text-xs">{abdmStatus.discoveryRequests.success}</Badge>
                    <Badge variant="secondary" className="text-xs">{abdmStatus.discoveryRequests.timeout}</Badge>
                    <Badge variant="destructive" className="text-xs">{abdmStatus.discoveryRequests.error}</Badge>
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{abdmStatus.consentRequests.total}</p>
                  <p className="text-sm text-muted-foreground">Consent Requests</p>
                  <div className="flex justify-center gap-1 mt-2">
                    <Badge variant="default" className="text-xs">{abdmStatus.consentRequests.granted}</Badge>
                    <Badge variant="destructive" className="text-xs">{abdmStatus.consentRequests.denied}</Badge>
                    <Badge variant="secondary" className="text-xs">{abdmStatus.consentRequests.expired}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Active Connections</p>
                  <p className="text-lg font-bold">{abdmStatus.activeConnections}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Last Sync</p>
                  <p className="text-sm font-medium">{abdmStatus.lastSync}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent System Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getAlertIcon(alert.type)}
                  <div>
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm text-muted-foreground">{alert.timestamp}</p>
                  </div>
                </div>
                {getSeverityBadge(alert.severity)}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/discovery-logs')}
            >
              <Activity className="w-6 h-6" />
              <span>View Discovery Logs</span>
              <span className="text-xs text-muted-foreground">Monitor M2M requests</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/consent-requests')}
            >
              <Shield className="w-6 h-6" />
              <span>View Consent Requests</span>
              <span className="text-xs text-muted-foreground">Track data sharing</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
            >
              <Building2 className="w-6 h-6" />
              <span>System Health</span>
              <span className="text-xs text-muted-foreground">Performance metrics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Monitoring;
