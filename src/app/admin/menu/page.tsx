import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getAllSabjis, getTodaysMenu } from '@/lib/data';
import { MenuEditor } from '@/components/admin/menu-editor';

export default async function SetMenuPage() {
  const allSabjis = await getAllSabjis();
  const todaysMenu = await getTodaysMenu();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <header>
        <h1 className="font-headline text-4xl font-bold text-primary">Set Daily Menu</h1>
        <p className="text-muted-foreground">Select the sabjis available for today's meals.</p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Menu Editor</CardTitle>
          <CardDescription>
            Choose from the list below to update today's menu.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MenuEditor allSabjis={allSabjis} todaysMenu={todaysMenu} />
        </CardContent>
      </Card>
    </div>
  );
}
