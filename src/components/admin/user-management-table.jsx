"use client";

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';

const editMealsSchema = z.object({
  meals: z.coerce.number().min(0, 'Cannot be negative').max(100, 'Cannot be more than 100'),
});

export function UserManagementTable({ users: initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(editMealsSchema),
  });

  const openDialog = (user) => {
    setSelectedUser(user);
    form.setValue('meals', user.remainingMeals);
    setIsDialogOpen(true);
  };
  
  const handleEditMeals = (values) => {
    if (selectedUser) {
      setUsers(prevUsers =>
        prevUsers.map(u =>
          u.id === selectedUser.id ? { ...u, remainingMeals: values.meals } : u
        )
      );
      toast({
        title: 'Meals Updated',
        description: `Updated meal balance for ${selectedUser.name}.`,
      });
      setIsDialogOpen(false);
      setSelectedUser(null);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Remaining Meals</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.remainingMeals}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => openDialog(user)}>
                    Edit Meals
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditMeals)}>
              <DialogHeader>
                <DialogTitle>Edit Meal Balance</DialogTitle>
                <DialogDescription>
                  Update the number of remaining meals for {selectedUser?.name}.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <FormField
                  control={form.control}
                  name="meals"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="meals" className="text-right">
                        Remaining Meals
                      </Label>
                      <Input id="meals" type="number" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
