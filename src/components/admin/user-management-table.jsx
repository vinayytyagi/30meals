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
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

const editMealsSchema = z.object({
  meals: z.coerce.number().min(0, 'Cannot be negative').max(100, 'Cannot be more than 100'),
});

function Last5DaysCell({ data }) {
    const today = new Date();
    const dates = Array.from({ length: 5 }).map((_, i) => {
        const date = new Date();
        date.setDate(today.getDate() - i);
        return date;
    }).reverse();

    return (
        <TooltipProvider>
            <div className="flex gap-1">
                {data.map((mealCount, index) => (
                    <Tooltip key={index} delayDuration={100}>
                        <TooltipTrigger>
                            <div
                                className={cn(
                                'h-5 w-5 rounded-full',
                                mealCount === 0 && 'bg-gray-200 dark:bg-gray-700',
                                mealCount === 1 && 'bg-green-300 dark:bg-green-800',
                                mealCount >= 2 && 'bg-green-600 dark:bg-green-500'
                                )}
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{dates[index].toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}: {mealCount} meal(s)</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </div>
      </TooltipProvider>
    );
}

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
              <TableHead>Last 5 Days</TableHead>
              <TableHead>Remaining Meals</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <Last5DaysCell data={user.last5Days} />
                </TableCell>
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
