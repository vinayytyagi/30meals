import { getLoggedInUser, getMessages } from '@/lib/data';
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

export default async function ChatPage() {
    // We only need the user ID here, the component will fetch the messages
    const user = await getLoggedInUser();
    const initialMessages = await getMessages(user.id);
  
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
            <Suspense fallback={<ChatFallback />}>
                <ChatInterface initialMessages={initialMessages} userId={user.id} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    );
}
