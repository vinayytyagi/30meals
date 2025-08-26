"use client";

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getLoggedInUser } from '@/lib/data';

const orderSchema = z.object({
  mealChoice: z.enum(['Rice + 4 Rotis', '5 Rotis']),
});

export function PlaceOrderForm({ remainingMeals: initialRemainingMeals }) {
  const [lunchOrdered, setLunchOrdered] = useState(false);
  const [dinnerOrdered, setDinnerOrdered] = useState(false);
  const [remainingMeals, setRemainingMeals] = useState(initialRemainingMeals);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: { mealChoice: 'Rice + 4 Rotis' },
  });

  const handleOrder = async (mealType) => {
    if (remainingMeals <= 0) {
      toast({
        variant: 'destructive',
        title: 'No Meals Left',
        description: 'Please recharge your plan to order more meals.',
      });
      return;
    }

    const { mealChoice } = form.getValues();
    
    // In a real app, this would trigger a server action to deduct a meal.
    try {
      const user = await getLoggedInUser();
      const newOrder = {
        userId: user.id,
        userName: user.name,
        mealType,
        mealChoice,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        deliveryOtp: Math.floor(100000 + Math.random() * 900000).toString(),
      };
      
      await addDoc(collection(db, 'orders'), newOrder);

      const userRef = doc(db, 'users', user.id);
      const newRemainingMeals = remainingMeals - 1;
      await updateDoc(userRef, { remainingMeals: newRemainingMeals });
      setRemainingMeals(newRemainingMeals);
      
      toast({
        title: 'Order Placed!',
        description: `Your ${mealType} order for "${mealChoice}" has been placed.`,
      });

      if (mealType === 'Lunch') {
        setLunchOrdered(true);
      } else {
        setDinnerOrdered(true);
      }
    } catch (error) {
      console.error("Order placement failed", error);
      toast({
        variant: 'destructive',
        title: 'Order Failed',
        description: 'Could not place your order. Please try again.',
      });
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
        <Separator />
        <FormField
          control={form.control}
          name="mealChoice"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-semibold">Choose Your Base</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-8"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Rice + 4 Rotis" />
                    </FormControl>
                    <FormLabel className="font-normal">Rice + 4 Rotis</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="5 Rotis" />
                    </FormControl>
                    <FormLabel className="font-normal">5 Rotis</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            type="button"
            className="flex-1"
            size="lg"
            onClick={() => handleOrder('Lunch')}
            disabled={lunchOrdered || remainingMeals <= 0}
          >
            {lunchOrdered ? 'Lunch Ordered' : 'Order Lunch'}
          </Button>
          <Button
            type="button"
            className="flex-1"
            size="lg"
            onClick={() => handleOrder('Dinner')}
            disabled={dinnerOrdered || remainingMeals <= 0}
          >
            {dinnerOrdered ? 'Dinner Ordered' : 'Order Dinner'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
