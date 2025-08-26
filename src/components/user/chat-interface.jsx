'use client';

import { useState, useRef, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendMessageToUsers, getMessages } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
  } from '@/components/ui/form';
import { ScrollArea } from '../ui/scroll-area';

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

export function ChatInterface({ initialMessages, userId }) {
  const [messages, setMessages] = useState(initialMessages);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isLoading) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  // Initial load and polling
  useEffect(() => {
    setIsLoading(true);
    getMessages(userId).then(msgs => {
        setMessages(msgs);
        setIsLoading(false);
    });

    const interval = setInterval(async () => {
        const latestMessages = await getMessages(userId);
        setMessages(currentMessages => {
            if (latestMessages.length !== currentMessages.length) {
                return latestMessages;
            }
            return currentMessages;
        });
    }, 5000); // Poll every 5 seconds
    
    return () => clearInterval(interval);
  }, [userId]);


  const form = useForm({
    resolver: zodResolver(chatSchema),
    defaultValues: { message: '' },
  });

  const handleSendMessage = async (values) => {
    setIsSending(true);
    const optimisticMessage = {
        id: 'temp-' + Date.now(),
        text: values.message,
        sender: 'user',
        timestamp: new Date().toISOString(),
        userId,
    };
    setMessages(prev => [...prev, optimisticMessage]);
    form.reset();

    try {
        await sendMessageToUsers([userId], values.message, 'user');
        // The polling will fetch the final message from the "backend"
    } catch (error) {
        console.error("Failed to send message", error);
        setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
    } finally {
        setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[60vh]">
      <ScrollArea className="flex-1 p-4 bg-secondary/30 rounded-lg">
        {isLoading ? <ChatLoader /> : (
            <div className='space-y-4'>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex items-end gap-2',
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl',
                    msg.sender === 'user'
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
                                <Input {...field} placeholder="Type your message..." autoComplete="off" disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" size="icon" disabled={isSending || isLoading}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </Form>
      </div>
    </div>
  );
}
