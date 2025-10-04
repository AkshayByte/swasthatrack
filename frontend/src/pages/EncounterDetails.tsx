import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Link, Share2, Eye, Calendar, User, Pill, FileText, ExternalLink, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

type Encounter = {
  id: string;
  patientAbhaAddress: string;
  patientName: string;
  diagnosis: string;
  consultationNotes: string;
  medicines: Array<{
    id: string;
    name: string;
    quantity: number;
    dosage: string;
  }>;
  encounterDate: string;
  status: 'active' | 'linked' | 'shared';
  isLinked: boolean;
};

type SharingHistory = {
  id: string;
  hiuName: string;
  hiuId: string;
  sharedAt: string;
  purpose: string;
  status: 'completed' | 'pending' | 'failed';
};

const EncounterDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [encounter, setEncounter] = useState<Encounter | null>(null);
  const [isLinking, setIsLinking] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  // Mock sharing history - replace with real API call
  const [sharingHistory] = useState<SharingHistory[]>([
    {
      id: 'share-001',
      hiuName: 'City General Hospital',
      hiuId: 'HIU-001',
      sharedAt: '2024-01-15T10:30:00Z',
      purpose: 'Continuity of Care',
      status: 'completed'
    },
    {
      id: 'share-002',
      hiuName: 'Specialist Clinic',
      hiuId: 'HIU-002',
      sharedAt: '2024-01-14T14:20:00Z',
      purpose: 'Second Opinion',
      status: 'completed'
    }
  ]);

  // Mock encounter data - replace with real API call
  useEffect(() => {
    if (id) {
      // Simulate API call
      const mockEncounter: Encounter = {
        id: id,
        patientAbhaAddress: 'john.doe@abdm',
        patientName: 'John Doe',
        diagnosis: 'Hypertension',
        consultationNotes: 'Patient presented with elevated blood pressure readings. Blood pressure was 160/100 mmHg. Patient reports occasional headaches and fatigue. Prescribed medication and lifestyle modifications including reduced salt intake and regular exercise. Follow-up scheduled in 2 weeks.',
        medicines: [
          { id: 'med-001', name: 'Amlodipine', quantity: 30, dosage: '5mg daily' },
          { id: 'med-002', name: 'Lisinopril', quantity: 30, dosage: '10mg daily' }
        ],
        encounterDate: '2024-01-15',
        status: 'linked',
        isLinked: true
      };
      setEncounter(mockEncounter);
    }
  }, [id]);

  const handleHIPLinking = async () => {
    setIsLinking(true);
    
    try {
      // Mock API call for HIP-initiated linking
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      setEncounter(prev => prev ? { ...prev, isLinked: true, status: 'linked' } : null);
      
      toast({
        title: "Success",
        description: "Successfully linked to patient's ABHA account"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to link to ABHA account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLinking(false);
    }
  };

  const getStatusBadge = (status: Encounter['status']) => {
    const variants = {
      active: 'default',
      linked: 'secondary',
      shared: 'outline'
    } as const;
    
    const labels = {
      active: 'Active',
      linked: 'Linked',
      shared: 'Shared'
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const getSharingStatusBadge = (status: SharingHistory['status']) => {
    const variants = {
      completed: 'default',
      pending: 'secondary',
      failed: 'destructive'
    } as const;
    
    const labels = {
      completed: 'Completed',
      pending: 'Pending',
      failed: 'Failed'
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  if (!encounter) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Loading encounter...</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
            <h2 className="text-2xl font-bold">Encounter Details</h2>
            <p className="text-sm text-muted-foreground">Patient: {encounter.patientName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(encounter.status)}
          {!encounter.isLinked && (
            <Button
              onClick={handleHIPLinking}
              disabled={isLinking}
              className="btn-healthcare"
            >
              {isLinking ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  Linking...
                </>
              ) : (
                <>
                  <Link className="w-4 h-4 mr-2" />
                  Link to Patient's ABHA
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Encounter Details</TabsTrigger>
          <TabsTrigger value="sharing">Sharing History</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
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
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Patient Name</p>
                  <p className="font-medium">{encounter.patientName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ABHA Address</p>
                  <p className="font-medium">{encounter.patientAbhaAddress}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Encounter Date</p>
                  <p className="font-medium">{new Date(encounter.encounterDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  {getStatusBadge(encounter.status)}
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
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Diagnosis</p>
                <p className="font-medium">{encounter.diagnosis}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Consultation Notes</p>
                <p className="whitespace-pre-wrap">{encounter.consultationNotes}</p>
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
            <CardContent>
              <div className="space-y-3">
                {encounter.medicines.map((medicine) => (
                  <div key={medicine.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Pill className="w-4 h-4 text-primary" />
                      <div>
                        <p className="font-medium">{medicine.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {medicine.quantity} units • {medicine.dosage}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sharing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Sharing History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sharingHistory.length > 0 ? (
                <div className="space-y-4">
                  {sharingHistory.map((share) => (
                    <motion.div
                      key={share.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Share2 className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{share.hiuName}</p>
                            <p className="text-sm text-muted-foreground">ID: {share.hiuId}</p>
                          </div>
                          {getSharingStatusBadge(share.status)}
                        </div>
                        <div className="ml-11 space-y-1">
                          <p className="text-sm">
                            <span className="text-muted-foreground">Purpose:</span> {share.purpose}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(share.sharedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Shared Data
                      </Button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Share2 className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No sharing history</h3>
                  <p className="text-muted-foreground">This encounter hasn't been shared with any HIU yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EncounterDetails;
