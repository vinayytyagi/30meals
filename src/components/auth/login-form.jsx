"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UtensilsCrossed, ShieldCheck, Phone, KeyRound, User } from 'lucide-react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

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

const detailsSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
});

export function LoginForm() {
  const [role, setRole] = useState('user');
  const [step, setStep] = useState('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [userObject, setUserObject] = useState(null);
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
  
  const detailsForm = useForm({
    resolver: zodResolver(detailsSchema),
    defaultValues: { name: '' },
  });

  const generateRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  }

  const handlePhoneSubmit = async (values) => {
    setIsSending(true);
    const appVerifier = window.recaptchaVerifier;

    try {
        // Check if user exists first
        const userDocRef = doc(db, "phoneNumbers", values.phone);
        const userDocSnap = await getDoc(userDocRef);
        setUserExists(userDocSnap.exists());

        // Then send OTP
        generateRecaptcha();
        const result = await signInWithPhoneNumber(auth, values.phone, appVerifier);
        setConfirmationResult(result);
        setPhoneNumber(values.phone);
        setStep('otp');
        toast({
            title: 'OTP Sent',
            description: `An OTP has been sent to ${values.phone}.`,
        });
    } catch (error) {
      console.error("Error during phone auth:", error);
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
      setUserObject(user);

      if (userExists) {
        // User exists, log them in
        toast({ title: 'Login Successful', description: 'Redirecting to your dashboard...' });
        if (role === 'user') {
            router.push('/dashboard');
        } else {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists() && userDoc.data().isAdmin) {
                router.push('/admin/dashboard');
            } else {
                toast({ variant: 'destructive', title: 'Unauthorized', description: 'You are not authorized to access the admin panel.' });
                await auth.signOut();
            }
        }
      } else {
        // New user, go to details step
        setStep('details');
        toast({ title: 'Phone Verified!', description: 'Please enter your details to complete registration.' });
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

  const handleDetailsSubmit = async (values) => {
    if (!userObject) return;
    setIsSending(true);
    
    try {
        // Create user document in 'users'
        await setDoc(doc(db, "users", userObject.uid), {
            name: values.name,
            phone: userObject.phoneNumber,
            remainingMeals: 30, // Default meal plan
            createdAt: new Date().toISOString(),
            isAdmin: false,
        });

        // Create a lookup document in 'phoneNumbers'
        await setDoc(doc(db, "phoneNumbers", userObject.phoneNumber), {
            uid: userObject.uid,
        });

        toast({
            title: 'Registration Successful!',
            description: 'Redirecting to your dashboard...',
          });
    
        router.push('/dashboard');

    } catch (error) {
        console.error("Error creating user:", error);
        toast({
            variant: 'destructive',
            title: 'Registration Failed',
            description: 'Could not complete your registration. Please try again.',
        });
    } finally {
        setIsSending(false);
    }
  }
  
  const renderStep = () => {
    switch(step) {
      case 'phone':
        return (
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
        );
      case 'otp':
        return (
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
                {isSending ? "Verifying..." : userExists ? "Login" : "Verify & Proceed"}
              </Button>
              <Button variant="link" size="sm" className="w-full" onClick={() => setStep('phone')}>
                Back to phone number
              </Button>
            </form>
          </Form>
        );
      case 'details':
        return (
            <Form {...detailsForm}>
            <form onSubmit={detailsForm.handleSubmit(handleDetailsSubmit)} className="space-y-6 mt-4">
               <p className="text-center text-sm text-muted-foreground">
                Complete your registration
              </p>
              <FormField
                control={detailsForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Enter your full name" {...field} className="pl-10" autoFocus/>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSending}>
                {isSending ? "Saving..." : "Complete Registration"}
              </Button>
            </form>
          </Form>
        )
      default:
        return null;
    }
  }

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
              <UtensilsCrossed className="mr-2 h-4 w-4" /> User
            </TabsTrigger>
            <TabsTrigger value="admin">
              <ShieldCheck className="mr-2 h-4 w-4" /> Admin
            </TabsTrigger>
          </TabsList>
          <TabsContent value="user" />
          <TabsContent value="admin" />
        </Tabs>

        {renderStep()}
        
      </CardContent>
    </Card>
  );
}
