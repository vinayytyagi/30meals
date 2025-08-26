'use client';

import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-day-picker/dist/style.css';

export function AnalyticsCalendar({ data }) {
  const [month, setMonth] = useState(new Date());

  const modifiers = {
    oneMeal: (date) => {
      const dateString = date.toISOString().split('T')[0];
      return data[dateString] === 1;
    },
    twoMeals: (date) => {
      const dateString = date.toISOString().split('T')[0];
      return data[dateString] >= 2;
    },
  };

  const modifiersStyles = {
    oneMeal: {
      backgroundColor: 'hsl(var(--primary) / 0.3)',
      color: 'hsl(var(--primary-foreground))',
      borderRadius: '9999px',
    },
    twoMeals: {
        backgroundColor: 'hsl(var(--primary) / 0.9)',
        color: 'hsl(var(--primary-foreground))',
        borderRadius: '9999px',
    },
  };

  return (
    <div className="w-full flex justify-center">
        <DayPicker
        month={month}
        onMonthChange={setMonth}
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        showOutsideDays
        fixedWeeks
        className="w-full max-w-sm"
        classNames={{
            months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
            month: 'space-y-4 w-full',
            caption: 'flex justify-center pt-1 relative items-center',
            caption_label: 'text-lg font-bold text-primary',
            nav: 'space-x-1 flex items-center',
            nav_button: cn(
            buttonVariants({ variant: 'outline' }),
            'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
            ),
            nav_button_previous: 'absolute left-1',
            nav_button_next: 'absolute right-1',
            table: 'w-full border-collapse space-y-1',
            head_row: 'flex w-full justify-between',
            head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
            row: 'flex w-full mt-2 justify-between',
            cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
            day: cn(
            buttonVariants({ variant: 'ghost' }),
            'h-9 w-9 p-0 font-normal aria-selected:opacity-100'
            ),
            day_selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
            day_today: 'bg-accent text-accent-foreground rounded-full',
            day_outside: 'text-muted-foreground opacity-50',
            day_disabled: 'text-muted-foreground opacity-50',
        }}
        components={{
            IconLeft: () => <ChevronLeft className="h-4 w-4" />,
            IconRight: () => <ChevronRight className="h-4 w-4" />,
        }}
        />
    </div>
  );
}
