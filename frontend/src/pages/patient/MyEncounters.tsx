import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import encountersAPI, { Encounter } from '@/services/encountersAPI';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const MyEncounters = () => {
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEncounters = async () => {
      try {
        setLoading(true);
        const patientId = '1'; // Default for demo
        const data = await encountersAPI.getEncountersByPatientId(patientId);
        setEncounters(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching encounters:', err);
        setError('Failed to load encounters.');
      } finally {
        setLoading(false);
      }
    };

    fetchEncounters();
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
        <h1 className="text-3xl font-bold">My Encounters</h1>
        <p className="text-muted-foreground">View your medical appointments and visits</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {encounters.map((encounter) => (
          <Card key={encounter.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{encounter.doctorName}</CardTitle>
                  <CardDescription>{encounter.type}</CardDescription>
                </div>
                <Badge variant={encounter.status === 'completed' ? 'default' : 'secondary'}>
                  {encounter.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm text-muted-foreground">{encounter.date}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Chief Complaint</p>
                <p className="text-sm text-muted-foreground">{encounter.chiefComplaint}</p>
              </div>
              {encounter.diagnosis && (
                <div>
                  <p className="text-sm font-medium">Diagnosis</p>
                  <p className="text-sm text-muted-foreground">{encounter.diagnosis}</p>
                </div>
              )}
              <Button className="w-full" variant={encounter.status === 'scheduled' ? 'default' : 'outline'}>
                {encounter.status === 'scheduled' ? 'View Details' : 'View Report'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {encounters.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No encounters found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyEncounters;