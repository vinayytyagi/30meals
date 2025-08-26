"use client";

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  suggestNotificationTime,
} from '@/ai/flows/suggest-notification-time';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Lightbulb, Clock } from 'lucide-react';

const formSchema = z.object({
  notificationType: z.string({
    required_error: 'Please select a notification type.',
  }),
  userBehavior: z.string().min(10, {
    message: 'User behavior description must be at least 10 characters.',
  }),
});

export function NotificationScheduler() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(
    null
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notificationType: 'menu reminder',
      userBehavior:
        'User typically orders lunch between 11:00 AM and 11:30 AM on weekdays. They are most responsive to messages around 10:30 AM.',
    },
  });

  async function onSubmit(values) {
    setIsLoading(true);
    setResult(null);
    try {
      const suggestion = await suggestNotificationTime(values);
      setResult(suggestion);
    } catch (error) {
      console.error("Failed to get suggestion:", error)
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Scheduler Details</CardTitle>
          <CardDescription>
            Fill in the details below to get a suggestion.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="notificationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notification Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a notification type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="menu reminder">Menu Reminder</SelectItem>
                        <SelectItem value="delivery update">Delivery Update</SelectItem>
                        <SelectItem value="order confirmation">Order Confirmation</SelectItem>
                        <SelectItem value="promotional offer">Promotional Offer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userBehavior"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Behavior</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe user's past interaction data..."
                        className="resize-none"
                        {...field}
                        rows={5}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide details like order times, response times, etc.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Thinking...' : 'Suggest Time'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>AI Suggestion</CardTitle>
          <CardDescription>
            The recommended time and rationale will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center h-48">
              <div className="animate-pulse flex flex-col items-center gap-2 text-muted-foreground">
                <Lightbulb className="h-8 w-8" />
                <span>Generating suggestion...</span>
              </div>
            </div>
          )}
          {result && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Suggested Time</h3>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10">
                    <Clock className="h-8 w-8 text-primary" />
                    <p className="text-3xl font-bold text-primary">{result.suggestedTime}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Rationale</h3>
                <div className="p-4 border rounded-lg bg-secondary/50">
                    <p className="text-foreground">{result.rationale}</p>
                </div>
              </div>
            </div>
          )}
          {!isLoading && !result && (
            <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">Waiting for input...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
