"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";
import ChatWidget from "./ChatWidget";

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90 shadow-2xl hover:shadow-primary/25 transition-all duration-300 hover:scale-110"
          size="icon"
        >
          <MessageSquare className="h-7 w-7 text-primary-foreground" />
        </Button>
        <span className="text-xs font-medium text-primary-foreground bg-primary/90 px-3 py-1 rounded-full backdrop-blur-sm shadow-lg">
          Free Chat
        </span>
      </div>

      {/* Chat Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="relative w-full max-w-4xl h-[85vh] max-h-[800px] bg-background rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <Button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-gray-800 hover:bg-gray-700 text-white shadow-lg"
              size="icon"
            >
              <X className="h-4 w-4" />
            </Button>
            
            {/* Chat Widget */}
            <div className="h-full">
              <ChatWidget />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
