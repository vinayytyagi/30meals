import { getAllOrders } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { OrdersTable } from '@/components/admin/orders-table';

export default async function AdminDashboardPage() {
  const orders = await getAllOrders();
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <header>
        <h1 className="font-headline text-4xl font-bold text-primary">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage today's orders and operations.
        </p>
      </header>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Incoming Orders</CardTitle>
          <CardDescription>
            There are {pendingOrders} pending orders out of {orders.length} total orders today.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrdersTable orders={orders} />
        </CardContent>
      </Card>
    </div>
  );
}
