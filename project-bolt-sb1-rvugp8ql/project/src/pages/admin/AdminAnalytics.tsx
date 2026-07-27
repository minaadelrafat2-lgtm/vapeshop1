import { useEffect, useState } from 'react';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AdminPageHeader } from '@/components/admin/AdminLayout';
import { StatCard } from '@/components/admin/AdminComponents';
import { Skeleton } from '@/components/ui/Card';

export default function AdminAnalytics() {
  const [data, setData] = useState({ orders: 0, products: 0, customers: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [o, p, c] = await Promise.all([
        supabase.from('orders').select('grand_total'),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('customers').select('*', { count: 'exact', head: true }),
      ]);
      const orders = (o.data ?? []) as Pick<import('@/types').Order, 'grand_total'>[];
      setData({
        orders: orders.length,
        products: p.count ?? 0,
        customers: c.count ?? 0,
        revenue: orders.reduce((s, o) => s + Number(o.grand_total), 0),
      });
      setLoading(false);
    })();
  }, []);

  // Simulated chart data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const chartData = [42, 58, 71, 65, 89, 94, 78];

  return (
    <div>
      <AdminPageHeader title="Analytics" subtitle="Business performance insights." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading ? Array.from({length:4}).map((_,i)=><Skeleton key={i} className="h-28"/>) : (
          <>
            <StatCard icon={DollarSign} label="Revenue" value={`$${data.revenue.toLocaleString()}`} change={15.3} accent="gold" />
            <StatCard icon={ShoppingCart} label="Orders" value={data.orders} change={9.1} accent="accent" />
            <StatCard icon={Users} label="Customers" value={data.customers} change={6.7} accent="gold" />
            <StatCard icon={Package} label="Products" value={data.products} accent="warning" />
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bar chart */}
        <div className="glass-card p-6">
          <h3 className="font-semibold text-ink-50 mb-4">Monthly Sales Trend</h3>
          {loading ? <Skeleton className="h-56" /> : (
            <div className="flex items-end justify-between gap-2 h-56">
              {chartData.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gradient-to-t from-gold-600 to-gold-400 rounded-t-lg transition-all hover:opacity-80" style={{ height: `${v}%` }} />
                  <span className="text-xs text-ink-400">{months[i]}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Donut-ish */}
        <div className="glass-card p-6">
          <h3 className="font-semibold text-ink-50 mb-4">Growth Indicators</h3>
          <div className="space-y-4">
            {[
              { label: 'Revenue Growth', value: '+15.3%', up: true },
              { label: 'Order Volume', value: '+9.1%', up: true },
              { label: 'Customer Acquisition', value: '+6.7%', up: true },
              { label: 'Cart Abandonment', value: '-2.4%', up: false },
              { label: 'Return Rate', value: '-1.1%', up: false },
            ].map((m) => (
              <div key={m.label} className="flex items-center justify-between">
                <span className="text-sm text-ink-300">{m.label}</span>
                <span className={`flex items-center gap-1 text-sm font-semibold ${m.up ? 'text-accent-400' : 'text-error-400'}`}>
                  {m.up ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
