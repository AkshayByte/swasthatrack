import { motion } from "framer-motion";
import {
  Package,
  Truck,
  AlertTriangle,
  TrendingUp,
  Building2,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";
import StatCard from "@/components/StatCard";
import ChartCard from "@/components/ChartCard";
import { useAuth } from "@/hooks/useAuth";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const Dashboard = () => {
  const { user } = useAuth();
  
  // Mock data for charts
  const monthlyData = [
    { month: "Jan", deliveries: 1200, delays: 45 },
    { month: "Feb", deliveries: 1350, delays: 32 },
    { month: "Mar", deliveries: 1580, delays: 28 },
    { month: "Apr", deliveries: 1420, delays: 38 },
    { month: "May", deliveries: 1650, delays: 22 },
    { month: "Jun", deliveries: 1750, delays: 18 },
  ];

  const inventoryData = [
    { name: "Antibiotics", value: 35, fill: "#0ea5e9" },
    { name: "Painkillers", value: 25, fill: "#10b981" },
    { name: "Vaccines", value: 20, fill: "#f59e0b" },
    { name: "Cardio", value: 12, fill: "#ef4444" },
    { name: "Others", value: 8, fill: "#8b5cf6" },
  ];

  const facilityData = [
    { state: "Maharashtra", hospitals: 245, warehouses: 32 },
    { state: "Karnataka", hospitals: 198, warehouses: 28 },
    { state: "Tamil Nadu", hospitals: 220, warehouses: 35 },
    { state: "Delhi", hospitals: 180, warehouses: 22 },
    { state: "Gujarat", hospitals: 165, warehouses: 25 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Pharmaceutical Supply Chain Overview - Ayushman Bharat Digital Mission
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Last updated</p>
          <p className="font-medium">
            {new Date().toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title="Total Medicines"
            value="12,584"
            change={{ value: 12, type: "increase" }}
            icon={Package}
            variant="info"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            title="Active Shipments"
            value="1,247"
            change={{ value: 8, type: "increase" }}
            icon={Truck}
            variant="success"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard
            title="Pending Alerts"
            value="24"
            change={{ value: 15, type: "decrease" }}
            icon={AlertTriangle}
            variant="warning"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <StatCard
            title="Registered Facilities"
            value="2,856"
            change={{ value: 5, type: "increase" }}
            icon={Building2}
            variant="default"
          />
        </motion.div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <ChartCard
            title="Monthly Deliveries & Delays"
            description="Delivery performance over the last 6 months"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="deliveries"
                  name="Deliveries"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  dot={{ fill: "#0ea5e9", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#0ea5e9", strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="delays"
                  name="Delays"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#ef4444", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <ChartCard
            title="Medicine Categories"
            description="Distribution of medicine types in inventory"
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={inventoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {inventoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                  }}
                  formatter={(value) => [`${value} %`, 'Percentage']}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <ChartCard
            title="Facilities by State"
            description="Hospital and warehouse distribution across top states"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={facilityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="state" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                  }}
                  formatter={(value) => [`${value}`, 'Count']}
                />
                <Legend />
                <Bar dataKey="hospitals" name="Hospitals" fill="#0ea5e9" radius={[4, 4, 0, 0]} animationDuration={1500} />
                <Bar dataKey="warehouses" name="Warehouses" fill="#10b981" radius={[4, 4, 0, 0]} animationDuration={1500} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>

        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <StatCard
            title="System Uptime"
            value="99.8%"
            icon={CheckCircle}
            variant="success"
          />
          <StatCard
            title="Avg Response Time"
            value="240ms"
            icon={Clock}
            variant="info"
          />
          <StatCard
            title="Active Users"
            value="1,456"
            change={{ value: 18, type: "increase" }}
            icon={Users}
            variant="default"
          />
        </motion.div>
      </div>

      {/* Recent Activity */}
      <ChartCard title="Recent Activity" description="Latest system updates and alerts">
        <div className="space-y-4">
          {[
            {
              time: "2 mins ago",
              message: "Shipment MT2024001 delivered to AIIMS Delhi",
              type: "success",
            },
            {
              time: "15 mins ago",
              message: "Inventory alert: Paracetamol stock below threshold",
              type: "warning",
            },
            {
              time: "32 mins ago",
              message: "New facility registered: Primary Health Center, Pune",
              type: "info",
            },
            {
              time: "1 hour ago",
              message: "Batch verification completed for 245 medicine lots",
              type: "success",
            },
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  activity.type === "success"
                    ? "bg-success"
                    : activity.type === "warning"
                    ? "bg-warning"
                    : "bg-info"
                }`}
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.message}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
};

export default Dashboard;