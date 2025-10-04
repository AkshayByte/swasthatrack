import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  variant = "default",
  className 
}: StatCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "border-success/20 bg-gradient-to-br from-card to-success/5";
      case "warning":
        return "border-warning/20 bg-gradient-to-br from-card to-warning/5";
      case "danger":
        return "border-danger/20 bg-gradient-to-br from-card to-danger/5";
      case "info":
        return "border-info/20 bg-gradient-to-br from-card to-info/5";
      default:
        return "border-primary/20 bg-gradient-to-br from-card to-primary/5";
    }
  };

  const getIconBg = () => {
    switch (variant) {
      case "success":
        return "bg-gradient-to-br from-success to-success/80";
      case "warning":
        return "bg-gradient-to-br from-warning to-warning/80";
      case "danger":
        return "bg-gradient-to-br from-danger to-danger/80";
      case "info":
        return "bg-gradient-to-br from-info to-info/80";
      default:
        return "bg-gradient-to-br from-primary to-primary/80";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className={cn("group", className)}
    >
      <Card className={cn(
        "card-stat border transition-all duration-300 hover:shadow-medium",
        getVariantStyles()
      )}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <motion.p 
                className="text-3xl font-bold text-foreground"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                {value}
              </motion.p>
              {change && (
                <div className="flex items-center space-x-1">
                  <span
                    className={cn(
                      "text-xs font-medium",
                      change.type === "increase"
                        ? "text-success"
                        : "text-danger"
                    )}
                  >
                    {change.type === "increase" ? "+" : "-"}
                    {Math.abs(change.value)}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    vs last month
                  </span>
                </div>
              )}
            </div>
            <motion.div
              className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center",
                getIconBg()
              )}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Icon className="w-6 h-6 text-white" />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;