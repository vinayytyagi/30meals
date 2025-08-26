import { getAllUsers, getMessages } from '@/lib/data';
import { AdminChat } from '@/components/admin/admin-chat';

export default async function AdminChatPage() {
    const users = await getAllUsers();
    
    // For now, let's fetch messages for the first user by default.
    // The actual chat component will handle fetching messages for the selected user.
    const initialMessages = await getMessages(users[0]?.id || null);

    return (
        <div className="h-screen flex flex-col">
            <header className="p-4 sm:p-6 lg:p-8 border-b">
                <h1 className="font-headline text-4xl font-bold text-primary">
                    Admin Chat
                </h1>
                <p className="text-muted-foreground">
                    Communicate with your users directly.
                </p>
            </header>
            <div className="flex-1 overflow-hidden">
               <AdminChat users={users} initialMessages={initialMessages} />
            </div>
        </div>
    );
}
