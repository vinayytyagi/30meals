'use client';

import { useState, useRef, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendMessage, getMessages } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
  } from '@/components/ui/form';

const chatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty.'),
});

export function ChatInterface({ initialMessages, userId }) {
  const [messages, setMessages] = useState(initialMessages);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Poll for new messages to simulate real-time chat
  useEffect(() => {
    const interval = setInterval(async () => {
        const latestMessages = await getMessages(userId);
        if (latestMessages.length !== messages.length) {
            setMessages(latestMessages);
        }
    }, 3000);
    return () => clearInterval(interval);
  }, [userId, messages.length]);


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
        await sendMessage(userId, values.message);
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/30 rounded-lg">
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
                  : 'bg-muted text-muted-foreground rounded-bl-none'
              )}
            >
              <p className="text-sm">{msg.text}</p>
              <p className="text-xs opacity-70 mt-1 text-right">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSendMessage)} className="flex gap-2">
                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormControl>
                                <Input {...field} placeholder="Type your message..." autoComplete="off" />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" size="icon" disabled={isSending}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </Form>
      </div>
    </div>
  );
}
