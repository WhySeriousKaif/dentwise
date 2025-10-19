import Navbar from "@/components/Navbar";
import ChatWidget from "@/components/chat/ChatWidget";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function ChatPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
          <ChatWidget />
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default ChatPage;
