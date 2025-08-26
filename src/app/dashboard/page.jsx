import { Package, Utensils, CalendarDays, ChefHat } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getLoggedInUser, getTodaysMenu } from '@/lib/data';
import { PlaceOrderForm } from '@/components/user/place-order-form';
import { Progress } from '@/components/ui/progress';

export default async function UserDashboardPage() {
  const user = await getLoggedInUser();
  const menu = await getTodaysMenu();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <header>
        <h1 className="font-headline text-4xl font-bold text-primary">
          Welcome, {user.name.split(' ')[0]}!
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
            <div className="text-2xl font-bold">{user.remainingMeals} / 30</div>
            <p className="text-xs text-muted-foreground">meals left in your plan</p>
            <Progress value={(user.remainingMeals / 30) * 100} className="mt-4" />
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
          <div className="grid gap-4 md:grid-cols-2">
            {menu.map((item) => (
              <div key={item.id} className="p-4 bg-secondary/50 rounded-lg">
                <p className="font-bold">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>

          <PlaceOrderForm remainingMeals={user.remainingMeals} />

        </CardContent>
      </Card>
    </div>
  );
}
