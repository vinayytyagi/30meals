import { BroadcastForm } from '@/components/admin/broadcast-form';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
  
  export default function BroadcastPage() {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        <header>
          <h1 className="font-headline text-4xl font-bold text-primary">
            Broadcast Message
          </h1>
          <p className="text-muted-foreground">
            Send a notification to all users in-app and on WhatsApp.
          </p>
        </header>
  
        <Card className="shadow-lg max-w-2xl">
          <CardHeader>
            <CardTitle>Compose Message</CardTitle>
            <CardDescription>
              This message will be sent to all registered users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BroadcastForm />
          </CardContent>
        </Card>
      </div>
    );
  }