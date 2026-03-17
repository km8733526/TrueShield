
import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isCaregiver: boolean;
}

const CaregiverChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Mock data for initial loading state
  const initialMessages = [
    {
      id: "1",
      senderId: "caregiver-1",
      senderName: "Dr. Sarah Johnson",
      content: "Good morning! How are you feeling today?",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isCaregiver: true
    }
  ];

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // In a real app, this would fetch messages from Supabase
    // For now, we'll simulate loading messages
    const timer = setTimeout(() => {
      setMessages(initialMessages);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);

    // In a production app, you would set up a Supabase subscription like:
    /*
    if (user) {
      const channel = supabase
        .channel('chat_messages')
        .on('postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'chat_messages',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            // Handle new messages
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
    */
  }, [user]);

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
    
    // Simulate caregiver response (in a real app, this would be handled by the backend)
    setTimeout(() => {
      const caregiverResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: "caregiver-1",
        senderName: "Dr. Sarah Johnson",
        content: "Thanks for the update. How are you feeling now?",
        timestamp: new Date(),
        isCaregiver: true
      };
      
      setMessages(prevMessages => [...prevMessages, caregiverResponse]);
    }, 3000);
  };

  const formatMessageTime = (date: Date) => {
    return format(date, "h:mm a");
  };

  return (
    <Card className="border-trueshield-light shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-trueshield-primary flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Caregiver Chat
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-3 mb-3">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-pulse space-y-2">
                  <div className="h-10 w-64 bg-trueshield-light/30 rounded"></div>
                  <div className="h-10 w-48 bg-trueshield-light/30 rounded"></div>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.isCaregiver ? "justify-start" : "justify-end"}`}
                >
                  <div className={`flex max-w-[80%] ${msg.isCaregiver ? "flex-row" : "flex-row-reverse"}`}>
                    <Avatar className={`h-8 w-8 ${msg.isCaregiver ? "mr-2" : "ml-2"}`}>
                      <AvatarFallback className={msg.isCaregiver ? "bg-trueshield-secondary text-white" : "bg-trueshield-primary text-white"}>
                        {msg.senderName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div 
                        className={`rounded-lg px-3 py-2 text-sm ${
                          msg.isCaregiver 
                            ? "bg-gray-100 text-gray-800 rounded-tl-none" 
                            : "bg-trueshield-primary text-white rounded-tr-none"
                        }`}
                      >
                        {msg.content}
                      </div>
                      <div className={`text-xs text-trueshield-muted mt-1 ${msg.isCaregiver ? "" : "text-right"}`}>
                        {formatMessageTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="flex gap-2 mt-auto">
            <Input 
              placeholder="Type your message..." 
              className="border-trueshield-light focus-visible:ring-trueshield-primary"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button size="icon" className="bg-trueshield-primary hover:bg-trueshield-primary/90" onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-2 text-center">
            <Link to="/chat" className="text-xs text-trueshield-primary hover:underline">
              View full conversation
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaregiverChat;
