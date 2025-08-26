"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UtensilsCrossed, ShieldCheck, Phone, KeyRound } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const phoneSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits.'),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits.'),
});

export function LoginForm() {
  const [role, setRole] = useState('user');
  const [step, setStep] = useState('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const phoneForm = useForm({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '' },
  });

  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const handlePhoneSubmit = (values) => {
    setPhoneNumber(values.phone);
    setStep('otp');
    toast({
      title: 'OTP Sent',
      description: 'An OTP has been sent to your phone (use 123456).',
    });
  };

  const handleOtpSubmit = (values) => {
    if (values.otp === '123456') {
      toast({
        title: 'Login Successful',
        description: 'Redirecting to your dashboard...',
      });
      if (role === 'user') {
        router.push('/dashboard');
      } else {
        router.push('/admin/dashboard');
      }
    } else {
      otpForm.setError('otp', {
        type: 'manual',
        message: 'Invalid OTP. Please try again.',
      });
    }
  };

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center">
        <h1 className="font-headline text-5xl text-primary">30meals</h1>
        <CardDescription>Your daily meal, sorted.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="user" onValueChange={(v) => setRole(v)} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user">
              <UtensilsCrossed className="mr-2 h-4 w-4" /> User Login
            </TabsTrigger>
            <TabsTrigger value="admin">
              <ShieldCheck className="mr-2 h-4 w-4" /> Admin Login
            </TabsTrigger>
          </TabsList>
          <TabsContent value="user" />
          <TabsContent value="admin" />
        </Tabs>

        {step === 'phone' ? (
          <Form {...phoneForm}>
            <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-6 mt-4">
              <FormField
                control={phoneForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Enter your phone number" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Send OTP
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-6 mt-4">
              <p className="text-center text-sm text-muted-foreground">
                Enter OTP sent to {phoneNumber}
              </p>
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One-Time Password (OTP)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Enter your 6-digit OTP" {...field} className="pl-10"/>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button variant="link" size="sm" className="w-full" onClick={() => setStep('phone')}>
                Back to phone number
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
