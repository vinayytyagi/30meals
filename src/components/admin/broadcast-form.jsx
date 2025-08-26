"use client";

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { broadcastMessage } from '@/lib/data';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const formSchema = z.object({
  message: z.string().min(10, {
    message: 'Message must be at least 10 characters.',
  }),
});

export function BroadcastForm() {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  async function onSubmit(values) {
    setIsSending(true);
    try {
      await broadcastMessage(values.message);
      toast({
        title: 'Message Sent!',
        description: 'Your broadcast has been sent to all users.',
      });
      form.reset();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send broadcast message.',
      });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type your message here..."
                  className="resize-y"
                  {...field}
                  rows={6}
                />
              </FormControl>
              <FormDescription>
                This will be sent as an in-app notification and a WhatsApp message.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSending}>
          {isSending ? 'Sending...' : 'Send Broadcast'}
        </Button>
      </form>
    </Form>
  );
}
