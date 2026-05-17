import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const MedicineInventory = () => {
  const [medicines, setMedicines] = useState([
    { id: 1, name: 'Paracetamol 500mg', quantity: 100, batch: 'PARA001', expiry: '2025-12-31' },
    { id: 2, name: 'Amoxicillin 250mg', quantity: 50, batch: 'AMOX002', expiry: '2025-11-30' },
    { id: 3, name: 'Ibuprofen 200mg', quantity: 75, batch: 'IBUP003', expiry: '2026-01-15' },
    { id: 4, name: 'Cetirizine 10mg', quantity: 30, batch: 'CETI004', expiry: '2025-10-20' },
  ]);

  const [newMedicine, setNewMedicine] = useState({
    name: '',
    quantity: '',
    batch: '',
    expiry: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMedicine(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMedicine = () => {
    if (newMedicine.name && newMedicine.quantity && newMedicine.batch && newMedicine.expiry) {
      const medicine = {
        id: medicines.length + 1,
        name: newMedicine.name,
        quantity: parseInt(newMedicine.quantity),
        batch: newMedicine.batch,
        expiry: newMedicine.expiry
      };
      setMedicines([...medicines, medicine]);
      setNewMedicine({ name: '', quantity: '', batch: '', expiry: '' });
    }
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    setMedicines(medicines.map(med => 
      med.id === id ? { ...med, quantity: parseInt(newQuantity) } : med
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Medicine Inventory Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <Label htmlFor="name">Medicine Name</Label>
              <Input
                id="name"
                name="name"
                value={newMedicine.name}
                onChange={handleInputChange}
                placeholder="Enter medicine name"
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={newMedicine.quantity}
                onChange={handleInputChange}
                placeholder="Enter quantity"
              />
            </div>
            <div>
              <Label htmlFor="batch">Batch Number</Label>
              <Input
                id="batch"
                name="batch"
                value={newMedicine.batch}
                onChange={handleInputChange}
                placeholder="Enter batch number"
              />
            </div>
            <div>
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                name="expiry"
                type="date"
                value={newMedicine.expiry}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <Button onClick={handleAddMedicine}>Add Medicine</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicine Name</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicines.map((medicine) => (
                <TableRow key={medicine.id}>
                  <TableCell>{medicine.name}</TableCell>
                  <TableCell>{medicine.batch}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={medicine.quantity}
                      onChange={(e) => handleUpdateQuantity(medicine.id, e.target.value)}
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>{medicine.expiry}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicineInventory;