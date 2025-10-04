import { useState } from "react";
import { motion } from "framer-motion";
import { Package, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";
import StatCard from "@/components/StatCard";
import ChartCard from "@/components/ChartCard";
import Table from "@/components/Table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Inventory = () => {
  const [inventoryData] = useState([
    {
      facilityId: "AIIMS_DEL",
      facilityName: "AIIMS Delhi",
      medicineCategory: "Antibiotics",
      totalStock: 15000,
      usedStock: 8500,
      remainingStock: 6500,
      stockLevel: 43,
      reorderLevel: 30,
      status: "good",
      lastUpdated: "2024-01-15",
    },
    {
      facilityId: "APOL_CHN",
      facilityName: "Apollo Chennai",
      medicineCategory: "Cardiovascular",
      totalStock: 12000,
      usedStock: 10800,
      remainingStock: 1200,
      stockLevel: 10,
      reorderLevel: 25,
      status: "critical",
      lastUpdated: "2024-01-15",
    },
    {
      facilityId: "PGIM_CHD",
      facilityName: "PGI Chandigarh",
      medicineCategory: "Diabetes",
      totalStock: 8000,
      usedStock: 5600,
      remainingStock: 2400,
      stockLevel: 30,
      reorderLevel: 25,
      status: "reorder",
      lastUpdated: "2024-01-14",
    },
    {
      facilityId: "MANI_BLR",
      facilityName: "Manipal Bangalore",
      medicineCategory: "Respiratory",
      totalStock: 6000,
      usedStock: 2400,
      remainingStock: 3600,
      stockLevel: 60,
      reorderLevel: 40,
      status: "good",
      lastUpdated: "2024-01-15",
    },
  ]);

  const categoryDistribution = [
    { name: "Antibiotics", value: 35, fill: "#0ea5e9" },
    { name: "Cardiovascular", value: 25, fill: "#10b981" },
    { name: "Diabetes", value: 20, fill: "#f59e0b" },
    { name: "Respiratory", value: 12, fill: "#ef4444" },
    { name: "Others", value: 8, fill: "#8b5cf6" },
  ];

  const facilitiesStock = [
    { facility: "AIIMS Delhi", inStock: 65, lowStock: 20, outOfStock: 5 },
    { facility: "Apollo Chennai", inStock: 45, lowStock: 35, outOfStock: 15 },
    { facility: "PGI Chandigarh", inStock: 55, lowStock: 30, outOfStock: 8 },
    { facility: "Manipal Bangalore", inStock: 70, lowStock: 18, outOfStock: 3 },
  ];

  const getStatusBadge = (status: string, stockLevel: number) => {
    switch (status) {
      case "good":
        return <Badge className="text-xs bg-success text-success-foreground">Good Stock</Badge>;
      case "reorder":
        return <Badge className="text-xs bg-warning text-warning-foreground">Reorder Soon</Badge>;
      case "critical":
        return <Badge variant="destructive" className="text-xs">Critical Low</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">Unknown</Badge>;
    }
  };

  const getStockLevelBar = (stockLevel: number, reorderLevel: number) => {
    let color = "bg-success";
    if (stockLevel <= reorderLevel / 2) {
      color = "bg-danger";
    } else if (stockLevel <= reorderLevel) {
      color = "bg-warning";
    }

    return (
      <div className="w-full space-y-1">
        <Progress value={stockLevel} className={`h-2 ${color}`} />
        <span className="text-xs text-muted-foreground">{stockLevel}%</span>
      </div>
    );
  };

  const columns = [
    {
      key: "facilityName",
      title: "Facility",
      sortable: true,
      render: (value: string, row: any) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-xs text-muted-foreground">ID: {row.facilityId}</p>
        </div>
      ),
    },
    {
      key: "medicineCategory",
      title: "Category",
      sortable: true,
      render: (value: string) => (
        <Badge variant="outline" className="text-xs">
          {value}
        </Badge>
      ),
    },
    {
      key: "totalStock",
      title: "Total Stock",
      sortable: true,
      render: (value: number) => (
        <span className="font-medium">{value.toLocaleString()} units</span>
      ),
    },
    {
      key: "remainingStock",
      title: "Available",
      sortable: true,
      render: (value: number, row: any) => (
        <div>
          <span className="font-medium text-success">
            {value.toLocaleString()} units
          </span>
          <p className="text-xs text-muted-foreground">
            Used: {row.usedStock.toLocaleString()}
          </p>
        </div>
      ),
    },
    {
      key: "stockLevel",
      title: "Stock Level",
      sortable: true,
      render: (value: number, row: any) => getStockLevelBar(value, row.reorderLevel),
    },
    {
      key: "status",
      title: "Status",
      sortable: true,
      render: (value: string, row: any) => getStatusBadge(value, row.stockLevel),
    },
    {
      key: "lastUpdated",
      title: "Last Updated",
      sortable: true,
      render: (value: string) => (
        <span className="text-sm">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
  ];

  // Calculate statistics
  const totalFacilities = inventoryData.length;
  const criticalStock = inventoryData.filter(item => item.status === "critical").length;
  const reorderNeeded = inventoryData.filter(item => item.status === "reorder").length;
  const totalMedicines = inventoryData.reduce((sum, item) => sum + item.totalStock, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory</h1>
          <p className="text-muted-foreground mt-1">
            Monitor medicine distribution across healthcare facilities
          </p>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Medicines"
          value={totalMedicines.toLocaleString()}
          icon={Package}
          variant="info"
        />
        <StatCard
          title="Facilities Tracked"
          value={totalFacilities}
          icon={Package}
          variant="success"
        />
        <StatCard
          title="Critical Stock"
          value={criticalStock}
          icon={AlertTriangle}
          variant="danger"
        />
        <StatCard
          title="Reorder Needed"
          value={reorderNeeded}
          icon={TrendingDown}
          variant="warning"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Medicine Category Distribution"
          description="Inventory breakdown by medicine categories"
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Stock Status by Facility"
          description="Comparison of stock levels across facilities"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={facilitiesStock}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="facility"
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(value) => value.split(" ")[0]}
              />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="inStock" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="lowStock" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
              <Bar dataKey="outOfStock" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Inventory Table */}
      <Table
        title="Facility Inventory Distribution"
        columns={columns}
        data={inventoryData}
        searchable={true}
        exportable={true}
      />
    </div>
  );
};

export default Inventory;