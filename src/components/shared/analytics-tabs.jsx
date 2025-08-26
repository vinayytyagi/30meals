import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BarChart3, CalendarDays, Utensils, Flame, Repeat, Award } from 'lucide-react';
import { MealsBarChart } from '@/components/shared/meals-bar-chart';
import { AnalyticsCalendar } from '@/components/shared/analytics-calendar';

export function AnalyticsTabs({ analytics }) {
    return (
        <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
                    <Card className="shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Meals Used</CardTitle>
                            <Utensils className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.mealsUsed}</div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Most Popular Choice</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.mostPopularChoice}</div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                            <Flame className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.streaks.current} Days</div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
                            <Award className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.streaks.max} Days</div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Skipped Meals</CardTitle>
                            <Repeat className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.mealsSkipped}</div>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    <MealsBarChart
                        data={analytics.chartData}
                        title="Daily Orders"
                        description="Number of meals ordered per day (last 30 days)."
                        footerText="Trending up for the month."
                    />
                     <MealsBarChart
                        data={analytics.weekChartData}
                        title="Weekly Orders"
                        description="Number of meals ordered by day of the week."
                        footerText="Fridays are the most popular."
                    />
                </div>
            </TabsContent>
            <TabsContent value="calendar">
                <Card className="shadow-lg mt-6">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <CalendarDays className="h-6 w-6 text-accent" />
                            <CardTitle>Consumption Calendar</CardTitle>
                        </div>
                        <CardDescription>
                        Meal consumption overview. Light green: 1 meal, Dark green: 2 meals.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AnalyticsCalendar data={analytics.calendarData} />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="details">
            <Card className="shadow-lg mt-6">
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>
                        A list of the most recent orders.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Meal</TableHead>
                            <TableHead>Choice</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {analytics.recentOrders.map((order) => (
                            <TableRow key={order.id}>
                            <TableCell>{order.userName}</TableCell>
                            <TableCell>
                                {new Date(order.date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                })}
                            </TableCell>
                            <TableCell>{order.mealType}</TableCell>
                            <TableCell>{order.mealChoice}</TableCell>
                            <TableCell className="text-right">
                                <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'} className={order.status === 'Delivered' ? 'bg-green-600' : ''}>
                                {order.status}
                                </Badge>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
