import { getAnalyticsData, getAllUsers } from '@/lib/data';
import { AnalyticsTabs } from '@/components/shared/analytics-tabs';
import { AnalyticsFilter } from '@/components/admin/analytics-filter';
import { Suspense } from 'react';

function AnalyticsFallback() {
    return (
        <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
            <p>Loading Analytics...</p>
        </div>
    )
}

export default async function AdminAnalyticsPage({ searchParams }) {
  const userId = searchParams.userId || null;
  const users = await getAllUsers();
  const analytics = await getAnalyticsData(userId);
  const selectedUser = userId ? users.find(u => u.id === userId) : null;
  
  const title = selectedUser ? `${selectedUser.name}'s Analytics` : "Service Analytics";
  const description = selectedUser ? `An overview of ${selectedUser.name}'s habits.` : "An overview of meal ordering trends across all users.";

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <header>
        <h1 className="font-headline text-4xl font-bold text-primary">
          {title}
        </h1>
        <p className="text-muted-foreground">
          {description}
        </p>
      </header>
      
      <AnalyticsFilter users={users} />

      <Suspense fallback={<AnalyticsFallback />} key={userId}>
        <AnalyticsTabs analytics={analytics} />
      </Suspense>
      
    </div>
  );
}
