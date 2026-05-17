import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle } from 'lucide-react';
import { useMockData } from '@/contexts/MockDataContext';

const PatientQueue = () => {
  const { queue } = useMockData();

  // Filter for waiting status if needed, or show all. For now showing all active queue entries.
  const activeQueue = queue.filter(entry => entry.status !== 'completed');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Patient Queue</h1>
          <p className="text-muted-foreground mt-1">Manage and view patients waiting for consultation</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1 bg-background/50 backdrop-blur-sm">
            Live Updates
          </Badge>
        </div>
      </div>

      <Card className="card-premium border-transparent overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Current Queue</CardTitle>
              <CardDescription>Patients waiting for consultation</CardDescription>
            </div>
            <Badge variant="secondary" className="px-3">
              Total: {activeQueue.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent border-b border-border/60">
                <TableHead className="w-[100px]">Queue No.</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Wait Time</TableHead>
                <TableHead>Check-in Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeQueue.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-2">
                        <AlertCircle className="w-6 h-6 text-muted-foreground/50" />
                      </div>
                      <p>No patients in the queue</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                activeQueue.map((patient, index) => (
                  <TableRow
                    key={patient.id}
                    className="group hover:bg-muted/30 transition-colors border-b border-border/40 last:border-0"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell className="font-semibold text-primary">
                      {patient.queueNumber}
                    </TableCell>
                    <TableCell className="font-medium">
                      {patient.patientName || 'Unknown'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {patient.patientPhone || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {patient.serviceType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${patient.priority === 'emergency' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-100' :
                          patient.priority === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 hover:bg-orange-100' :
                            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100'
                          } border-transparent shadow-none`}
                      >
                        {patient.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {patient.estimatedWaitTime} mins
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(patient.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" className="btn-primary-gradient opacity-90 hover:opacity-100">
                        Call Patient
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

export default PatientQueue;