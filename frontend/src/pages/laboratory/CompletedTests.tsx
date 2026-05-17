import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const CompletedTests = () => {
  const [completedTests, setCompletedTests] = useState([
    { id: 1, patientName: 'Rajesh Kumar', testType: 'Complete Blood Count', completedAt: '2025-11-14 10:30', technician: 'Neha Singh', status: 'Reviewed' },
    { id: 2, patientName: 'Sunita Devi', testType: 'Lipid Profile', completedAt: '2025-11-14 11:45', technician: 'Neha Singh', status: 'Pending Review' },
    { id: 3, patientName: 'Vikram Singh', testType: 'Liver Function Test', completedAt: '2025-11-14 12:30', technician: 'Rahul Sharma', status: 'Reviewed' },
    { id: 4, patientName: 'Anjali Patel', testType: 'Thyroid Function Test', completedAt: '2025-11-14 15:20', technician: 'Priya Desai', status: 'Pending Review' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredTests = completedTests.filter(test => 
    test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.testType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Reviewed':
        return <Badge variant="success">{status}</Badge>;
      case 'Pending Review':
        return <Badge variant="warning">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleViewReport = (testId) => {
    // In a real app, this would open the report
    console.log(`Viewing report for test ${testId}`);
  };

  const handleShareReport = (testId) => {
    // In a real app, this would share the report
    console.log(`Sharing report for test ${testId}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Completed Laboratory Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label htmlFor="search">Search Completed Tests</Label>
            <Input
              id="search"
              placeholder="Search by patient name or test type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Test Type</TableHead>
                <TableHead>Completed At</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">{test.patientName}</TableCell>
                  <TableCell>{test.testType}</TableCell>
                  <TableCell>{test.completedAt}</TableCell>
                  <TableCell>{test.technician}</TableCell>
                  <TableCell>{getStatusBadge(test.status)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => handleViewReport(test.id)}>
                      View Report
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleShareReport(test.id)}>
                      Share
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

export default CompletedTests;