'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, Smartphone, Edit } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setUserData(data);
          setName(data.name);
        }
      };
      fetchUserData();
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!user || !name) return;

    setIsSaving(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        name: name,
      });
      setUserData(prev => ({...prev, name}));
      toast({
        title: 'Profile Updated',
        description: 'Your name has been successfully updated.',
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not update your profile. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || !userData) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <header>
        <h1 className="font-headline text-4xl font-bold text-primary">
          My Profile
        </h1>
        <p className="text-muted-foreground">
          View and manage your personal information.
        </p>
      </header>

      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Your Details</CardTitle>
          <CardDescription>
            Here's the information we have on file for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            id="name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            disabled={!isEditing} 
                            className="pl-10"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="phone" value={userData.phone} disabled className="pl-10" />
                    </div>
                </div>
                 <div className="flex justify-end gap-2">
                    {isEditing ? (
                        <>
                            <Button type="button" variant="ghost" onClick={() => {
                                setIsEditing(false);
                                setName(userData.name); // Reset name on cancel
                            }}>Cancel</Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </>
                    ) : (
                        <Button type="button" onClick={() => setIsEditing(true)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Profile
                        </Button>
                    )}
                </div>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}
