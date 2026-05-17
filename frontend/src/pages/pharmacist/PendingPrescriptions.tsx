import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMockData } from '@/contexts/MockDataContext';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const PendingPrescriptions = () => {
  const { prescriptions, dispenseMedicine } = useMockData();
  const { toast } = useToast();

  // Filter for active prescriptions
  const activePrescriptions = prescriptions.filter(p => p.status === 'active');

  const handleDispense = (id: string) => {
    try {
      dispenseMedicine(id);
      toast({
        title: "Medicine Dispensed",
        description: "Stock has been updated and prescription marked as completed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to dispense medicine.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Pending Prescriptions</h1>
        <p className="text-muted-foreground">Review and process pending prescriptions</p>
      </div>

      <Card className="card-premium">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Prescription Queue</CardTitle>
              <CardDescription>Prescriptions waiting to be processed</CardDescription>
            </div>
            <Badge variant="secondary">Total: {activePrescriptions.length}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Medicines</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activePrescriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-2">
                        <CheckCircle2 className="w-6 h-6 text-green-500/50" />
                      </div>
                      <p>No pending prescriptions</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                activePrescriptions.map((prescription) => (
                  <TableRow key={prescription.id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{prescription.patientName}</TableCell>
                    <TableCell>{prescription.doctorName || 'Dr. Arjun Mehta'}</TableCell>
                    <TableCell>{new Date(prescription.prescribedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {prescription.medicines.map((med: any, index: number) => (
                          <div key={index} className="text-sm flex items-center gap-2">
                            <span className="font-medium">{med.name || med.medicineName}</span>
                            <span className="text-muted-foreground text-xs">({med.dosage})</span>
                            <Badge variant="outline" className="text-[10px] h-4 px-1">Qty: {med.quantity || 1}</Badge>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-transparent">
                        {prescription.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => handleDispense(prescription.id)} className="btn-primary-gradient">
                        Dispense
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingPrescriptions;