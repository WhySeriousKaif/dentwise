import Navbar from "@/components/Navbar";
import FeatureCards from "@/components/voice/FeatureCards";
import ProPlanRequired from "@/components/voice/ProPlanRequired";
import VapiWidget from "@/components/voice/VapiWidget";
import WelcomeSection from "@/components/voice/WelcomeSection";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function VoicePage() {
  // For now, show the voice widget to all authenticated users
  // You can add subscription logic later

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
          <WelcomeSection />
          <FeatureCards />
        </div>

        <VapiWidget />
      </div>
    </ProtectedRoute>
  );
}

export default VoicePage;
