import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import patientsAPI from '@/services/patientsAPI';
import { Patient } from '@/types';

const DiagnosisForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    diagnosis: '',
    symptoms: '',
    severity: 'low',
    notes: '',
    followUpRequired: false,
    followUpDate: ''
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Diagnosis submitted:', {
      patientId: id,
      diagnosis: formData.diagnosis,
      symptoms: formData.symptoms,
      severity: formData.severity,
      notes: formData.notes,
      followUpRequired: formData.followUpRequired,
      followUpDate: formData.followUpDate,
    });
    navigate('/dashboard/doctor/patient-queue');
  };

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
        <h1 className="text-3xl font-bold">Diagnosis Form</h1>
        <p className="text-muted-foreground">Record diagnosis for <span className="font-semibold">{patient.name}</span></p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Diagnosis</CardTitle>
          <CardDescription>Fill in the diagnosis details for the patient</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Input
                id="diagnosis"
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                placeholder="Enter diagnosis"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="symptoms">Symptoms</Label>
              <Textarea
                id="symptoms"
                value={formData.symptoms}
                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                placeholder="List patient symptoms"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select value={formData.severity} onValueChange={(value) => setFormData({ ...formData, severity: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional notes or observations"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="followUp"
                checked={formData.followUpRequired}
                onCheckedChange={(checked) => setFormData({ ...formData, followUpRequired: checked as boolean })}
              />
              <Label htmlFor="followUp">Follow-up required</Label>
            </div>

            {formData.followUpRequired && (
              <div className="space-y-2">
                <Label htmlFor="followUpDate">Follow-up Date</Label>
                <Input
                  id="followUpDate"
                  type="date"
                  value={formData.followUpDate}
                  onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                  required={formData.followUpRequired}
                />
              </div>
            )}

            <div className="flex space-x-4">
              <Button type="submit">Save Diagnosis</Button>
              <Button type="button" variant="outline">Save as Draft</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiagnosisForm;