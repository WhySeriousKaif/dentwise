"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Bot, User, Loader2, MessageSquare } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  source?: string; // To indicate if response came from VAPI, Gemini, or fallback
}

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI dental assistant. How can I help you today? I can assist with appointment booking, dental advice, cost information, and general oral health questions.',
      sender: 'ai',
      timestamp: new Date(),
      source: 'initial'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputMessage.trim() === '' || isLoading) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError('');

    try {
      // Use smart chat API (automatically chooses VAPI or Gemini)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: newUserMessage.content,
          userId: null // No authentication required for guest chat
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const aiResponse: Message = {
        id: Date.now().toString() + '-ai',
        content: data.response,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    } catch (error: unknown) {
      console.error('Error sending message to AI:', error);
      const message = error instanceof Error ? error.message : 'Failed to get AI response. Please try again.';
      setError(message);
      
      // Add error message to chat
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        content: 'Sorry, I encountered an error. Please try again or contact support if the issue persists.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">AI Dental Assistant</h1>
            <p className="text-muted-foreground">Get instant dental advice and support</p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="mb-6" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Chat Container */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            Chat with DentWise AI
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="size-8 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-muted rounded-tl-none'
                }`}
              >
                  <div 
                    className="text-sm whitespace-pre-wrap prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ 
                      __html: msg.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/•/g, '•')
                        .replace(/\n/g, '<br/>')
                    }}
                  />
                <span className="block text-xs text-right mt-1 opacity-70">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {msg.sender === 'user' && (
                <div className="size-8 flex-shrink-0 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start gap-3 justify-start">
              <div className="size-8 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="max-w-[70%] p-3 rounded-lg bg-muted rounded-tl-none flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">AI is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        
        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="border-t border-border/50 p-4 flex items-center gap-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !inputMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </Card>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button
          variant="outline"
          onClick={() => setInputMessage("I need to book an appointment")}
          className="text-sm"
        >
          Book Appointment
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputMessage("What are your prices?")}
          className="text-sm"
        >
          View Prices
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputMessage("I have tooth pain")}
          className="text-sm"
        >
          Dental Pain
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputMessage("Tell me about your doctors")}
          className="text-sm"
        >
          Our Doctors
        </Button>
      </div>
    </div>
  );
}
