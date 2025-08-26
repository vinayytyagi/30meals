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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits.'),
});

export function OrdersTable({ orders: initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const openDialog = (order) => {
    setSelectedOrder(order);
    form.reset();
    setIsDialogOpen(true);
  };

  const handleConfirmDelivery = async (values) => {
    if (selectedOrder && values.otp === selectedOrder.deliveryOtp) {
      const orderRef = doc(db, 'orders', selectedOrder.id);
      await updateDoc(orderRef, { status: 'Delivered' });

      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: 'Delivered' } : o
        )
      );
      toast({
        title: 'Delivery Confirmed',
        description: `Order for ${selectedOrder.userName} marked as delivered.`,
      });
      setIsDialogOpen(false);
      setSelectedOrder(null);
    } else {
      form.setError('otp', {
        type: 'manual',
        message: 'Invalid OTP. Please check and try again.',
      });
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Meal</TableHead>
              <TableHead>Choice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.userName}</TableCell>
                <TableCell>{order.mealType}</TableCell>
                <TableCell>{order.mealChoice}</TableCell>
                <TableCell>
                  <Badge variant={order.status === 'Delivered' ? 'default' : 'outline'} className={order.status === 'Delivered' ? 'bg-green-600 text-white' : ''}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {order.status === 'Pending' && (
                    <Button size="sm" onClick={() => openDialog(order)}>
                      Mark Delivered
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleConfirmDelivery)}>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Delivery</AlertDialogTitle>
                <AlertDialogDescription>
                  Please enter the 6-digit OTP provided by the user to confirm the delivery for {selectedOrder?.userName}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4">
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <Input {...field} placeholder="Enter OTP" autoFocus />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction type="submit">Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
