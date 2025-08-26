"use client";

import { useState } from 'react';
import { type MenuItem } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { setTodaysMenu } from '@/lib/data';

type MenuEditorProps = {
  allSabjis: MenuItem[];
  todaysMenu: MenuItem[];
};

export function MenuEditor({ allSabjis, todaysMenu }: MenuEditorProps) {
  const [selectedSabjis, setSelectedSabjis] = useState<string[]>(
    todaysMenu.map((item) => item.id)
  );
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleCheckboxChange = (sabjiId: string) => {
    setSelectedSabjis((prev) =>
      prev.includes(sabjiId)
        ? prev.filter((id) => id !== sabjiId)
        : [...prev, sabjiId]
    );
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    const selectedItems = allSabjis.filter(sabji => selectedSabjis.includes(sabji.id));
    await setTodaysMenu(selectedItems);
    setIsSaving(false);
    toast({
      title: 'Menu Updated',
      description: "Today's menu has been successfully saved.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allSabjis.map((sabji) => (
          <div
            key={sabji.id}
            className="flex items-center space-x-3 p-4 rounded-lg border bg-card has-[:checked]:bg-primary/10 has-[:checked]:border-primary"
          >
            <Checkbox
              id={sabji.id}
              checked={selectedSabjis.includes(sabji.id)}
              onCheckedChange={() => handleCheckboxChange(sabji.id)}
            />
            <label htmlFor={sabji.id} className="font-medium leading-none cursor-pointer">
                {sabji.name}
                <p className='text-sm text-muted-foreground'>{sabji.description}</p>
            </label>
          </div>
        ))}
      </div>
      <Button onClick={handleSaveChanges} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Today\'s Menu'}
      </Button>
    </div>
  );
}
