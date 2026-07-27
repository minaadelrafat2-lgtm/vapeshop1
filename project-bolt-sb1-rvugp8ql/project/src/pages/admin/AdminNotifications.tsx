import { useEffect, useState } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { AdminPageHeader } from '@/components/admin/AdminLayout';
import { Badge, EmptyState, Skeleton } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { Notification } from '@/types';
import { timeAgo } from '@/lib/utils';

export default function AdminNotifications() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    if (!user) { setLoading(false); return; }
    const { data } = await supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    setRows((data ?? []) as Notification[]);
    setLoading(false);
  };

  useEffect(() => { fetch(); /* eslint-disable-next-line */ }, [user?.id]);

  const markRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setRows((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  const remove = async (id: string) => {
    await supabase.from('notifications').delete().eq('id', id);
    setRows((prev) => prev.filter((n) => n.id !== id));
  };

  const unread = rows.filter((n) => !n.is_read).length;

  return (
    <div>
      <AdminPageHeader title="Notifications" subtitle={`${unread} unread of ${rows.length} total`} />
      {loading ? <Skeleton className="h-64" /> : rows.length === 0 ? (
        <EmptyState icon={<Bell className="w-10 h-10" />} title="No notifications" description="You're all caught up." />
      ) : (
        <div className="space-y-2">
          {rows.map((n) => (
            <div key={n.id} className={`glass-card p-4 flex items-start gap-3 ${!n.is_read ? 'border-gold-500/30' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.type === 'contact' ? 'bg-accent-500/10 text-accent-400' : 'bg-gold-500/10 text-gold-400'}`}>
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-ink-100">{n.title}</p>
                  {!n.is_read && <Badge color="gold">New</Badge>}
                </div>
                <p className="text-sm text-ink-400 mt-0.5">{n.message}</p>
                <p className="text-xs text-ink-500 mt-1">{timeAgo(n.created_at)}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                {!n.is_read && <button onClick={() => markRead(n.id)} className="p-2 text-ink-400 hover:text-accent-400" aria-label="Mark read"><Check className="w-4 h-4" /></button>}
                <button onClick={() => remove(n.id)} className="p-2 text-ink-400 hover:text-error-500" aria-label="Delete"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
