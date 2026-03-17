
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isCaregiver: boolean;
}

const CaregiverChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      senderId: "caregiver-1",
      senderName: "Dr. Sarah Johnson",
      content: "Good morning! How are you feeling today?",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      isCaregiver: true
    },
    {
      id: "2",
      senderId: "user-1",
      senderName: "You",
      content: "I'm feeling better today. The new medication seems to be helping with my blood pressure.",
      timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000), // 23 hours ago
      isCaregiver: false
    },
    {
      id: "3",
      senderId: "caregiver-1",
      senderName: "Dr. Sarah Johnson",
      content: "That's great news! Remember to keep monitoring and recording your readings. I'll check in tomorrow.",
      timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000), // 22 hours ago
      isCaregiver: true
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
    
    // Simulate caregiver response (in a real app, this would be a real-time message from the caregiver)
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
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-trueshield-primary">Chat with Caregiver</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-y-auto">
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
      
      <CardFooter className="border-t p-3">
        <div className="flex w-full gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CaregiverChat;
