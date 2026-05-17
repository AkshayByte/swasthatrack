import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useMockData } from '@/contexts/MockDataContext';
import { useToast } from '@/components/ui/use-toast';

const DispenseMedicine = () => {
  const { prescriptions, dispenseMedicine } = useMockData();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState<any | null>(null);
  const [dispensedQuantities, setDispensedQuantities] = useState<{ [key: string]: number }>({});

  // Filter prescriptions based on search
  const filteredPrescriptions = prescriptions.filter(p =>
    (p.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    p.status === 'active'
  );

  const handleSelectPrescription = (prescription: any) => {
    setSelectedPrescription(prescription);
    // Initialize dispensed quantities
    const initialQuantities: { [key: string]: number } = {};
    prescription.medicines.forEach((med: any) => {
      // Use medicineId or name as key, ensuring uniqueness
      const key = med.medicineId || med.name || med.medicineName;
      initialQuantities[key] = 0;
    });
    setDispensedQuantities(initialQuantities);
  };

  const handleDispenseChange = (medicineKey: string, quantity: number) => {
    setDispensedQuantities(prev => ({
      ...prev,
      [medicineKey]: quantity
    }));
  };

  const handleCompleteDispensing = () => {
    if (!selectedPrescription) return;

    try {
      dispenseMedicine(selectedPrescription.id);
      toast({
        title: "Success",
        description: "Prescription dispensed successfully.",
      });
      setSelectedPrescription(null);
      setDispensedQuantities({});
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to dispense prescription.",
        variant: "destructive"
      });
    }
  };

  const isDispensingComplete = () => {
    if (!selectedPrescription) return false;
    return selectedPrescription.medicines.every((med: any) => {
      const key = med.medicineId || med.name || med.medicineName;
      const dispensed = dispensedQuantities[key] || 0;
      const required = med.quantity || 1; // Default to 1 if not specified
      return dispensed >= required;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Dispense Medicine</h1>
        <p className="text-muted-foreground">Process and dispense prescribed medications</p>
      </div>

      {!selectedPrescription ? (
        <Card className="card-premium">
          <CardHeader>
            <CardTitle>Find Prescription</CardTitle>
            <CardDescription>Search for a prescription by patient name or ID</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Search by patient name or prescription ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-background/50"
              />
              <Button className="btn-primary-gradient">Search</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrescriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No active prescriptions found matching "{searchTerm}"
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPrescriptions.map((prescription) => (
                    <TableRow key={prescription.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{prescription.patientName}</TableCell>
                      <TableCell>{prescription.doctorName || 'Dr. Arjun Mehta'}</TableCell>
                      <TableCell>{new Date(prescription.prescribedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleSelectPrescription(prescription)}
                          className="btn-primary-gradient"
                        >
                          Select
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card className="card-premium">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Dispense Medicines</CardTitle>
                <CardDescription>
                  Prescription for <span className="font-semibold text-primary">{selectedPrescription.patientName}</span>
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => setSelectedPrescription(null)}>
                Back to Search
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-lg">
              <div>
                <Label className="text-muted-foreground">Patient</Label>
                <p className="font-medium text-lg">{selectedPrescription.patientName}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Prescription ID</Label>
                <p className="font-mono">{selectedPrescription.id}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Doctor</Label>
                <p>{selectedPrescription.doctorName || 'Dr. Arjun Mehta'}</p>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Prescribed Qty</TableHead>
                  <TableHead>Dispensed Qty</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedPrescription.medicines.map((medicine: any, index: number) => {
                  const key = medicine.medicineId || medicine.name || medicine.medicineName;
                  const dispensed = dispensedQuantities[key] || 0;
                  const required = medicine.quantity || 1;

                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{medicine.name || medicine.medicineName}</TableCell>
                      <TableCell>{medicine.dosage}</TableCell>
                      <TableCell>{required}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max={required}
                          value={dispensed}
                          onChange={(e) => handleDispenseChange(key, parseInt(e.target.value) || 0)}
                          className="w-24 bg-background/50"
                        />
                      </TableCell>
                      <TableCell>
                        {dispensed >= required ? (
                          <Badge className="bg-green-500 hover:bg-green-600">Ready</Badge>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            <div className="flex justify-end space-x-4">
              <Button
                onClick={handleCompleteDispensing}
                className="btn-primary-gradient px-8"
                disabled={!isDispensingComplete()}
              >
                Complete Dispensing
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DispenseMedicine;