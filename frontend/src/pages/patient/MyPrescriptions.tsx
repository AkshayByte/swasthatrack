import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import prescriptionsAPI from '@/services/prescriptionsAPI';
import { Prescription } from '@/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const MyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        const patientId = '1'; // Default for demo
        const data = await prescriptionsAPI.getPrescriptionsByPatientId(patientId);
        setPrescriptions(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching prescriptions:', err);
        setError('Failed to load prescriptions.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Prescriptions</h1>
        <p className="text-muted-foreground">View and manage your prescriptions</p>
      </div>

      {prescriptions.map((prescription) => (
        <Card key={prescription.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Prescription #{prescription.id}</CardTitle>
                <CardDescription>
                  Issued on {prescription.prescribedAt} by {prescription.prescribedBy}
                </CardDescription>
              </div>
              <div className="text-right">
                <Badge variant={prescription.status === 'active' ? 'default' : 'secondary'}>
                  {prescription.status}
                </Badge>
                {/* <p className="text-sm text-muted-foreground mt-1">
                  Valid until {prescription.validUntil}
                </p> */}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescription.medicines.map((medicine, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{medicine.name}</TableCell>
                    <TableCell>{medicine.dosage}</TableCell>
                    <TableCell>{medicine.frequency}</TableCell>
                    <TableCell>{medicine.duration}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline">Download</Button>
              {prescription.status === 'active' && (
                <Button>Get Medicines</Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {prescriptions.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No prescriptions found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyPrescriptions;