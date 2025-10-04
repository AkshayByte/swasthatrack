import { useState } from "react";
import { motion } from "framer-motion";
import { Truck, MapPin, Clock, CheckCircle, AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Table from "@/components/Table";
import StatCard from "@/components/StatCard";
import ChartCard from "@/components/ChartCard";

const Shipments = () => {
  const [shipments] = useState([
    {
      id: "SH2024001",
      origin: "Mumbai Warehouse",
      destination: "AIIMS Delhi",
      medicines: ["Paracetamol", "Amoxicillin"],
      quantity: 5000,
      status: "in_transit",
      progress: 65,
      estimatedDelivery: "2024-01-18",
      driver: "Test Driver",
      vehicle: "MH-12-AB-1234",
      temperature: "2-8°C",
      trackingUpdates: [
        { time: "10:30 AM", location: "Mumbai", status: "Departed" },
        { time: "2:15 PM", location: "Pune", status: "In Transit" },
      ]
    },
    {
      id: "SH2024002",
      origin: "Delhi Warehouse",
      destination: "PGI Chandigarh",
      medicines: ["Insulin", "Metformin"],
      quantity: 2500,
      status: "delivered",
      progress: 100,
      estimatedDelivery: "2024-01-15",
      driver: "Amit Singh",
      vehicle: "DL-8C-XY-5678",
      temperature: "15-25°C",
      trackingUpdates: [
        { time: "9:00 AM", location: "Delhi", status: "Departed" },
        { time: "11:30 AM", location: "Panipat", status: "In Transit" },
        { time: "1:45 PM", location: "Chandigarh", status: "Delivered" },
      ]
    },
    {
      id: "SH2024003",
      origin: "Chennai Warehouse",
      destination: "Apollo Hospital",
      medicines: ["Atorvastatin", "Amlodipine"],
      quantity: 8000,
      status: "delayed",
      progress: 30,
      estimatedDelivery: "2024-01-20",
      driver: "Suresh Reddy",
      vehicle: "TN-09-CD-9012",
      temperature: "15-25°C",
      trackingUpdates: [
        { time: "8:00 AM", location: "Chennai", status: "Departed" },
        { time: "12:00 PM", location: "Bangalore", status: "Vehicle Breakdown" },
      ]
    },
    {
      id: "SH2024004",
      origin: "Bangalore Warehouse",
      destination: "Manipal Hospital",
      medicines: ["Salbutamol", "Prednisolone"],
      quantity: 3200,
      status: "pending",
      progress: 0,
      estimatedDelivery: "2024-01-19",
      driver: "Venkat Rao",
      vehicle: "KA-05-EF-3456",
      temperature: "15-25°C",
      trackingUpdates: []
    },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "in_transit":
        return (
          <Badge className="text-xs bg-info text-info-foreground">
            <Truck className="w-3 h-3 mr-1" />
            In Transit
          </Badge>
        );
      case "delivered":
        return (
          <Badge className="text-xs bg-success text-success-foreground">
            <CheckCircle className="w-3 h-3 mr-1" />
            Delivered
          </Badge>
        );
      case "delayed":
        return (
          <Badge className="text-xs bg-warning text-warning-foreground">
            <AlertCircle className="w-3 h-3 mr-1" />
            Delayed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive" className="text-xs">
            <AlertCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Unknown
          </Badge>
        );
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-success";
      case "in_transit": return "bg-info";
      case "delayed": return "bg-warning";
      default: return "bg-muted";
    }
  };

  const columns = [
    {
      key: "id",
      title: "Shipment ID",
      sortable: true,
      render: (value: string) => (
        <code className="text-sm bg-muted px-2 py-1 rounded font-medium">
          {value}
        </code>
      ),
    },
    {
      key: "origin",
      title: "Route",
      sortable: true,
      render: (value: string, row: any) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <MapPin className="w-3 h-3 mr-1 text-muted-foreground" />
            <span className="font-medium">{value}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="ml-4">→ {row.destination}</span>
          </div>
        </div>
      ),
    },
    {
      key: "medicines",
      title: "Medicines",
      render: (value: string[]) => (
        <div className="space-y-1">
          {value.slice(0, 2).map((medicine, index) => (
            <Badge key={index} variant="outline" className="text-xs mr-1">
              {medicine}
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
      key: "quantity",
      title: "Quantity",
      sortable: true,
      render: (value: number) => (
        <span className="font-medium">{value.toLocaleString()} units</span>
      ),
    },
    {
      key: "status",
      title: "Status",
      sortable: true,
      render: (value: string, row: any) => (
        <div className="space-y-2">
          {getStatusBadge(value)}
          {value === "in_transit" || value === "delayed" ? (
            <div className="w-full">
              <Progress 
                value={row.progress} 
                className={`h-2 ${getProgressColor(value)}`}
              />
              <span className="text-xs text-muted-foreground">
                {row.progress}% complete
              </span>
            </div>
          ) : null}
        </div>
      ),
    },
    {
      key: "estimatedDelivery",
      title: "ETA",
      sortable: true,
      render: (value: string) => (
        <div>
          <p className="text-sm font-medium">
            {new Date(value).toLocaleDateString()}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(value).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
      ),
    },
    {
      key: "driver",
      title: "Driver",
      render: (value: string, row: any) => (
        <div>
          <p className="text-sm font-medium">{value}</p>
          <p className="text-xs text-muted-foreground">{row.vehicle}</p>
        </div>
      ),
    },
    {
      key: "temperature",
      title: "Temp. Control",
      render: (value: string) => (
        <Badge variant="outline" className="text-xs">
          {value}
        </Badge>
      ),
    },
  ];

  const actions = (row: any) => (
    <>
      <DropdownMenuItem>
        <MapPin className="w-4 h-4 mr-2" />
        Track Shipment
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Truck className="w-4 h-4 mr-2" />
        View Details
      </DropdownMenuItem>
      <DropdownMenuItem>
        <AlertCircle className="w-4 h-4 mr-2" />
        Report Issue
      </DropdownMenuItem>
    </>
  );

  // Calculate statistics
  const totalShipments = shipments.length;
  const inTransitCount = shipments.filter(s => s.status === "in_transit").length;
  const delayedCount = shipments.filter(s => s.status === "delayed").length;
  const deliveredToday = shipments.filter(s => 
    s.status === "delivered" && 
    new Date(s.estimatedDelivery).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Shipments</h1>
          <p className="text-muted-foreground mt-1">
            Track pharmaceutical deliveries and logistics in real-time
          </p>
        </div>
        <Button className="btn-healthcare">
          <Plus className="w-4 h-4 mr-2" />
          New Shipment
        </Button>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Shipments"
          value={totalShipments}
          icon={Truck}
          variant="info"
        />
        <StatCard
          title="In Transit"
          value={inTransitCount}
          icon={Truck}
          variant="success"
        />
        <StatCard
          title="Delayed"
          value={delayedCount}
          icon={AlertCircle}
          variant="warning"
        />
        <StatCard
          title="Delivered Today"
          value={deliveredToday}
          icon={CheckCircle}
          variant="success"
        />
      </div>

      {/* Live Tracking Map Placeholder */}
      <ChartCard 
        title="Live Shipment Tracking" 
        description="Real-time location tracking of active shipments"
      >
        <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center border-2 border-dashed border-muted">
          <div className="text-center space-y-2">
            <MapPin className="w-12 h-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">Interactive map will be displayed here</p>
            <p className="text-sm text-muted-foreground">
              Showing {inTransitCount} active shipments
            </p>
          </div>
        </div>
      </ChartCard>

      {/* Shipments Table */}
      <Table
        title="All Shipments"
        columns={columns}
        data={shipments}
        searchable={true}
        exportable={true}
        actions={actions}
      />
    </div>
  );
};

export default Shipments;