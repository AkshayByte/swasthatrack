import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Context Providers
import AuthProvider from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { DashboardAuthProvider } from "./dashboards/shared/contexts/DashboardAuthContext";

// Components
import { ProtectedRoute } from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import { ProtectedDashboard } from "./dashboards/shared/components/ProtectedDashboard";

// Layouts
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Public Pages
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import RoleLogin from "./pages/RoleLogin";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import FAQ from "./pages/FAQ";
import DashboardSelection from "./pages/DashboardSelection";

// Main Dashboard
import UnifiedDashboard from "./pages/UnifiedDashboard";



// Doctor Pages
import PatientQueue from "./pages/doctor/PatientQueue";
import PatientDetails from "./pages/doctor/PatientDetails";
import DiagnosisForm from "./pages/doctor/DiagnosisForm";
import PrescribeMedicine from "./pages/doctor/PrescribeMedicine";
import OrderLabTest from "./pages/doctor/OrderLabTest";
import Encounters from "./pages/doctor/Encounters";

// Patient Pages
import MyRecords from "./pages/patient/MyRecords";
import MyPrescriptions from "./pages/patient/MyPrescriptions";
import MyLabReports from "./pages/patient/MyLabReports";
import MyEncounters from "./pages/patient/MyEncounters";
import Consent from "./pages/patient/Consent";

// Pharmacist Pages
import PendingPrescriptions from "./pages/pharmacist/PendingPrescriptions";
import DispenseMedicine from "./pages/pharmacist/DispenseMedicine";
import MedicineInventory from "./pages/pharmacist/MedicineInventory";
import BatchTracking from "./pages/pharmacist/BatchTracking";
import Shipments from "./pages/pharmacist/Shipments";
import GlobalInventory from "./pages/pharmacist/GlobalInventory";

// Laboratory Pages
import PendingTests from "./pages/laboratory/PendingTests";
import UploadReport from "./pages/laboratory/UploadReport";
import CompletedTests from "./pages/laboratory/CompletedTests";

// Registration Pages
import RegisterPatient from "./pages/registration/RegisterPatient";
import AddToQueue from "./pages/registration/AddToQueue";
import QueueList from "./pages/registration/QueueList";
import CheckIn from "./pages/registration/CheckIn";

// Shared Pages
import Profile from "./pages/shared/Profile";
import Settings from "./pages/shared/Settings";
import Reports from "./pages/shared/Reports";

// Admin Pages
import Users from "./pages/admin/Users";
import Facilities from "./pages/admin/Facilities";
import Monitoring from "./pages/admin/Monitoring";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

import { MockDataProvider } from "./contexts/MockDataContext";

// ... existing imports

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <DashboardAuthProvider>
            <MockDataProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    {/* ============================================ */}
                    {/* PUBLIC ROUTES */}
                    {/* ============================================ */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/contact-us" element={<ContactUs />} />
                    <Route path="/about-us" element={<AboutUs />} />
                    <Route path="/select-dashboard" element={<DashboardSelection />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />

                    {/* ============================================ */}
                    {/* AUTHENTICATION ROUTES */}
                    {/* ============================================ */}
                    <Route path="/login" element={<AuthLayout />}>
                      <Route index element={<Login />} />
                      <Route path=":role" element={<RoleLogin />} />
                    </Route>
                    <Route path="/register" element={<AuthLayout />}>
                      <Route index element={<Register />} />
                    </Route>

                    {/* ============================================ */}
                    {/* UNIFIED DASHBOARD (Main Hub) */}
                    {/* ============================================ */}
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <DashboardLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<UnifiedDashboard />} />
                    </Route>



                    {/* ============================================ */}
                    {/* DOCTOR ROUTES */}
                    {/* ============================================ */}
                    <Route
                      path="/dashboard/doctor"
                      element={
                        <ProtectedRoute allowedRoles={["doctor", "admin"]}>
                          <DashboardLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route path="patient-queue" element={<PatientQueue />} />
                      <Route path="patient-details" element={<PatientDetails />} />
                      <Route path="diagnosis" element={<DiagnosisForm />} />
                      <Route path="prescribe" element={<PrescribeMedicine />} />
                      <Route path="order-lab" element={<OrderLabTest />} />
                      <Route path="encounters" element={<Encounters />} />
                    </Route>

                    {/* ============================================ */}
                    {/* PATIENT ROUTES */}
                    {/* ============================================ */}
                    <Route
                      path="/dashboard/patient"
                      element={
                        <ProtectedRoute allowedRoles={["patient", "admin"]}>
                          <DashboardLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route path="records" element={<MyRecords />} />
                      <Route path="prescriptions" element={<MyPrescriptions />} />
                      <Route path="lab-reports" element={<MyLabReports />} />
                      <Route path="encounters" element={<MyEncounters />} />
                      <Route path="consent" element={<Consent />} />
                    </Route>

                    {/* ============================================ */}
                    {/* PHARMACIST ROUTES */}
                    {/* ============================================ */}
                    <Route
                      path="/dashboard/pharmacist"
                      element={
                        <ProtectedRoute allowedRoles={["pharmacist", "admin"]}>
                          <DashboardLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route path="pending" element={<PendingPrescriptions />} />
                      <Route path="dispense" element={<DispenseMedicine />} />
                      <Route path="inventory" element={<MedicineInventory />} />
                      <Route path="batch-tracking" element={<BatchTracking />} />
                      <Route path="shipments" element={<Shipments />} />
                      <Route path="global-inventory" element={<GlobalInventory />} />
                    </Route>

                    {/* ============================================ */}
                    {/* LABORATORY ROUTES */}
                    {/* ============================================ */}
                    <Route
                      path="/dashboard/laboratory"
                      element={
                        <ProtectedRoute allowedRoles={["lab", "admin"]}>
                          <DashboardLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route path="pending" element={<PendingTests />} />
                      <Route path="upload" element={<UploadReport />} />
                      <Route path="completed" element={<CompletedTests />} />
                    </Route>

                    {/* ============================================ */}
                    {/* REGISTRATION ROUTES */}
                    {/* ============================================ */}
                    <Route
                      path="/dashboard/registration"
                      element={
                        <ProtectedRoute allowedRoles={["registration", "admin"]}>
                          <DashboardLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route path="register" element={<RegisterPatient />} />
                      <Route path="add-to-queue" element={<AddToQueue />} />
                      <Route path="queue-list" element={<QueueList />} />
                      <Route path="check-in" element={<CheckIn />} />
                    </Route>

                    {/* ============================================ */}
                    {/* ADMIN ROUTES */}
                    {/* ============================================ */}
                    <Route
                      path="/dashboard/admin"
                      element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                          <DashboardLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route path="users" element={<Users />} />
                      <Route path="monitoring" element={<Monitoring />} />
                    </Route>

                    {/* Facilities - Admin + Registration */}
                    <Route
                      path="/dashboard/admin/facilities"
                      element={
                        <ProtectedRoute allowedRoles={["admin", "registration"]}>
                          <DashboardLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<Facilities />} />
                    </Route>

                    {/* ============================================ */}
                    {/* SHARED ROUTES (All Authenticated Users) */}
                    {/* ============================================ */}
                    <Route
                      path="/dashboard/profile"
                      element={
                        <ProtectedRoute>
                          <DashboardLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<Profile />} />
                    </Route>

                    <Route
                      path="/dashboard/settings"
                      element={
                        <ProtectedRoute>
                          <DashboardLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<Settings />} />
                    </Route>

                    <Route
                      path="/dashboard/reports"
                      element={
                        <ProtectedRoute allowedRoles={["doctor", "pharmacist", "lab", "registration", "admin"]}>
                          <DashboardLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<Reports />} />
                    </Route>

                    {/* ============================================ */}
                    {/* FALLBACK ROUTES */}
                    {/* ============================================ */}

                    {/* Catch-all route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </MockDataProvider>
          </DashboardAuthProvider>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
