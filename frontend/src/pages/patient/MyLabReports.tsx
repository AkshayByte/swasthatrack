import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import labAPI from '@/services/labAPI';
import { LabReport } from '@/types'; // Assuming LabReport type is exported
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const MyLabReports = () => {
  const [labReports, setLabReports] = useState<LabReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLabReports = async () => {
      try {
        setLoading(true);
        const patientId = '1'; // Default for demo
        const data = await labAPI.getLabReportsByPatientId(patientId);
        setLabReports(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching lab reports:', err);
        setError('Failed to load lab reports.');
      } finally {
        setLoading(false);
      }
    };

    fetchLabReports();
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
        <h1 className="text-3xl font-bold">My Lab Reports</h1>
        <p className="text-muted-foreground">View your laboratory test results</p>
      </div>

      {labReports.map((report) => (
        <Card key={report.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{report.testName}</CardTitle>
                <CardDescription>
                  Ordered on {report.orderedAt} by {report.orderedBy}
                </CardDescription>
              </div>
              <Badge variant={report.status === 'completed' ? 'default' : 'secondary'}>
                {report.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {report.results && report.results.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parameter</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Normal Range</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.results.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{result.parameter}</TableCell>
                      <TableCell>{result.value}</TableCell>
                      <TableCell>{result.unit}</TableCell>
                      <TableCell>{result.normalRange}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Results not available yet
              </p>
            )}
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline">Download Report</Button>
              {report.status === 'completed' && (
                <Button>View Detailed Report</Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {labReports.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No lab reports found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyLabReports;