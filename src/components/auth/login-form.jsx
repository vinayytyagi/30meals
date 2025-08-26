"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UtensilsCrossed, ShieldCheck, Phone, KeyRound } from 'lucide-react';
import { RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged } from 'firebase/auth';

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
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';


const phoneSchema = z.object({
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Phone number must be in E.164 format (e.g., +919876543210).'),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits.'),
});

export function LoginForm() {
  const [role, setRole] = useState('user');
  const [step, setStep] = useState('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isSending, setIsSending] = useState(false);
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

  const generateRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  }

  const handlePhoneSubmit = async (values) => {
    setIsSending(true);
    generateRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      const result = await signInWithPhoneNumber(auth, values.phone, appVerifier);
      setConfirmationResult(result);
      setPhoneNumber(values.phone);
      setStep('otp');
      toast({
        title: 'OTP Sent',
        description: `An OTP has been sent to ${values.phone}.`,
      });
    } catch (error) {
      console.error("Error sending OTP: ", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send OTP. Please check the phone number or try again.',
      });
    } finally {
        setIsSending(false);
    }
  };

  const handleOtpSubmit = async (values) => {
    if (!confirmationResult) return;
    setIsSending(true);

    try {
      const result = await confirmationResult.confirm(values.otp);
      const user = result.user;
      
      // Check if user exists in Firestore, if not, create a new document
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
            name: `User ${user.uid.substring(0, 5)}`,
            phone: user.phoneNumber,
            remainingMeals: 30, // Default meal plan
            createdAt: new Date().toISOString(),
        });
      }

      toast({
        title: 'Login Successful',
        description: 'Redirecting to your dashboard...',
      });

      if (role === 'user') {
        router.push('/dashboard');
      } else {
        // Simple check for admin role, in a real app this should be more secure (e.g. custom claims)
        if (user.phoneNumber === process.env.NEXT_PUBLIC_ADMIN_PHONE) {
            router.push('/admin/dashboard');
        } else {
            toast({ variant: 'destructive', title: 'Unauthorized', description: 'You are not authorized to access the admin panel.' });
            await auth.signOut();
        }
      }
    } catch (error) {
      console.error("Error verifying OTP: ", error);
      otpForm.setError('otp', {
        type: 'manual',
        message: 'Invalid OTP. Please try again.',
      });
    } finally {
        setIsSending(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <div id="recaptcha-container"></div>
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
                        <Input placeholder="e.g., +919876543210" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSending}>
                {isSending ? "Sending..." : "Send OTP"}
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
                        <Input placeholder="Enter your 6-digit OTP" {...field} className="pl-10" autoFocus />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSending}>
                {isSending ? "Verifying..." : "Login"}
              </Button>
              <Button variant="link" size="sm" className="w-full" onClick={() => {
                setStep('phone');
                setConfirmationResult(null);
                }}>
                Back to phone number
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
