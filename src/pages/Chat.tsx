
import { useState, useEffect, useRef } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, Phone, Video } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isCaregiver: boolean;
}

interface Caregiver {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: Date;
}

const Chat = () => {
  const [activeCaregiver, setActiveCaregiver] = useState<string>("caregiver-1");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      senderId: "caregiver-1",
      senderName: "Dr. Sarah Johnson",
      content: "Good morning! How are you feeling today?",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isCaregiver: true
    },
    {
      id: "2",
      senderId: "user-1",
      senderName: "You",
      content: "I'm feeling better today. The new medication seems to be helping with my blood pressure.",
      timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
      isCaregiver: false
    },
    {
      id: "3",
      senderId: "caregiver-1",
      senderName: "Dr. Sarah Johnson",
      content: "That's great news! Remember to keep monitoring and recording your readings. I'll check in tomorrow.",
      timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000),
      isCaregiver: true
    }
  ]);
  
  const [caregivers, setCaregivers] = useState<Caregiver[]>([
    {
      id: "caregiver-1",
      name: "Dr. Sarah Johnson",
      role: "Primary Physician",
      avatar: "/placeholder.svg",
      isOnline: true
    },
    {
      id: "caregiver-2",
      name: "Nurse Michael",
      role: "Care Coordinator",
      avatar: "/placeholder.svg",
      isOnline: false,
      lastSeen: new Date(Date.now() - 3 * 60 * 60 * 1000)
    },
    {
      id: "caregiver-3",
      name: "Emma Martinez",
      role: "Family Member",
      avatar: "/placeholder.svg",
      isOnline: true
    }
  ]);
  
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: user?.id || "user-1",
      senderName: "You",
      content: newMessage,
      timestamp: new Date(),
      isCaregiver: false
    };
    
    setMessages([...messages, message]);
    setNewMessage("");
    
    // Simulate caregiver response
    const activeCareg = caregivers.find(c => c.id === activeCaregiver);
    if (activeCareg?.isOnline) {
      setTimeout(() => {
        const caregiverResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          senderId: activeCaregiver,
          senderName: activeCareg.name,
          content: "Thanks for the update. How are you feeling now?",
          timestamp: new Date(),
          isCaregiver: true
        };
        
        setMessages(prevMessages => [...prevMessages, caregiverResponse]);
      }, 3000);
    }
  };

  const formatMessageTime = (date: Date) => {
    return format(date, "h:mm a");
  };
  
  const formatLastSeen = (date?: Date) => {
    if (!date) return "";
    
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
      }
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-trueshield-primary mb-1">Caregiver Chat</h2>
          <p className="text-trueshield-muted">Stay connected with your care team</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card className="h-[600px]">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-trueshield-primary mb-4">Caregivers</h3>
                  
                  {caregivers.map((caregiver) => (
                    <div 
                      key={caregiver.id}
                      onClick={() => setActiveCaregiver(caregiver.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        activeCaregiver === caregiver.id 
                          ? "bg-trueshield-light" 
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full bg-trueshield-primary/10 flex items-center justify-center">
                            <User className="h-6 w-6 text-trueshield-primary" />
                          </div>
                          {caregiver.isOnline && (
                            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                          )}
                        </div>
                        <div className="ml-3">
                          <div className="font-medium text-trueshield-primary">{caregiver.name}</div>
                          <div className="text-xs text-trueshield-muted">{caregiver.role}</div>
                          {!caregiver.isOnline && caregiver.lastSeen && (
                            <div className="text-xs text-trueshield-muted">
                              Last seen {formatLastSeen(caregiver.lastSeen)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-trueshield-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-trueshield-primary" />
                    </div>
                    {caregivers.find(c => c.id === activeCaregiver)?.isOnline && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="font-medium text-trueshield-primary">
                      {caregivers.find(c => c.id === activeCaregiver)?.name}
                    </div>
                    <div className="text-xs text-trueshield-muted">
                      {caregivers.find(c => c.id === activeCaregiver)?.isOnline 
                        ? "Online" 
                        : `Last seen ${formatLastSeen(caregivers.find(c => c.id === activeCaregiver)?.lastSeen)}`}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" title="Voice call">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" title="Video call">
                    <Video className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <CardContent className="flex-grow overflow-y-auto p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isCaregiver ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-lg p-3 ${
                          message.isCaregiver
                            ? "bg-trueshield-light text-trueshield-text"
                            : "bg-trueshield-primary text-white"
                        }`}
                      >
                        <div className="flex items-center mb-1">
                          <span className="text-xs font-medium">{message.senderName}</span>
                          <span className="text-xs ml-2 opacity-70">
                            {formatMessageTime(message.timestamp)}
                          </span>
                        </div>
                        <p>{message.content}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4 mr-2" /> Send
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
