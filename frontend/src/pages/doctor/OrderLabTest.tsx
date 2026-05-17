import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import patientsAPI from '@/services/patientsAPI';
import labAPI from '@/services/labAPI';
import { Patient } from '@/types';

interface LabTestRequest {
  id: string;
  testName: string;
  testType: string;
  priority: 'normal' | 'high' | 'emergency' | 'low';
  notes: string;
}

const OrderLabTest = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tests, setTests] = useState<LabTestRequest[]>([]);
  const [newTest, setNewTest] = useState<Omit<LabTestRequest, 'id'>>({
    testName: '',
    testType: '',
    priority: 'normal',
    notes: ''
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const patientId = id || '1'; // Default for demo
        const data = await patientsAPI.getPatientById(patientId);
        setPatient(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching patient:', err);
        setError('Failed to load patient details.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const handleAddTest = () => {
    if (newTest.testName && newTest.testType) {
      setTests([
        ...tests,
        {
          id: (tests.length + 1).toString(),
          ...newTest
        }
      ]);
      setNewTest({
        testName: '',
        testType: '',
        priority: 'normal',
        notes: ''
      });
    }
  };

  const handleRemoveTest = (id: string) => {
    setTests(tests.filter(test => test.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return;

    try {
      // Create requests for all added tests
      const promises = tests.map(test =>
        labAPI.createLabTestRequest({
          patientId: patient.id,
          patientName: patient.name,
          patientPhone: patient.phone,
          orderedBy: 'Dr. Arjun Mehta', // Mock Doctor
          testName: test.testName,
          testType: test.testType,
          priority: test.priority,
        })
      );

      await Promise.all(promises);

      alert('Lab tests ordered successfully!');
      setTests([]);
      navigate('/dashboard/doctor/patient-queue');
    } catch (err) {
      console.error('Error ordering lab tests:', err);
      alert('Failed to submit lab test orders.');
    }
  };

  // Mock lab test types
  const labTestTypes = [
    'Blood Test',
    'Urine Test',
    'X-Ray',
    'MRI',
    'CT Scan',
    'Ultrasound',
    'Biopsy',
    'Culture Test'
  ];

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error || 'Patient not found'}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Order Lab Tests</h1>
        <p className="text-muted-foreground">Request laboratory tests for <span className="font-semibold">{patient.name}</span></p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Lab Test</CardTitle>
          <CardDescription>Order a new laboratory test</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="testName">Test Name</Label>
              <Input
                id="testName"
                value={newTest.testName}
                onChange={(e) => setNewTest({ ...newTest, testName: e.target.value })}
                placeholder="e.g., Complete Blood Count"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="testType">Test Type</Label>
              <Select value={newTest.testType} onValueChange={(value) => setNewTest({ ...newTest, testType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  {labTestTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={newTest.priority}
                onValueChange={(value: any) => setNewTest({ ...newTest, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddTest} className="w-full">Add</Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="testNotes">Notes</Label>
            <Textarea
              id="testNotes"
              value={newTest.notes}
              onChange={(e) => setNewTest({ ...newTest, notes: e.target.value })}
              placeholder="Additional notes for the lab"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ordered Tests</CardTitle>
          <CardDescription>Current lab tests in the order</CardDescription>
        </CardHeader>
        <CardContent>
          {tests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Test Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell className="font-medium">{test.testName}</TableCell>
                    <TableCell>{test.testType}</TableCell>
                    <TableCell className="capitalize">{test.priority}</TableCell>
                    <TableCell>{test.notes}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveTest(test.id)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-4">No tests ordered yet</p>
          )}
        </CardContent>
      </Card>

      <div className="flex space-x-4">
        <Button onClick={handleSubmit}>Submit Order</Button>
        <Button variant="outline">Save as Draft</Button>
      </div>
    </div>
  );
};

export default OrderLabTest;