'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { getAnalyticsData } from '@/lib/data';
import { AnalyticsTabs } from '@/components/shared/analytics-tabs';
import { Suspense } from 'react';

function AnalyticsFallback() {
    return (
        <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
            <p>Loading Analytics...</p>
        </div>
    )
}

export default function UserAnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(authLoading) return;
    if(!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      const data = await getAnalyticsData(user.uid);
      setAnalytics(data);
      setLoading(false);
    }
    fetchData();
  }, [user, authLoading]);

  if(loading || authLoading) {
    return <AnalyticsFallback />;
  }

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
        {analytics ? (
            <AnalyticsTabs analytics={analytics} role="user" />
        ) : (
            <p>No analytics data available yet.</p>
        )}
    </div>
  );
}
