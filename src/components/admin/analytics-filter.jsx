"use client"

import { useRouter, useSearchParams } from 'next/navigation'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function AnalyticsFilter({ users }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentUserId = searchParams.get('userId');

  const handleValueChange = (value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'all') {
      newParams.delete('userId');
    } else {
      newParams.set('userId', value);
    }
    router.push(`/admin/analytics?${newParams.toString()}`);
  }

  return (
    <div className="max-w-xs">
        <Select onValueChange={handleValueChange} defaultValue={currentUserId || 'all'}>
        <SelectTrigger>
            <SelectValue placeholder="Select a user" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            {users.map(user => (
            <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
            ))}
        </SelectContent>
        </Select>
    </div>
  )
}
