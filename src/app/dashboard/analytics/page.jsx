import { getLoggedInUser, getAnalyticsData } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BarChart3, CalendarDays, Utensils } from 'lucide-react';
import { MealsBarChart } from '@/components/shared/meals-bar-chart';
import { AnalyticsCalendar } from '@/components/shared/analytics-calendar';

export default async function UserAnalyticsPage() {
  const user = await getLoggedInUser();
  const analytics = await getAnalyticsData(user.id);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <header>
        <h1 className="font-headline text-4xl font-bold text-primary">
          My Analytics
        </h1>
        <p className="text-muted-foreground">
          An overview of your personal meal ordering habits.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Meals Eaten</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalMeals}</div>
            <p className="text-xs text-muted-foreground">From your order history</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Favorite Choice</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.mostPopularChoice}</div>
            <p className="text-xs text-muted-foreground">You order this the most!</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Daily Orders</CardTitle>
            <CardDescription>
              A chart showing how many meals you ordered per day (last 30 days).
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <MealsBarChart data={analytics.chartData} />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
                <CalendarDays className="h-6 w-6 text-accent" />
                <CardTitle>Your Calendar</CardTitle>
            </div>
            <CardDescription>
              Your personal meal map. Light green: 1 meal, Dark green: 2 meals.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <AnalyticsCalendar data={analytics.calendarData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
