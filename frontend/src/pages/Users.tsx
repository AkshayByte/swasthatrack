import { useState } from "react";
import { motion } from "framer-motion";
import { Users as UsersIcon, Shield, UserCheck, UserX, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Table from "@/components/Table";
import StatCard from "@/components/StatCard";

const Users = () => {
  const [users] = useState([
    {
      id: "USR001",
      name: "Test User",
      email: "rajesh.kumar@abdm.gov.in",
      role: "Admin",
      department: "Healthcare Authority",
      status: "active",
      lastLogin: "2024-01-15 09:30 AM",
      permissions: ["Full Access", "User Management", "System Config"],
      phone: "+91-98765-43210",
      location: "New Delhi",
      avatar: null,
    },
    {
      id: "USR002", 
      name: "Dr. Priya Sharma",
      email: "priya.sharma@abdm.gov.in",
      role: "Supervisor",
      department: "Medicine Tracking",
      status: "active", 
      lastLogin: "2024-01-15 08:45 AM",
      permissions: ["View Reports", "Track Shipments", "Manage Inventory"],
      phone: "+91-98765-43211",
      location: "Mumbai",
      avatar: null,
    },
    {
      id: "USR003",
      name: "Mr. Amit Singh",
      email: "amit.singh@abdm.gov.in", 
      role: "Analyst",
      department: "Data Analytics",
      status: "active",
      lastLogin: "2024-01-14 06:20 PM",
      permissions: ["View Dashboard", "Generate Reports", "Export Data"],
      phone: "+91-98765-43212",
      location: "Bangalore",
      avatar: null,
    },
    {
      id: "USR004",
      name: "Ms. Sunita Reddy",
      email: "sunita.reddy@abdm.gov.in",
      role: "Operator",
      department: "Facility Management", 
      status: "inactive",
      lastLogin: "2024-01-10 02:15 PM",
      permissions: ["View Facilities", "Update Status"],
      phone: "+91-98765-43213",
      location: "Chennai",
      avatar: null,
    },
    {
      id: "USR005",
      name: "Dr. Mohan Das",
      email: "mohan.das@abdm.gov.in",
      role: "Supervisor", 
      department: "Quality Control",
      status: "active",
      lastLogin: "2024-01-15 11:10 AM",
      permissions: ["Quality Audits", "Compliance Reports", "Batch Verification"],
      phone: "+91-98765-43214",
      location: "Hyderabad",
      avatar: null,
    },
  ]);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Admin":
        return <Badge className="text-xs bg-danger text-danger-foreground">Admin</Badge>;
      case "Supervisor":
        return <Badge className="text-xs bg-warning text-warning-foreground">Supervisor</Badge>;
      case "Analyst":
        return <Badge className="text-xs bg-info text-info-foreground">Analyst</Badge>;
      case "Operator":
        return <Badge variant="outline" className="text-xs">Operator</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="text-xs bg-success text-success-foreground">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary" className="text-xs">Inactive</Badge>;
      case "suspended":
        return <Badge variant="destructive" className="text-xs">Suspended</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">Unknown</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const columns = [
    {
      key: "name",
      title: "User",
      sortable: true,
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={row.avatar} alt={value} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {getInitials(value)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{value}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      title: "Role",
      sortable: true,
      render: (value: string, row: any) => (
        <div>
          {getRoleBadge(value)}
          <p className="text-xs text-muted-foreground mt-1">{row.department}</p>
        </div>
      ),
    },
    {
      key: "permissions",
      title: "Permissions",
      render: (value: string[]) => (
        <div className="space-y-1">
          {value.slice(0, 2).map((permission, index) => (
            <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
              {permission}
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
      key: "location",
      title: "Location",
      sortable: true,
      render: (value: string, row: any) => (
        <div>
          <p className="text-sm font-medium">{value}</p>
          <p className="text-xs text-muted-foreground">{row.phone}</p>
        </div>
      ),
    },
    {
      key: "lastLogin",
      title: "Last Login",
      sortable: true,
      render: (value: string) => (
        <div>
          <p className="text-sm">{value.split(" ")[0]}</p>
          <p className="text-xs text-muted-foreground">{value.split(" ").slice(1).join(" ")}</p>
        </div>
      ),
    },
  ];

  const actions = (row: any) => (
    <>
      <DropdownMenuItem>
        <UserCheck className="w-4 h-4 mr-2" />
        View Profile
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Shield className="w-4 h-4 mr-2" />
        Edit Permissions
      </DropdownMenuItem>
      {row.status === "active" ? (
        <DropdownMenuItem className="text-warning">
          <UserX className="w-4 h-4 mr-2" />
          Suspend User
        </DropdownMenuItem>
      ) : (
        <DropdownMenuItem className="text-success">
          <UserCheck className="w-4 h-4 mr-2" />
          Activate User
        </DropdownMenuItem>
      )}
    </>
  );

  // Calculate statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === "active").length;
  const adminUsers = users.filter(u => u.role === "Admin").length;
  const inactiveUsers = users.filter(u => u.status === "inactive").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground mt-1">
            Manage healthcare authority staff and access permissions
          </p>
        </div>
        <Button className="btn-healthcare">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={UsersIcon}
          variant="info"
        />
        <StatCard
          title="Active Users"
          value={activeUsers}
          icon={UserCheck}
          variant="success"
        />
        <StatCard
          title="Administrators"
          value={adminUsers}
          icon={Shield}
          variant="danger"
        />
        <StatCard
          title="Inactive"
          value={inactiveUsers}
          icon={UserX}
          variant="warning"
        />
      </div>

      {/* Users Table */}
      <Table
        title="System Users"
        columns={columns}
        data={users}
        searchable={true}
        exportable={true}
        actions={actions}
      />
    </div>
  );
};

export default Users;