import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const PendingTests = () => {
  const [pendingTests, setPendingTests] = useState([
    { id: 1, patientName: 'Rajesh Kumar', testType: 'Complete Blood Count', orderedBy: 'Dr. Arjun Mehta', orderedAt: '2025-11-14 09:30', priority: 'Normal' },
    { id: 2, patientName: 'Sunita Devi', testType: 'Lipid Profile', orderedBy: 'Dr. Arjun Mehta', orderedAt: '2025-11-14 10:15', priority: 'High' },
    { id: 3, patientName: 'Vikram Singh', testType: 'Liver Function Test', orderedBy: 'Dr. Priya Sharma', orderedAt: '2025-11-14 11:00', priority: 'Normal' },
    { id: 4, patientName: 'Anjali Patel', testType: 'Thyroid Function Test', orderedBy: 'Dr. Rohit Jain', orderedAt: '2025-11-14 14:20', priority: 'Urgent' },
    { id: 5, patientName: 'Deepak Rao', testType: 'Kidney Function Test', orderedBy: 'Dr. Nisha Gupta', orderedAt: '2025-11-14 15:45', priority: 'Normal' },
  ]);

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return <Badge variant="warning">{priority}</Badge>;
      case 'Urgent':
        return <Badge variant="destructive">{priority}</Badge>;
      default:
        return <Badge variant="default">{priority}</Badge>;
    }
  };

  const handleStartTest = (testId) => {
    // In a real app, this would update the test status
    console.log(`Starting test ${testId}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pending Laboratory Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Test Type</TableHead>
                <TableHead>Ordered By</TableHead>
                <TableHead>Ordered At</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingTests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">{test.patientName}</TableCell>
                  <TableCell>{test.testType}</TableCell>
                  <TableCell>{test.orderedBy}</TableCell>
                  <TableCell>{test.orderedAt}</TableCell>
                  <TableCell>{getPriorityBadge(test.priority)}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleStartTest(test.id)}>Start Test</Button>
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

export default PendingTests;