'use client';

import { useState, useEffect, useRef } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getMessages, sendMessageToUsers } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { Send, Users, User, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const chatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty.'),
});

function ChatLoader() {
    return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="animate-pulse flex flex-col items-center gap-2">
                <MessageSquare className="h-8 w-8" />
                <span>Loading messages...</span>
            </div>
        </div>
    );
}


export function AdminChat({ users, initialMessages }) {
  const [selectedUsers, setSelectedUsers] = useState([users[0]?.id].filter(Boolean));
  const [messages, setMessages] = useState(initialMessages);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);
  const { toast } = useToast();

  const isMultiSelect = selectedUsers.length > 1;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedUsers.length === 1) {
        setIsLoadingMessages(true);
        const newMessages = await getMessages(selectedUsers[0]);
        setMessages(newMessages);
        setIsLoadingMessages(false);
      } else {
        setMessages([]); // Clear messages for multi-select
      }
    };
    fetchMessages();
  }, [selectedUsers]);
  
    // Poll for new messages when viewing a single conversation
    useEffect(() => {
        let interval;
        if (selectedUsers.length === 1 && !isMultiSelect) {
            const userId = selectedUsers[0];
            interval = setInterval(async () => {
                const latestMessages = await getMessages(userId);
                setMessages(currentMessages => {
                    // A simple length check is enough for this mock setup
                    if (latestMessages.length !== currentMessages.length) {
                        return latestMessages;
                    }
                    return currentMessages;
                });
            }, 5000); // Poll every 5 seconds
        }
        return () => clearInterval(interval);
    }, [selectedUsers, isMultiSelect]);

  const form = useForm({
    resolver: zodResolver(chatSchema),
    defaultValues: { message: '' },
  });

  const handleSendMessage = async (values) => {
    if(selectedUsers.length === 0) {
        toast({
            variant: 'destructive',
            title: 'No User Selected',
            description: 'Please select at least one user to send a message.',
        });
        return;
    }
    setIsSending(true);
    try {
      await sendMessageToUsers(selectedUsers, values.message, 'admin');
      
      if(!isMultiSelect) {
        // Optimistically add to single chat
        const optimisticMessage = {
            id: 'temp-' + Date.now(),
            text: values.message,
            sender: 'admin',
            timestamp: new Date().toISOString(),
            userId: selectedUsers[0],
        };
        setMessages(prev => [...prev, optimisticMessage]);
      } else {
        toast({
            title: 'Message Sent!',
            description: `Your message has been broadcast to ${selectedUsers.length} users.`,
        });
      }
      form.reset();

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send message.',
      });
    } finally {
      setIsSending(false);
    }
  };
  
  const handleUserSelection = (userId) => {
    const isSelected = selectedUsers.includes(userId);
    if(isSelected) {
        if(selectedUsers.length === 1 && selectedUsers[0] === userId) return; // Prevent deselecting the last user
        setSelectedUsers(prev => prev.filter(id => id !== userId));
    } else {
        setSelectedUsers(prev => [...prev, userId]);
    }
  };
  
  const handleSingleUserSelect = (userId) => {
    setSelectedUsers([userId]);
  }

  const selectAllUsers = () => {
    setSelectedUsers(users.map(u => u.id));
  }
  
  const deselectAllUsers = () => {
    if (users.length > 0) {
        // Keep the first user selected instead of clearing completely
        setSelectedUsers([users[0].id]);
    }
  }


  return (
    <div className="flex h-[calc(100vh_-_120px)]">
      {/* User List Sidebar */}
      <div className="w-1/3 border-r flex flex-col">
        <div className='p-4 border-b'>
            <h2 className="text-lg font-semibold">Users ({selectedUsers.length}/{users.length})</h2>
            <div className='flex gap-2 mt-2'>
                <Button size="sm" variant="outline" onClick={selectAllUsers}>Select All</Button>
                <Button size="sm" variant="outline" onClick={deselectAllUsers}>Clear Selection</Button>
            </div>
        </div>
        <ScrollArea className="flex-1">
          {users.map((user) => (
            <div
              key={user.id}
              className={cn(
                'p-4 cursor-pointer border-b flex items-center gap-3',
                selectedUsers.includes(user.id) ? 'bg-primary/10' : 'hover:bg-muted/50'
              )}
            >
              <Checkbox checked={selectedUsers.includes(user.id)} onCheckedChange={() => handleUserSelection(user.id)} />
              <div onClick={() => handleSingleUserSelect(user.id)} className="flex-1">
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.phone}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="w-2/3 flex flex-col">
        <div className="flex-1 flex flex-col p-4">
          <div className="flex items-center gap-2 mb-4 border-b pb-4">
            {isMultiSelect ? <Users className="h-6 w-6" /> : <User className="h-6 w-6" />}
            <h3 className="text-lg font-semibold">
                {isMultiSelect ? `${selectedUsers.length} users selected` : users.find(u => u.id === selectedUsers[0])?.name || 'Select a User'}
            </h3>
          </div>

          <ScrollArea className="flex-1 pr-4">
            {isMultiSelect ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>Broadcasting to multiple users. Chat history is not available in this mode.</p>
                </div>
            ) : isLoadingMessages ? (
                <ChatLoader />
            ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>No messages yet. Start the conversation!</p>
                </div>
            ) : (
                <div className='space-y-4'>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                        'flex items-end gap-2',
                        msg.sender === 'admin' ? 'justify-end' : 'justify-start'
                        )}
                    >
                        <div
                        className={cn(
                            'max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl',
                            msg.sender === 'admin'
                            ? 'bg-primary text-primary-foreground rounded-br-none'
                            : 'bg-card text-card-foreground rounded-bl-none border'
                        )}
                        >
                        <p className="text-sm">{msg.text}</p>
                        <p className="text-xs opacity-70 mt-1 text-right">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        </div>
                    </div>
                ))}
                </div>
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>

          <div className="mt-4 pt-4 border-t">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSendMessage)} className="flex gap-2">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input {...field} placeholder={isMultiSelect ? "Broadcast a message..." : "Type your message..."} autoComplete="off" disabled={selectedUsers.length === 0} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="icon" disabled={isSending || selectedUsers.length === 0}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
