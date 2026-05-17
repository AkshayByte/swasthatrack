import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AddToQueue = () => {
  const [queueData, setQueueData] = useState({
    patientName: '',
    abhaId: '',
    department: '',
    priority: 'Normal',
    reason: ''
  });

  const [queue, setQueue] = useState([
    { id: 1, patientName: 'Rajesh Kumar', abhaId: 'ABHA123456', department: 'General Medicine', priority: 'Normal', addedAt: '2025-11-14 09:00' },
    { id: 2, patientName: 'Sunita Devi', abhaId: 'ABHA789012', department: 'Cardiology', priority: 'High', addedAt: '2025-11-14 09:15' },
    { id: 3, patientName: 'Vikram Singh', abhaId: 'ABHA345678', department: 'Orthopedics', priority: 'Normal', addedAt: '2025-11-14 09:30' },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQueueData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setQueueData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would add the patient to the queue
    const newPatient = {
      id: queue.length + 1,
      patientName: queueData.patientName,
      abhaId: queueData.abhaId,
      department: queueData.department,
      priority: queueData.priority,
      addedAt: new Date().toLocaleString('en-CA', { hour12: false })
    };
    setQueue([...queue, newPatient]);
    setQueueData({
      patientName: '',
      abhaId: '',
      department: '',
      priority: 'Normal',
      reason: ''
    });
    alert('Patient added to queue successfully!');
  };

  const handleRemoveFromQueue = (id) => {
    setQueue(queue.filter(patient => patient.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Patient to Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="patientName">Patient Name</Label>
                <Input
                  id="patientName"
                  name="patientName"
                  value={queueData.patientName}
                  onChange={handleInputChange}
                  placeholder="Enter patient name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="abhaId">ABHA ID</Label>
                <Input
                  id="abhaId"
                  name="abhaId"
                  value={queueData.abhaId}
                  onChange={handleInputChange}
                  placeholder="Enter ABHA ID"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="department">Department</Label>
                <Select name="department" onValueChange={(value) => handleSelectChange('department', value)} value={queueData.department}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Medicine</SelectItem>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="neurology">Neurology</SelectItem>
                    <SelectItem value="pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="gynecology">Gynecology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select name="priority" onValueChange={(value) => handleSelectChange('priority', value)} value={queueData.priority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="reason">Reason for Visit</Label>
                <Input
                  id="reason"
                  name="reason"
                  value={queueData.reason}
                  onChange={handleInputChange}
                  placeholder="Enter reason for visit"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit">Add to Queue</Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Current Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>ABHA ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Added At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queue.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.patientName}</TableCell>
                  <TableCell>{patient.abhaId}</TableCell>
                  <TableCell>{patient.department}</TableCell>
                  <TableCell>{patient.priority}</TableCell>
                  <TableCell>{patient.addedAt}</TableCell>
                  <TableCell>
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
    </div>
  );
};

export default AddToQueue;