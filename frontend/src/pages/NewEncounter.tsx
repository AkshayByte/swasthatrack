import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, X, Save, User, Pill, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

type Medicine = {
  id: string;
  name: string;
  quantity: number;
  dosage: string;
};

const NewEncounter = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [patientAbhaAddress, setPatientAbhaAddress] = useState('');
  const [patientName, setPatientName] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [consultationNotes, setConsultationNotes] = useState('');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  
  // Medicine form state
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const [medicineQuantity, setMedicineQuantity] = useState('');
  const [medicineDosage, setMedicineDosage] = useState('');

  // Mock medicines data - replace with real API call
  const availableMedicines = [
    { id: 'med-001', name: 'Amlodipine', category: 'Cardiovascular' },
    { id: 'med-002', name: 'Lisinopril', category: 'Cardiovascular' },
    { id: 'med-003', name: 'Metformin', category: 'Diabetes' },
    { id: 'med-004', name: 'Omeprazole', category: 'Gastrointestinal' },
    { id: 'med-005', name: 'Paracetamol', category: 'Pain Relief' },
    { id: 'med-006', name: 'Ibuprofen', category: 'Pain Relief' }
  ];

  const addMedicine = () => {
    if (!selectedMedicine || !medicineQuantity || !medicineDosage) {
      toast({
        title: "Error",
        description: "Please fill in all medicine fields",
        variant: "destructive"
      });
      return;
    }

    const medicine = availableMedicines.find(m => m.id === selectedMedicine);
    if (!medicine) return;

    const newMedicine: Medicine = {
      id: Date.now().toString(),
      name: medicine.name,
      quantity: parseInt(medicineQuantity),
      dosage: medicineDosage
    };

    setMedicines([...medicines, newMedicine]);
    setSelectedMedicine('');
    setMedicineQuantity('');
    setMedicineDosage('');
  };

  const removeMedicine = (id: string) => {
    setMedicines(medicines.filter(m => m.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientAbhaAddress || !patientName || !diagnosis || !consultationNotes) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Mock API call - replace with real implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Patient encounter created successfully"
      });
      
      navigate('/encounters');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create encounter. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/encounters')}
          className="h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">New Patient Encounter</h2>
          <p className="text-sm text-muted-foreground">Create a new patient health record</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="abhaAddress">ABHA Address *</Label>
                <Input
                  id="abhaAddress"
                  placeholder="patient@abdm"
                  value={patientAbhaAddress}
                  onChange={(e) => setPatientAbhaAddress(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name *</Label>
                <Input
                  id="patientName"
                  placeholder="Enter patient name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clinical Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Clinical Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis *</Label>
              <Input
                id="diagnosis"
                placeholder="Enter diagnosis"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="consultationNotes">Consultation Notes *</Label>
              <Textarea
                id="consultationNotes"
                placeholder="Enter detailed consultation notes..."
                value={consultationNotes}
                onChange={(e) => setConsultationNotes(e.target.value)}
                rows={4}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Medicines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5" />
              Medicines Dispensed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Medicine Form */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Medicine</Label>
                <Select value={selectedMedicine} onValueChange={setSelectedMedicine}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select medicine" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMedicines.map((medicine) => (
                      <SelectItem key={medicine.id} value={medicine.id}>
                        <div className="flex flex-col">
                          <span>{medicine.name}</span>
                          <span className="text-xs text-muted-foreground">{medicine.category}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  placeholder="30"
                  value={medicineQuantity}
                  onChange={(e) => setMedicineQuantity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Dosage</Label>
                <Input
                  placeholder="5mg daily"
                  value={medicineDosage}
                  onChange={(e) => setMedicineDosage(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button
                  type="button"
                  onClick={addMedicine}
                  className="w-full"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>

            {/* Medicines List */}
            {medicines.length > 0 && (
              <div className="space-y-2">
                <Label>Added Medicines</Label>
                <div className="space-y-2">
                  {medicines.map((medicine) => (
                    <motion.div
                      key={medicine.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Pill className="w-4 h-4 text-primary" />
                        <div>
                          <p className="font-medium">{medicine.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {medicine.quantity} units • {medicine.dosage}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMedicine(medicine.id)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/encounters')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="btn-healthcare"
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Create Encounter
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewEncounter;
