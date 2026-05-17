import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const BatchTracking = () => {
  const [batches, setBatches] = useState([
    { id: 1, batchNumber: 'PARA001', medicine: 'Paracetamol 500mg', manufacturer: 'PharmaCorp', mfgDate: '2024-01-15', expDate: '2025-12-31', status: 'Active' },
    { id: 2, batchNumber: 'AMOX002', medicine: 'Amoxicillin 250mg', manufacturer: 'MediTech', mfgDate: '2024-02-20', expDate: '2025-11-30', status: 'Active' },
    { id: 3, batchNumber: 'IBUP003', medicine: 'Ibuprofen 200mg', manufacturer: 'HealthPlus', mfgDate: '2024-03-10', expDate: '2026-01-15', status: 'Active' },
    { id: 4, batchNumber: 'CETI004', medicine: 'Cetirizine 10mg', manufacturer: 'AllergyCare', mfgDate: '2024-04-05', expDate: '2025-10-20', status: 'Expired' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredBatches = batches.filter(batch => 
    batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.medicine.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <Badge variant="success">{status}</Badge>;
      case 'Expired':
        return <Badge variant="destructive">{status}</Badge>;
      case 'Recalled':
        return <Badge variant="warning">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Batch Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label htmlFor="search">Search Batches</Label>
            <Input
              id="search"
              placeholder="Search by batch number, medicine, or manufacturer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch Number</TableHead>
                <TableHead>Medicine</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead>Mfg Date</TableHead>
                <TableHead>Exp Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBatches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-medium">{batch.batchNumber}</TableCell>
                  <TableCell>{batch.medicine}</TableCell>
                  <TableCell>{batch.manufacturer}</TableCell>
                  <TableCell>{batch.mfgDate}</TableCell>
                  <TableCell>{batch.expDate}</TableCell>
                  <TableCell>{getStatusBadge(batch.status)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="mr-2">View Details</Button>
                    <Button variant="outline" size="sm">Track</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Batch Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Batch Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Batch Number:</span>
                  <span>PARA001</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Medicine:</span>
                  <span>Paracetamol 500mg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Manufacturer:</span>
                  <span>PharmaCorp</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Manufacturing Date:</span>
                  <span>2024-01-15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expiry Date:</span>
                  <span>2025-12-31</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span>{getStatusBadge('Active')}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Supply Chain Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Supplier:</span>
                  <span>Global Pharma Distributors</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Received Date:</span>
                  <span>2024-01-25</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity Received:</span>
                  <span>1000 units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Storage Location:</span>
                  <span>Shelf A-12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quality Certificate:</span>
                  <span>QC-2024-PARA001</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BatchTracking;