import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  admin_response: string | null;
  created_at: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
      const initialResponses: { [key: string]: string } = {};
      data?.forEach((message) => {
        initialResponses[message.id] = message.admin_response || '';
      });
      setResponses(initialResponses);
      setLoading(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch messages.",
      });
    }
  };

  const sendResponse = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({
          admin_response: responses[messageId],
          status: 'responded'
        })
        .eq('id', messageId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Response sent successfully.",
      });
      fetchMessages();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send response.",
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Contact Messages</h1>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-gray-500" />
            <span className="text-gray-500">Total Messages: {messages.length}</span>
          </div>
        </div>

        <div className="grid gap-6">
          {messages.map((message) => (
            <div key={message.id} className="bg-white rounded-lg shadow p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">{message.subject}</h3>
                    <p className="text-sm text-gray-500">
                      From: {message.name} ({message.email})
                    </p>
                    <p className="text-sm text-gray-500">
                      Sent: {new Date(message.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{message.message}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Admin Response</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${message.status === 'responded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {message.status}
                    </span>
                  </div>
                  <Textarea
                    value={responses[message.id]}
                    onChange={(e) => setResponses({
                      ...responses,
                      [message.id]: e.target.value
                    })}
                    placeholder="Type your response here..."
                    className="min-h-[150px]"
                  />
                  <Button
                    className="w-full"
                    onClick={() => sendResponse(message.id)}
                    disabled={!responses[message.id]}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Response
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}