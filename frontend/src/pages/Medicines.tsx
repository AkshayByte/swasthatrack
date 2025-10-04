import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Eye, Edit, Trash2, AlertTriangle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Table from "@/components/Table";
import StatCard from "@/components/StatCard";

const Medicines = () => {
  // Mock data for medicines
  const [medicines] = useState([
    {
      id: "MED001",
      name: "Paracetamol 500mg",
      category: "Analgesic",
      manufacturer: "Sun Pharma",
      batchNumber: "BT2024001",
      quantity: 50000,
      expiryDate: "2025-12-31",
      status: "active",
      location: "Warehouse A - Mumbai",
      price: 12.50,
      lastUpdated: "2024-01-15",
    },
    {
      id: "MED002",
      name: "Amoxicillin 250mg",
      category: "Antibiotic",
      manufacturer: "Cipla",
      batchNumber: "BT2024002",
      quantity: 25000,
      expiryDate: "2025-06-30",
      status: "low_stock",
      location: "Warehouse B - Delhi",
      price: 45.75,
      lastUpdated: "2024-01-14",
    },
    {
      id: "MED003",
      name: "Insulin Glargine",
      category: "Diabetes",
      manufacturer: "Biocon",
      batchNumber: "BT2024003",
      quantity: 15000,
      expiryDate: "2024-08-15",
      status: "expiring_soon",
      location: "Cold Storage - Bangalore",
      price: 125.00,
      lastUpdated: "2024-01-13",
    },
    {
      id: "MED004",
      name: "Atorvastatin 20mg",
      category: "Cardiovascular",
      manufacturer: "Dr. Reddy's",
      batchNumber: "BT2024004",
      quantity: 75000,
      expiryDate: "2026-03-20",
      status: "active",
      location: "Warehouse C - Chennai",
      price: 28.90,
      lastUpdated: "2024-01-15",
    },
    {
      id: "MED005",
      name: "Salbutamol Inhaler",
      category: "Respiratory",
      manufacturer: "GSK",
      batchNumber: "BT2024005",
      quantity: 8000,
      expiryDate: "2025-09-10",
      status: "low_stock",
      location: "Warehouse D - Hyderabad",
      price: 85.20,
      lastUpdated: "2024-01-12",
    },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="text-xs bg-success text-success-foreground">Active</Badge>;
      case "low_stock":
        return <Badge className="text-xs bg-warning text-warning-foreground">Low Stock</Badge>;
      case "expiring_soon":
        return <Badge variant="destructive" className="text-xs">Expiring Soon</Badge>;
      case "expired":
        return <Badge variant="destructive" className="text-xs">Expired</Badge>;
      case "out_of_stock":
        return <Badge variant="destructive" className="text-xs">Out of Stock</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">Unknown</Badge>;
    }
  };

  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (daysUntilExpiry < 0) {
      return <Badge variant="destructive">Expired</Badge>;
    } else if (daysUntilExpiry < 30) {
      return <Badge className="bg-warning text-warning-foreground">Expires in {daysUntilExpiry} days</Badge>;
    } else if (daysUntilExpiry < 90) {
      return <Badge variant="secondary">Expires in {Math.ceil(daysUntilExpiry / 30)} months</Badge>;
    }
    return <Badge className="bg-success text-success-foreground">Good</Badge>;
  };

  const columns = [
    {
      key: "name",
      title: "Medicine Name",
      sortable: true,
      render: (value: string, row: any) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-xs text-muted-foreground">ID: {row.id}</p>
        </div>
      ),
    },
    {
      key: "category",
      title: "Category",
      sortable: true,
      render: (value: string) => (
        <Badge variant="outline" className="text-xs">
          {value}
        </Badge>
      ),
    },
    {
      key: "manufacturer",
      title: "Manufacturer",
      sortable: true,
    },
    {
      key: "batchNumber",
      title: "Batch",
      sortable: true,
      render: (value: string) => (
        <code className="text-xs bg-muted px-2 py-1 rounded">{value}</code>
      ),
    },
    {
      key: "quantity",
      title: "Quantity",
      sortable: true,
      render: (value: number) => (
        <span className="font-medium">{value.toLocaleString()}</span>
      ),
    },
    {
      key: "expiryDate",
      title: "Expiry",
      sortable: true,
      render: (value: string) => (
        <div>
          <p className="text-sm">{new Date(value).toLocaleDateString()}</p>
          {getExpiryStatus(value)}
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
      key: "price",
      title: "Price (₹)",
      sortable: true,
      render: (value: number) => (
        <span className="font-medium">₹{value.toFixed(2)}</span>
      ),
    },
  ];

  const handleAction = (action: string, medicine: any) => {
    console.log(`${action} medicine:`, medicine);
  };

  const actions = (row: any) => (
    <>
      <DropdownMenuItem onClick={() => handleAction("view", row)}>
        <Eye className="w-4 h-4 mr-2" />
        View Details
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => handleAction("edit", row)}>
        <Edit className="w-4 h-4 mr-2" />
        Edit
      </DropdownMenuItem>
      <DropdownMenuItem 
        onClick={() => handleAction("delete", row)}
        className="text-destructive"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete
      </DropdownMenuItem>
    </>
  );

  // Calculate statistics
  const totalMedicines = medicines.length;
  const lowStockCount = medicines.filter(m => m.status === "low_stock").length;
  const expiringSoonCount = medicines.filter(m => m.status === "expiring_soon").length;
  const totalValue = medicines.reduce((sum, m) => sum + (m.quantity * m.price), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Medicines</h1>
          <p className="text-muted-foreground mt-1">
            Manage pharmaceutical inventory and track medicine batches
          </p>
        </div>
        <Button className="btn-healthcare">
          <Plus className="w-4 h-4 mr-2" />
          Add Medicine
        </Button>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Medicines"
          value={totalMedicines.toLocaleString()}
          icon={Calendar}
          variant="info"
        />
        <StatCard
          title="Low Stock Alerts"
          value={lowStockCount}
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard
          title="Expiring Soon"
          value={expiringSoonCount}
          icon={Calendar}
          variant="danger"
        />
        <StatCard
          title="Total Value"
          value={`₹${(totalValue / 1000000).toFixed(1)}M`}
          icon={Calendar}
          variant="success"
        />
      </div>

      {/* Medicines Table */}
      <Table
        title="Medicine Inventory"
        columns={columns}
        data={medicines}
        searchable={true}
        exportable={true}
        actions={actions}
      />
    </div>
  );
};

export default Medicines;