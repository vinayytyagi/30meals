"use client"
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

export function Last5DaysCell({ data }) {
    const today = new Date();
    const dates = Array.from({ length: 5 }).map((_, i) => {
        const date = new Date();
        date.setDate(today.getDate() - (4 - i));
        return date;
    });

    if (!data) {
        return null;
    }

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
