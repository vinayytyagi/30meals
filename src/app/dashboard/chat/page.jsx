'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { getMessages } from '@/lib/data';
import { ChatInterface } from '@/components/user/chat-interface';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
import { Suspense } from 'react';

function ChatFallback() {
    return (
        <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
            <p>Loading Chat Interface...</p>
        </div>
    )
}

export default function ChatPage() {
    const { user, loading: authLoading } = useAuth();
    const [initialMessages, setInitialMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(authLoading) return;
        if(!user) {
            setLoading(false);
            return;
        }

        const fetchInitialMessages = async () => {
            const msgs = await getMessages(user.uid);
            setInitialMessages(msgs);
            setLoading(false);
        }
        fetchInitialMessages();
    }, [user, authLoading]);
  
    if (loading || authLoading) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 space-y-8">
                <header>
                    <h1 className="font-headline text-4xl font-bold text-primary">
                        Chat with Admin
                    </h1>
                    <p className="text-muted-foreground">
                        Ask questions or view broadcast messages from the admin team.
                    </p>
                </header>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Conversation</CardTitle>
                        <CardDescription>
                            This is your direct message channel with the 30meals admin.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChatFallback />
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!user) {
        return <div className="p-8">Please login to access the chat.</div>
    }

    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        <header>
          <h1 className="font-headline text-4xl font-bold text-primary">
            Chat with Admin
          </h1>
          <p className="text-muted-foreground">
            Ask questions or view broadcast messages from the admin team.
          </p>
        </header>
  
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Conversation</CardTitle>
            <CardDescription>
                This is your direct message channel with the 30meals admin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChatInterface initialMessages={initialMessages} userId={user.uid} />
          </CardContent>
        </Card>
      </div>
    );
}
