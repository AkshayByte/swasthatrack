import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const UploadReport = () => {
  const [reportData, setReportData] = useState({
    patientName: '',
    testType: '',
    reportDetails: '',
    technician: 'Neha Singh',
    status: 'Completed'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setReportData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would upload the report
    console.log('Uploading report:', reportData);
    alert('Report uploaded successfully!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Lab Report</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="patientName">Patient Name</Label>
                <Input
                  id="patientName"
                  name="patientName"
                  value={reportData.patientName}
                  onChange={handleInputChange}
                  placeholder="Enter patient name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="testType">Test Type</Label>
                <Select name="testType" onValueChange={(value) => handleSelectChange('testType', value)} value={reportData.testType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select test type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cbc">Complete Blood Count</SelectItem>
                    <SelectItem value="lipid">Lipid Profile</SelectItem>
                    <SelectItem value="liver">Liver Function Test</SelectItem>
                    <SelectItem value="kidney">Kidney Function Test</SelectItem>
                    <SelectItem value="thyroid">Thyroid Function Test</SelectItem>
                    <SelectItem value="urine">Urine Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="reportDetails">Report Details</Label>
              <Textarea
                id="reportDetails"
                name="reportDetails"
                value={reportData.reportDetails}
                onChange={handleInputChange}
                placeholder="Enter report details and findings"
                rows={6}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="technician">Technician</Label>
                <Input
                  id="technician"
                  name="technician"
                  value={reportData.technician}
                  onChange={handleInputChange}
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select name="status" onValueChange={(value) => handleSelectChange('status', value)} value={reportData.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="review">Pending Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit">Upload Report</Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <p className="mb-4">Drag and drop your lab report file here, or click to browse</p>
            <Button variant="outline">Choose File</Button>
            <p className="mt-2 text-sm text-muted-foreground">Supported formats: PDF, DOC, DOCX, JPG, PNG</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadReport;