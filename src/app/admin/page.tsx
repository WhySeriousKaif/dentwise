import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function AdminPage() {
  // For now, allow all authenticated users to access admin
  // You can add proper admin role checking later

  return (
    <ProtectedRoute>
      <AdminDashboardClient />
    </ProtectedRoute>
  );
}

export default AdminPage;
