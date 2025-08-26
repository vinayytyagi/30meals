import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getAllUsers } from '@/lib/data';
import { UserManagementTable } from '@/components/admin/user-management-table';

export default async function ManageUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <header>
        <h1 className="font-headline text-4xl font-bold text-primary">User Management</h1>
        <p className="text-muted-foreground">View and manage user accounts and meal balances.</p>
      </header>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            A list of all users in the system. Found {users.length} users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserManagementTable users={users} />
        </CardContent>
      </Card>
    </div>
  );
}
