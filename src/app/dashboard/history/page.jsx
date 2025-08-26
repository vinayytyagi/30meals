'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { getOrderHistory, getAnalyticsData } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

function Past5DaysSummary({ data }) {
    if (!data) return null;
    const today = new Date();
    const dates = Array.from({ length: 5 }).map((_, i) => {
        const date = new Date();
        date.setDate(today.getDate() - i);
        return date;
    }).reverse();

    return (
        <TooltipProvider>
            <div className="flex gap-1.5">
                {dates.map((date, index) => {
                    const dateString = date.toISOString().split('T')[0];
                    const mealCount = data[dateString] || 0;
                    const dayInitial = date.toLocaleDateString('en-US', { weekday: 'narrow' });
                    
                    return (
                        <Tooltip key={index} delayDuration={100}>
                            <TooltipTrigger asChild>
                                <div className='flex flex-col items-center gap-1'>
                                <span className='text-xs text-muted-foreground'>{dayInitial}</span>
                                <div
                                    className={cn(
                                    'h-5 w-5 rounded-full',
                                    mealCount === 0 && 'bg-gray-200 dark:bg-gray-700',
                                    mealCount === 1 && 'bg-green-300 dark:bg-green-800',
                                    mealCount >= 2 && 'bg-green-600 dark:bg-green-500'
                                    )}
                                />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}: {mealCount} meal(s)</p>
                            </TooltipContent>
                        </Tooltip>
                    );
                })}
            </div>
      </TooltipProvider>
    );
}

export default function OrderHistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(authLoading) return;
    if(!user) {
        setLoading(false);
        return;
    }
    const fetchData = async () => {
        setLoading(true);
        const [orderData, analyticsData] = await Promise.all([
            getOrderHistory(user.uid),
            getAnalyticsData(user.uid)
        ]);
        setOrders(orderData);
        setAnalytics(analyticsData);
        setLoading(false);
    }
    fetchData();
  }, [user, authLoading]);
  
  if (loading || authLoading) {
    return <div className="p-8">Loading order history...</div>
  }

  if (!user) {
    return <div className="p-8">Please log in to view your order history.</div>
  }


  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <header>
        <h1 className="font-headline text-4xl font-bold text-primary">
          Order History
        </h1>
        <p className="text-muted-foreground">
          A record of all your past meals.
        </p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <History className="h-6 w-6 text-accent" />
                    <CardTitle>Your Orders</CardTitle>
                </div>
                {analytics && (
                    <div className='text-right'>
                        <h4 className='text-sm font-medium text-muted-foreground'>Last 5 Days</h4>
                        <Past5DaysSummary data={analytics.calendarData} />
                    </div>
                )}
            </div>
          <CardDescription>
            {orders.length} orders found.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Meal</TableHead>
                <TableHead>Choice</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
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
    </div>
  );
}
