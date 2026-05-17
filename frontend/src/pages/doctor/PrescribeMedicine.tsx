import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useMockData } from '@/contexts/MockDataContext';
import { useToast } from '@/components/ui/use-toast';

const PrescribeMedicine = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { patients, createPrescription } = useMockData();
  const { toast } = useToast();

  const [patient, setPatient] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [medicines, setMedicines] = useState<any[]>([]);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });

  useEffect(() => {
    // Simulate fetching patient from context
    setLoading(true);
    const foundPatient = patients.find(p => p.id === id);

    if (foundPatient) {
      setPatient(foundPatient);
      setError(null);
    } else {
      // Fallback for demo if ID not found, just use the first one or show error
      // For smoother demo flow, if ID is '1' or undefined, use first patient
      if (!id || id === '1') {
        setPatient(patients[0]);
      } else {
        setError('Patient not found in local records.');
      }
    }
    setLoading(false);
  }, [id, patients]);

  const handleAddMedicine = () => {
    if (newMedicine.name && newMedicine.dosage) {
      setMedicines([
        ...medicines,
        {
          id: (medicines.length + 1).toString(),
          medicineId: `MED${Date.now()}`, // Mock ID
          medicineName: newMedicine.name,
          ...newMedicine
        }
      ]);
      setNewMedicine({
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
      });
    }
  };

  const handleRemoveMedicine = (id: string) => {
    setMedicines(medicines.filter(medicine => medicine.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return;

    try {
      createPrescription({
        patientId: patient.id,
        patientName: patient.name,
        medicines: medicines,
        notes: 'Prescribed via Doctor Dashboard'
      });

      toast({
        title: "Prescription Issued",
        description: `Prescription for ${patient.name} has been sent to pharmacy.`,
      });

      setMedicines([]);
      // Navigate back to queue or dashboard
      setTimeout(() => navigate('/dashboard/doctor/patient-queue'), 1500);

    } catch (err) {
      console.error('Error creating prescription:', err);
      toast({
        title: "Error",
        description: "Failed to submit prescription.",
        variant: "destructive"
      });
    }
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
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Prescribe Medicine</h1>
        <p className="text-muted-foreground">Create prescription for <span className="font-semibold text-primary">{patient.name}</span></p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="card-premium md:col-span-2">
          <CardHeader>
            <CardTitle>Add Medicine</CardTitle>
            <CardDescription>Add a new medicine to the prescription</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="medicineName">Medicine Name</Label>
                <Input
                  id="medicineName"
                  value={newMedicine.name}
                  onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                  placeholder="e.g., Paracetamol"
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  value={newMedicine.dosage}
                  onChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.target.value })}
                  placeholder="e.g., 500mg"
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Input
                  id="frequency"
                  value={newMedicine.frequency}
                  onChange={(e) => setNewMedicine({ ...newMedicine, frequency: e.target.value })}
                  placeholder="e.g., Twice daily"
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={newMedicine.duration}
                  onChange={(e) => setNewMedicine({ ...newMedicine, duration: e.target.value })}
                  placeholder="e.g., 5 days"
                  className="bg-background/50"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddMedicine} className="w-full btn-primary-gradient">Add</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructions">Special Instructions</Label>
              <Textarea
                id="instructions"
                value={newMedicine.instructions}
                onChange={(e) => setNewMedicine({ ...newMedicine, instructions: e.target.value })}
                placeholder="Special instructions for taking this medicine"
                rows={2}
                className="bg-background/50"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium md:col-span-2">
          <CardHeader>
            <CardTitle>Prescription Preview</CardTitle>
            <CardDescription>Current medicines in the prescription</CardDescription>
          </CardHeader>
          <CardContent>
            {medicines.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medicine</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Instructions</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medicines.map((medicine) => (
                    <TableRow key={medicine.id}>
                      <TableCell className="font-medium">{medicine.name}</TableCell>
                      <TableCell>{medicine.dosage}</TableCell>
                      <TableCell>{medicine.frequency}</TableCell>
                      <TableCell>{medicine.duration}</TableCell>
                      <TableCell>{medicine.instructions}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveMedicine(medicine.id)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                <p>No medicines added yet</p>
                <p className="text-sm">Use the form above to add medicines</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex space-x-4 justify-end">
        <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
        <Button onClick={handleSubmit} className="btn-primary-gradient px-8" disabled={medicines.length === 0}>
          Issue Prescription
        </Button>
      </div>
    </div>
  );
};

export default PrescribeMedicine;