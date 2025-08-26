import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { NotificationScheduler } from '@/components/admin/notification-scheduler';

export default function NotificationsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <header>
        <h1 className="font-headline text-4xl font-bold text-primary">
          AI Notification Scheduler
        </h1>
        <p className="text-muted-foreground">
          Get AI-powered recommendations for the best time to send notifications.
        </p>
      </header>

      <NotificationScheduler />
    </div>
  );
}
