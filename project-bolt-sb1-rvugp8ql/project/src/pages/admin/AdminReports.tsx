import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AdminPageHeader } from '@/components/admin/AdminLayout';
import { StatCard } from '@/components/admin/AdminComponents';
import { Skeleton, Badge } from '@/components/ui/Card';
import type { Order } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminReports() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      setOrders((data ?? []) as Order[]);
      setLoading(false);
    })();
  }, []);

  const revenue = orders.reduce((s, o) => s + Number(o.grand_total), 0);
  const avgOrder = orders.length ? revenue / orders.length : 0;
  const byStatus = orders.reduce<Record<string, number>>((acc, o) => { acc[o.status] = (acc[o.status] ?? 0) + 1; return acc; }, {});

  return (
    <div>
      <AdminPageHeader title="Reports" subtitle="Sales and operational reports." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading ? Array.from({length:4}).map((_,i)=><Skeleton key={i} className="h-28"/>) : (
          <>
            <StatCard icon={DollarSign} label="Total Revenue" value={formatCurrency(revenue)} change={12.5} accent="gold" />
            <StatCard icon={ShoppingCart} label="Total Orders" value={orders.length} change={8.2} accent="accent" />
            <StatCard icon={TrendingUp} label="Avg. Order Value" value={formatCurrency(avgOrder)} accent="gold" />
            <StatCard icon={BarChart3} label="Pending" value={byStatus.pending ?? 0} accent="warning" />
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="font-semibold text-ink-50 mb-4">Orders by Status</h3>
          {loading ? <Skeleton className="h-48" /> : (
            <div className="space-y-3">
              {Object.entries(byStatus).map(([status, count]) => {
                const pct = orders.length ? (count / orders.length) * 100 : 0;
                return (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1"><span className="text-ink-300 capitalize">{status}</span><span className="text-ink-400">{count}</span></div>
                    <div className="h-2 bg-ink-800 rounded-full overflow-hidden"><div className="h-full bg-gold-sheen" style={{ width: `${pct}%` }} /></div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="glass-card p-6">
          <h3 className="font-semibold text-ink-50 mb-4">Recent Transactions</h3>
          {loading ? <Skeleton className="h-48" /> : (
            <div className="space-y-2">
              {orders.slice(0, 8).map((o) => (
                <div key={o.id} className="flex items-center justify-between text-sm border-b border-white/5 pb-2">
                  <div><p className="font-mono text-gold-300">{o.order_number}</p><p className="text-xs text-ink-500">{formatDate(o.placed_at)}</p></div>
                  <div className="flex items-center gap-2"><Badge color="gold">{o.status}</Badge><span className="font-semibold text-ink-100">{formatCurrency(o.grand_total)}</span></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
