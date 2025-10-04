import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Calendar, User, Pill } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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

const Encounters = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'linked' | 'shared'>('all');

  // Mock data - replace with real API calls
  const [encounters] = useState<Encounter[]>([
    {
      id: 'enc-001',
      patientAbhaAddress: 'john.doe@abdm',
      patientName: 'John Doe',
      diagnosis: 'Hypertension',
      consultationNotes: 'Patient presented with elevated blood pressure. Prescribed medication and lifestyle modifications.',
      medicines: [
        { id: 'med-001', name: 'Amlodipine', quantity: 30, dosage: '5mg daily' },
        { id: 'med-002', name: 'Lisinopril', quantity: 30, dosage: '10mg daily' }
      ],
      encounterDate: '2024-01-15',
      status: 'linked',
      isLinked: true
    },
    {
      id: 'enc-002',
      patientAbhaAddress: 'jane.smith@abdm',
      patientName: 'Jane Smith',
      diagnosis: 'Type 2 Diabetes',
      consultationNotes: 'Follow-up consultation for diabetes management. Blood sugar levels improved.',
      medicines: [
        { id: 'med-003', name: 'Metformin', quantity: 60, dosage: '500mg twice daily' }
      ],
      encounterDate: '2024-01-14',
      status: 'active',
      isLinked: false
    }
  ]);

  const filteredEncounters = encounters.filter(encounter => {
    const matchesSearch = encounter.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         encounter.patientAbhaAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         encounter.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || encounter.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Patient Encounters</h2>
          <p className="text-sm text-muted-foreground">Manage patient health records and care contexts</p>
        </div>
        <Button onClick={() => navigate('/encounters/new')} className="btn-healthcare">
          <Plus className="w-4 h-4 mr-2" />
          New Encounter
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by patient name, ABHA address, or diagnosis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('active')}
              >
                Active
              </Button>
              <Button
                variant={filterStatus === 'linked' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('linked')}
              >
                Linked
              </Button>
              <Button
                variant={filterStatus === 'shared' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('shared')}
              >
                Shared
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Encounters List */}
      <div className="grid gap-4">
        {filteredEncounters.map((encounter, index) => (
          <motion.div
            key={encounter.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/encounters/${encounter.id}`)}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{encounter.patientName}</h3>
                        <p className="text-sm text-muted-foreground">{encounter.patientAbhaAddress}</p>
                      </div>
                      {getStatusBadge(encounter.status)}
                    </div>
                    
                    <div>
                      <p className="font-medium text-sm">Diagnosis: {encounter.diagnosis}</p>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {encounter.consultationNotes}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(encounter.encounterDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Pill className="w-4 h-4" />
                        {encounter.medicines.length} medicine{encounter.medicines.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {filteredEncounters.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No encounters found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Create your first patient encounter to get started'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Button onClick={() => navigate('/encounters/new')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Encounter
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Encounters;