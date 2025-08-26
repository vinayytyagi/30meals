import { getAllUsers, getMessages } from '@/lib/data';
import { AdminChat } from '@/components/admin/admin-chat';
import { Suspense } from 'react';

function AdminChatFallback() {
    return (
        <div className="flex items-center justify-center h-full">
            <p>Loading Chat...</p>
        </div>
    )
}

export default async function AdminChatPage() {
    // Fetch initial data on the server
    const users = await getAllUsers();
    // Fetch messages for the first user by default to avoid delay on first load.
    const initialMessages = await getMessages(users[0]?.id || null);

    return (
        <div className="h-screen flex flex-col">
            <header className="p-4 sm:p-6 lg:p-8 border-b">
                <h1 className="font-headline text-4xl font-bold text-primary">
                    Admin Chat
                </h1>
                <p className="text-muted-foreground">
                    Communicate directly with your users. Select one or more to start.
                </p>
            </header>
            <div className="flex-1 overflow-hidden">
               <Suspense fallback={<AdminChatFallback />}>
                 <AdminChat users={users} initialMessages={initialMessages} />
               </Suspense>
            </div>
        </div>
    );
}
