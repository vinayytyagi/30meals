import { getLoggedInUser, getAnalyticsData } from '@/lib/data';
import { AnalyticsTabs } from '@/components/shared/analytics-tabs';
import { Suspense } from 'react';

function AnalyticsFallback() {
    return (
        <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
            <p>Loading Analytics...</p>
        </div>
    )
}

export default async function UserAnalyticsPage() {
  const user = await getLoggedInUser();
  const analytics = await getAnalyticsData(user.id);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <header>
        <h1 className="font-headline text-4xl font-bold text-primary">
          My Analytics
        </h1>
        <p className="text-muted-foreground">
          An overview of your personal meal ordering habits.
        </p>
      </header>

      <Suspense fallback={<AnalyticsFallback />}>
        <AnalyticsTabs analytics={analytics} role="user" />
      </Suspense>

    </div>
  );
}
