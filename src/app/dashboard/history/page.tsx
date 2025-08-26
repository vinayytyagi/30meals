import { getLoggedInUser, getOrderHistory } from '@/lib/data';
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

export default async function OrderHistoryPage() {
  const user = await getLoggedInUser();
  const orders = await getOrderHistory(user.id);

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
            <div className='flex items-center gap-3'>
                <History className="h-6 w-6 text-accent" />
                <CardTitle>Your Orders</CardTitle>
            </div>
          <CardDescription>
            {orders.length} orders found for {user.name}.
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
