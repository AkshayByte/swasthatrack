import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import patientsAPI from '@/services/patientsAPI';
import encountersAPI, { Encounter } from '@/services/encountersAPI';
import { Patient } from '@/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const MyRecords = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // In a real app, this would come from auth context
        const patientId = '1';

        const [patientData, encountersData] = await Promise.all([
          patientsAPI.getPatientById(patientId),
          encountersAPI.getEncountersByPatientId(patientId)
        ]);

        setPatient(patientData);
        // Filter for completed encounters to show as history
        setEncounters(encountersData.filter(e => e.status === 'completed'));
        setError(null);
      } catch (err) {
        console.error('Error fetching records:', err);
        setError('Failed to load medical records.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <AlertDescription>{error || 'Patient record not found'}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Medical Records</h1>
        <p className="text-muted-foreground">View your complete medical history</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
          <CardDescription>All your past medical encounters and diagnoses</CardDescription>
        </CardHeader>
        <CardContent>
          {encounters.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Chief Complaint</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {encounters.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.type}</TableCell>
                    <TableCell>{record.diagnosis || 'N/A'}</TableCell>
                    <TableCell>{record.chiefComplaint}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-4">No medical history records found.</p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Allergies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {patient.allergies && patient.allergies.length > 0 ? (
                patient.allergies.map((allergy, index) => (
                  <Badge key={index} variant="destructive" className="mr-2 mb-2">{allergy}</Badge>
                ))
              ) : (
                <p className="text-muted-foreground">No known allergies</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Medical History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                patient.medicalHistory.map((history, index) => (
                  <Badge key={index} variant="secondary" className="mr-2 mb-2">{history}</Badge>
                ))
              ) : (
                <p className="text-muted-foreground">No medical history recorded</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blood Group</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patient.bloodGroup || 'Unknown'}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyRecords;