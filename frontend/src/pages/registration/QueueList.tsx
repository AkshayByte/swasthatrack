import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useMockData } from '@/contexts/MockDataContext';

const QueueList = () => {
  const { queue, updateQueueStatus } = useMockData();
  const [searchTerm, setSearchTerm] = useState('');

  // Transform queue from context to match local expectations if needed, or update rendering
  // QueueEntry has: patientName, serviceType, priority, status, checkInTime
  // Local had: department (serviceType), addedAt (checkInTime), abhaId (pending in QueueEntry?)

  const displayQueue = queue.map(item => ({
    ...item,
    department: item.serviceType,
    addedAt: item.checkInTime ? new Date(item.checkInTime).toLocaleString() : 'N/A',
    abhaId: item.patientId || 'N/A' // Use patientId as proxy for ABHA ID for now
  }));

  const filteredQueue = displayQueue.filter(patient =>
    (patient.patientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.department || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityBadge = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-100">High</Badge>;
      case 'urgent':
      case 'emergency':
        return <Badge variant="destructive">Urgent</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'in-progress':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-600 hover:bg-green-700">Completed</Badge>;
      default:
        return <Badge variant="secondary">Waiting</Badge>;
    }
  };

  const handleCallPatient = (id: string | number) => {
    updateQueueStatus(id.toString(), 'in-progress');
  };

  const handleCompleteVisit = (id: string | number) => {
    updateQueueStatus(id.toString(), 'completed');
  };

  const handleRemoveFromQueue = (id: string | number) => {
    // Not implemented in context yet properly (only update status)
    // Maybe complete?
    updateQueueStatus(id.toString(), 'completed');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Patient Queue Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label htmlFor="search">Search Queue</Label>
            <Input
              id="search"
              placeholder="Search by patient name, ABHA ID, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>ABHA ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Added At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQueue.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.patientName}</TableCell>
                  <TableCell>{patient.abhaId}</TableCell>
                  <TableCell>{patient.department}</TableCell>
                  <TableCell>{getPriorityBadge(patient.priority)}</TableCell>
                  <TableCell>{getStatusBadge(patient.status)}</TableCell>
                  <TableCell>{patient.addedAt}</TableCell>
                  <TableCell>
                    {patient.status === 'Waiting' && (
                      <Button size="sm" className="mr-2" onClick={() => handleCallPatient(patient.id)}>
                        Call Patient
                      </Button>
                    )}
                    {patient.status === 'In Progress' && (
                      <Button size="sm" className="mr-2" onClick={() => handleCompleteVisit(patient.id)}>
                        Complete
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => handleRemoveFromQueue(patient.id)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Queue Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Patients:</span>
                <span className="font-bold">{queue.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Waiting:</span>
                <span className="font-bold">{queue.filter(p => p.status === 'waiting').length}</span>
              </div>
              <div className="flex justify-between">
                <span>In Progress:</span>
                <span className="font-bold">{queue.filter(p => p.status === 'in-progress').length}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed:</span>
                <span className="font-bold">{queue.filter(p => p.status === 'completed').length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Normal:</span>
                <span className="font-bold">{queue.filter(p => p.priority === 'normal').length}</span>
              </div>
              <div className="flex justify-between">
                <span>High:</span>
                <span className="font-bold">{queue.filter(p => p.priority === 'high').length}</span>
              </div>
              <div className="flex justify-between">
                <span>Urgent:</span>
                <span className="font-bold">{queue.filter(p => p.priority === 'emergency').length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>General Medicine:</span>
                <span className="font-bold">{queue.filter(p => p.serviceType === 'General Medicine' || p.serviceType === 'Consultation').length}</span>
              </div>
              <div className="flex justify-between">
                <span>Cardiology:</span>
                <span className="font-bold">{queue.filter(p => p.serviceType === 'Cardiology').length}</span>
              </div>
              <div className="flex justify-between">
                <span>Orthopedics:</span>
                <span className="font-bold">{queue.filter(p => p.serviceType === 'Orthopedics').length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QueueList;