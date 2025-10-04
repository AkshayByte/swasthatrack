import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Users, 
  Package, 
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Table from "@/components/Table";
import StatCard from "@/components/StatCard";
import ChartCard from "@/components/ChartCard";

const Facilities = () => {
  const [facilities] = useState([
    {
      id: "FAC001",
      name: "All Institute of Medical Sciences (AIIMS)",
      type: "hospital",
      location: "New Delhi",
      address: "Ansari Nagar, New Delhi - 110029",
      phone: "+91-11-2658-8500",
      capacity: "2,478 beds",
      specialties: ["Cardiology", "Neurology", "Oncology"],
      status: "active",
      lastInspection: "2024-01-10",
      certification: "Grade A",
      contact: "Dr. M. Srinivas",
      coordinates: { lat: 28.5672, lng: 77.2100 }
    },
    {
      id: "FAC002", 
      name: "Apollo Hospital",
      type: "hospital",
      location: "Chennai",
      address: "21, Greams Lane, Chennai - 600006",
      phone: "+91-44-2829-3333",
      capacity: "600 beds",
      specialties: ["Cardiac", "Transplant", "Cancer"],
      status: "active",
      lastInspection: "2024-01-08",
      certification: "Grade A",
      contact: "Dr. Prathap Reddy",
      coordinates: { lat: 13.0827, lng: 80.2707 }
    },
    {
      id: "FAC003",
      name: "Central Pharmaceutical Warehouse",
      type: "warehouse",
      location: "Mumbai",
      address: "MIDC Area, Andheri East, Mumbai - 400093",
      phone: "+91-22-2821-7000",
      capacity: "50,000 sq ft",
      specialties: ["Cold Storage", "General Storage", "Distribution"],
      status: "active", 
      lastInspection: "2024-01-12",
      certification: "Grade A",
      contact: "Mr. Ramesh Kumar",
      coordinates: { lat: 19.1136, lng: 72.8697 }
    },
    {
      id: "FAC004",
      name: "Primary Health Center",
      type: "clinic",
      location: "Pune",
      address: "Shivaji Nagar, Pune - 411005",
      phone: "+91-20-2553-2100",
      capacity: "50 beds",
      specialties: ["General Medicine", "Pediatrics"],
      status: "maintenance",
      lastInspection: "2024-01-05",
      certification: "Grade B",
      contact: "Dr. Sunita Sharma",
      coordinates: { lat: 18.5196, lng: 73.8553 }
    },
    {
      id: "FAC005",
      name: "Regional Drug Distribution Center",
      type: "distributor",
      location: "Bangalore",
      address: "Electronic City, Bangalore - 560100", 
      phone: "+91-80-2852-0000",
      capacity: "25,000 sq ft",
      specialties: ["Regional Distribution", "Quality Control"],
      status: "active",
      lastInspection: "2024-01-09",
      certification: "Grade A",
      contact: "Mr. Suresh Babu",
      coordinates: { lat: 12.9716, lng: 77.5946 }
    },
  ]);

  const getFacilityIcon = (type: string) => {
    switch (type) {
      case "hospital": return Building2;
      case "warehouse": return Package;
      case "clinic": return Users;
      case "distributor": return Package;
      default: return Building2;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="text-xs bg-success text-success-foreground">Active</Badge>;
      case "maintenance":
        return <Badge className="text-xs bg-warning text-warning-foreground">Maintenance</Badge>;
      case "inactive":
        return <Badge variant="destructive" className="text-xs">Inactive</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">Unknown</Badge>;
    }
  };

  const getCertificationBadge = (grade: string) => {
    switch (grade) {
      case "Grade A":
        return <Badge className="text-xs bg-success text-success-foreground">Grade A</Badge>;
      case "Grade B":
        return <Badge className="text-xs bg-warning text-warning-foreground">Grade B</Badge>;
      case "Grade C":
        return <Badge variant="destructive" className="text-xs">Grade C</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">Ungraded</Badge>;
    }
  };

  const columns = [
    {
      key: "name",
      title: "Facility Name",
      sortable: true,
      render: (value: string, row: any) => {
        const Icon = getFacilityIcon(row.type);
        return (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{value}</p>
              <p className="text-xs text-muted-foreground">ID: {row.id}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "type",
      title: "Type",
      sortable: true,
      render: (value: string) => (
        <Badge variant="outline" className="text-xs capitalize">
          {value}
        </Badge>
      ),
    },
    {
      key: "location",
      title: "Location",
      sortable: true,
      render: (value: string, row: any) => (
        <div>
          <div className="flex items-center">
            <MapPin className="w-3 h-3 mr-1 text-muted-foreground" />
            <span className="font-medium">{value}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {row.address.substring(0, 30)}...
          </p>
        </div>
      ),
    },
    {
      key: "capacity",
      title: "Capacity",
      sortable: true,
      render: (value: string) => (
        <span className="font-medium">{value}</span>
      ),
    },
    {
      key: "specialties",
      title: "Specialties",
      render: (value: string[]) => (
        <div className="space-y-1">
          {value.slice(0, 2).map((specialty, index) => (
            <Badge key={index} variant="outline" className="text-xs mr-1">
              {specialty}
            </Badge>
          ))}
          {value.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{value.length - 2} more
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "status",
      title: "Status",
      sortable: true,
      render: (value: string) => getStatusBadge(value),
    },
    {
      key: "certification",
      title: "Grade",
      sortable: true,
      render: (value: string) => getCertificationBadge(value),
    },
    {
      key: "contact",
      title: "Contact",
      render: (value: string, row: any) => (
        <div>
          <p className="text-sm font-medium">{value}</p>
          <div className="flex items-center text-xs text-muted-foreground">
            <Phone className="w-3 h-3 mr-1" />
            {row.phone}
          </div>
        </div>
      ),
    },
  ];

  const actions = (row: any) => (
    <>
      <DropdownMenuItem>
        <Eye className="w-4 h-4 mr-2" />
        View Details
      </DropdownMenuItem>
      <DropdownMenuItem>
        <MapPin className="w-4 h-4 mr-2" />
        View on Map
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Edit className="w-4 h-4 mr-2" />
        Edit Facility
      </DropdownMenuItem>
      <DropdownMenuItem className="text-destructive">
        <Trash2 className="w-4 h-4 mr-2" />
        Remove
      </DropdownMenuItem>
    </>
  );

  // Calculate statistics
  const totalFacilities = facilities.length;
  const hospitals = facilities.filter(f => f.type === "hospital").length;
  const warehouses = facilities.filter(f => f.type === "warehouse").length;
  const activeFacilities = facilities.filter(f => f.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Facilities</h1>
          <p className="text-muted-foreground mt-1">
            Manage hospitals, warehouses, and distribution centers
          </p>
        </div>
        <Button className="btn-healthcare">
          <Plus className="w-4 h-4 mr-2" />
          Add Facility
        </Button>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Facilities"
          value={totalFacilities}
          icon={Building2}
          variant="info"
        />
        <StatCard
          title="Hospitals"
          value={hospitals}
          icon={Building2}
          variant="success"
        />
        <StatCard
          title="Warehouses"
          value={warehouses}
          icon={Package}
          variant="default"
        />
        <StatCard
          title="Active"
          value={activeFacilities}
          icon={Building2}
          variant="success"
        />
      </div>

      {/* Map View */}
      <ChartCard 
        title="Facility Locations" 
        description="Geographic distribution of healthcare facilities"
      >
        <div className="h-96 bg-muted/20 rounded-lg flex items-center justify-center border-2 border-dashed border-muted">
          <div className="text-center space-y-2">
            <MapPin className="w-16 h-16 mx-auto text-muted-foreground" />
            <p className="text-lg font-medium text-muted-foreground">Interactive Map</p>
            <p className="text-sm text-muted-foreground">
              Showing {totalFacilities} facilities across India
            </p>
            <div className="flex items-center justify-center space-x-4 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="text-sm">Hospitals</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-info rounded-full"></div>
                <span className="text-sm">Warehouses</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <span className="text-sm">Distributors</span>
              </div>
            </div>
          </div>
        </div>
      </ChartCard>

      {/* Facilities Table */}
      <Table
        title="All Facilities"
        columns={columns}
        data={facilities}
        searchable={true}
        exportable={true}
        actions={actions}
      />
    </div>
  );
};

export default Facilities;