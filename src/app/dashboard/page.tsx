import ActivityOverview from "@/components/dashboard/ActivityOverview";
import MainActions from "@/components/dashboard/MainActions";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import FloatingChatButton from "@/components/chat/FloatingChatButton";

function DashboardPage() {
  return (
    <ProtectedRoute>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        <WelcomeSection />
        <MainActions />
        <ActivityOverview />
      </div>
      <FloatingChatButton />
    </ProtectedRoute>
  );
}
export default DashboardPage;
