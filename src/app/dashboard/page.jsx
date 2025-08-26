'use client';
import { useState, useEffect } from 'react';
import { Package, CalendarDays, ChefHat } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getTodaysMenu } from '@/lib/data';
import { PlaceOrderForm } from '@/components/user/place-order-form';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/components/auth/auth-provider';
import { Skeleton } from '@/components/ui/skeleton';

function DashboardSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <header>
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-4 w-1/3 mt-2" />
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Meals</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-3 w-1/3 mt-2" />
            <Skeleton className="h-4 w-full mt-4" />
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Date</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-3 w-1/4 mt-2" />
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-2xl">
        <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
            <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

export default function UserDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      // This should be handled by a higher-level redirect, but as a fallback:
      setLoading(false);
      return;
    };

    const fetchData = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          setUserData({ id: userDocSnap.id, ...userDocSnap.data() });
        } else {
            // Handle case where user is authenticated but not in DB
            // This might happen if DB entry creation failed during signup
            console.error("User document not found in Firestore.");
        }

        const menuData = await getTodaysMenu();
        setMenu(menuData);

      } catch(error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user, authLoading]);


  if (loading || authLoading || !userData) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <header>
        <h1 className="font-headline text-4xl font-bold text-primary">
          Welcome, {userData.name.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground">Here is your dashboard for today.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Meals</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData.remainingMeals} / 30</div>
            <p className="text-xs text-muted-foreground">meals left in your plan</p>
            <Progress value={(userData.remainingMeals / 30) * 100} className="mt-4" />
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Date</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date().toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </div>
            <p className="text-xs text-muted-foreground">Ready to order?</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <ChefHat className="h-8 w-8 text-accent" />
            <div>
              <CardTitle className="font-headline text-3xl">Today's Menu</CardTitle>
              <CardDescription>Select your preference and place an order.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {menu ? (
            <>
            <div className="grid gap-4 md:grid-cols-2">
              {menu.map((item) => (
                <div key={item.id} className="p-4 bg-secondary/50 rounded-lg">
                  <p className="font-bold">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
            <PlaceOrderForm remainingMeals={userData.remainingMeals} userId={userData.id} userName={userData.name} />
            </>
          ) : (
            <p>Today's menu has not been set yet. Please check back later!</p>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
