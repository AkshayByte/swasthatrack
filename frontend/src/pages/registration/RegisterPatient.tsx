import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMockData } from '@/contexts/MockDataContext';
import { useToast } from '@/components/ui/use-toast';

const RegisterPatient = () => {
  const { registerPatient, addToQueue } = useMockData();
  const { toast } = useToast();

  const [patientData, setPatientData] = useState({
    fullName: '',
    abhaId: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    emergencyContact: '',
    bloodGroup: '',
    allergies: '',
    medicalHistory: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPatientData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setPatientData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateAge = (dob: string) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1. Register the patient
      const newPatient = {
        id: '', // Will be assigned by backend
        name: patientData.fullName,
        age: calculateAge(patientData.dateOfBirth),
        gender: patientData.gender,
        phone: patientData.phone,
        email: patientData.email,
        address: patientData.address,
        registrationDate: new Date().toISOString().split('T')[0],
        registrationNumber: '', // Backend generates
        status: 'active',
        emergencyContact: patientData.emergencyContact,
        bloodGroup: patientData.bloodGroup,
        allergies: patientData.allergies ? [patientData.allergies] : [],
        medicalHistory: patientData.medicalHistory ? [patientData.medicalHistory] : []
      };

      // @ts-ignore - ID and Reg Num are handled by backend
      const registeredPatient = await registerPatient(newPatient);

      if (registeredPatient && registeredPatient.id) {
        // 2. Add to Queue using real ID
        addToQueue(
          registeredPatient.id.toString(),
          'D101',
          'Dr. Arjun Mehta',
          'New Registration Consultation',
          registeredPatient
        );

        toast({
          title: "Success",
          description: "Patient registered and added to queue.",
          variant: "default",
        });

        // Reset form
        setPatientData({
          fullName: '',
          abhaId: '',
          dateOfBirth: '',
          gender: '',
          phone: '',
          email: '',
          address: '',
          emergencyContact: '',
          bloodGroup: '',
          allergies: '',
          medicalHistory: ''
        });
      } else {
        throw new Error("Registration failed - no ID returned");
      }

    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to register patient.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="card-premium">
        <CardHeader>
          <CardTitle>Register New Patient</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={patientData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  required
                  className="bg-background/50"
                />
              </div>
              <div>
                <Label htmlFor="abhaId">ABHA ID</Label>
                <Input
                  id="abhaId"
                  name="abhaId"
                  value={patientData.abhaId}
                  onChange={handleInputChange}
                  placeholder="Enter ABHA ID"
                  required
                  className="bg-background/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={patientData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  className="bg-background/50"
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select name="gender" onValueChange={(value) => handleSelectChange('gender', value)} value={patientData.gender}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select name="bloodGroup" onValueChange={(value) => handleSelectChange('bloodGroup', value)} value={patientData.bloodGroup}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={patientData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  required
                  className="bg-background/50"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={patientData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className="bg-background/50"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={patientData.address}
                onChange={handleInputChange}
                placeholder="Enter full address"
                rows={3}
                required
                className="bg-background/50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  name="emergencyContact"
                  value={patientData.emergencyContact}
                  onChange={handleInputChange}
                  placeholder="Enter emergency contact"
                  className="bg-background/50"
                />
              </div>
              <div>
                <Label htmlFor="allergies">Known Allergies</Label>
                <Input
                  id="allergies"
                  name="allergies"
                  value={patientData.allergies}
                  onChange={handleInputChange}
                  placeholder="Enter known allergies"
                  className="bg-background/50"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="medicalHistory">Medical History</Label>
              <Textarea
                id="medicalHistory"
                name="medicalHistory"
                value={patientData.medicalHistory}
                onChange={handleInputChange}
                placeholder="Enter any relevant medical history"
                rows={3}
                className="bg-background/50"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="btn-primary-gradient">Register Patient</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPatient;