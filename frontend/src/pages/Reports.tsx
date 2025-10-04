import { motion } from "framer-motion";
import { FileText, Download, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/StatCard";

const Reports = () => {
  const reports = [
    { title: "Monthly Medicine Distribution", type: "PDF", size: "2.5 MB", date: "2024-01-15" },
    { title: "Facility Compliance Report", type: "Excel", size: "1.8 MB", date: "2024-01-14" },
    { title: "Shipment Delays Analysis", type: "PDF", size: "3.2 MB", date: "2024-01-13" },
    { title: "Inventory Turnover Report", type: "PDF", size: "1.9 MB", date: "2024-01-12" },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground mt-1">Analytics and compliance reports</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Reports" value="156" icon={FileText} variant="info" />
        <StatCard title="This Month" value="24" icon={Calendar} variant="success" />
        <StatCard title="Downloads" value="892" icon={Download} variant="default" />
        <StatCard title="Compliance Score" value="94%" icon={TrendingUp} variant="success" />
      </div>

      <Card className="card-healthcare">
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{report.title}</h3>
                  <p className="text-sm text-muted-foreground">{report.type} • {report.size} • {report.date}</p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;