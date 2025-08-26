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

const orderSchema = z.object({
  mealChoice: z.enum(['Rice + 4 Rotis', '5 Rotis']),
});

type PlaceOrderFormProps = {
  remainingMeals: number;
};

export function PlaceOrderForm({ remainingMeals }: PlaceOrderFormProps) {
  const [lunchOrdered, setLunchOrdered] = useState(false);
  const [dinnerOrdered, setDinnerOrdered] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: { mealChoice: 'Rice + 4 Rotis' },
  });

  const handleOrder = (mealType: 'Lunch' | 'Dinner') => {
    if (remainingMeals <= 0) {
      toast({
        variant: 'destructive',
        title: 'No Meals Left',
        description: 'Please recharge your plan to order more meals.',
      });
      return;
    }

    const { mealChoice } = form.getValues();
    toast({
      title: 'Order Placed!',
      description: `Your ${mealType} order for "${mealChoice}" has been placed.`,
    });
    if (mealType === 'Lunch') {
      setLunchOrdered(true);
    } else {
      setDinnerOrdered(true);
    }
    // In a real app, this would trigger a server action to deduct a meal.
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
