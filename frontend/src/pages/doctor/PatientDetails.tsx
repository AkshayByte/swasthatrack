import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import patientsAPI from '@/services/patientsAPI';
import { Patient } from '@/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const PatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        // Default to ID '1' if no ID is provided in URL (for demo purposes)
        const patientId = id || '1';
        const data = await patientsAPI.getPatientById(patientId);
        setPatient(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching patient:', err);
        setError('Failed to load patient details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Patient Details</h1>
          <p className="text-muted-foreground">View and manage patient information</p>
        </div>
        <Button>Edit Patient Info</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Basic patient details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Name:</span>
              <span>{patient.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Age:</span>
              <span>{patient.age} years</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Gender:</span>
              <span>{patient.gender}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Phone:</span>
              <span>{patient.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Email:</span>
              <span>{patient.email || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Address:</span>
              <span>{patient.address}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Medical Information</CardTitle>
            <CardDescription>Health-related details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Blood Group:</span>
              <span>
                <Badge variant="secondary">{patient.bloodGroup || 'Unknown'}</Badge>
              </span>
            </div>
            <div>
              <span className="font-medium">Allergies:</span>
              <div className="mt-2 space-y-2">
                {patient.allergies && patient.allergies.length > 0 ? (
                  patient.allergies.map((allergy, index) => (
                    <Badge key={index} variant="destructive" className="mr-2">{allergy}</Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground">None known</span>
                )}
              </div>
            </div>
            <div>
              <span className="font-medium">Medical History:</span>
              <div className="mt-2 space-y-2">
                {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                  patient.medicalHistory.map((condition, index) => (
                    <Badge key={index} variant="outline" className="mr-2">{condition}</Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground">None recorded</span>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Registration Date:</span>
              <span>{patient.registrationDate}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
          <CardDescription>Person to contact in case of emergency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <span className="font-medium">Contact:</span>
            <span>{patient.emergencyContact}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientDetails;