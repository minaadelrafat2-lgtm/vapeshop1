import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, DollarSign, Package, Users, TrendingUp, ArrowRight, Activity } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AdminPageHeader } from '@/components/admin/AdminLayout';
import { StatCard } from '@/components/admin/AdminComponents';
import { Skeleton, Badge } from '@/components/ui/Card';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, products: 0, customers: 0 });
  const [recentOrders, setRecentOrders] = useState<import('@/types').Order[]>([]);
  const [lowStock, setLowStock] = useState<import('@/types').Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [o, p, c, lo, ls] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('customers').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('products').select('*').lt('stock', 10).limit(5),
      ]);
      const orders = (o.data ?? []) as import('@/types').Order[];
      setRecentOrders(orders);
      setLowStock((ls.data ?? []) as import('@/types').Product[]);
      setStats({
        orders: lo.count ?? 0,
        revenue: orders.reduce((s, o) => s + Number(o.grand_total), 0),
        products: p.count ?? 0,
        customers: c.count ?? 0,
      });
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <AdminPageHeader title="Dashboard" subtitle="Welcome back — here's what's happening today." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)
        ) : (
          <>
            <StatCard icon={DollarSign} label="Total Revenue" value={formatCurrency(stats.revenue)} change={12.5} accent="gold" />
            <StatCard icon={ShoppingCart} label="Total Orders" value={stats.orders} change={8.2} accent="accent" />
            <StatCard icon={Package} label="Products" value={stats.products} accent="warning" />
            <StatCard icon={Users} label="Customers" value={stats.customers} change={5.1} accent="gold" />
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-ink-50">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-gold-300 hover:text-gold-200 flex items-center gap-1">View all <ArrowRight className="w-4 h-4" /></Link>
          </div>
          {loading ? <Skeleton className="h-64" /> : (
            <div className="glass-card overflow-hidden">
              <table className="w-full">
                <thead><tr className="border-b border-white/10">
                  {['Order', 'Date', 'Status', 'Total'].map((h) => <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-ink-400">{h}</th>)}
                </tr></thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-5 py-3.5 text-sm font-mono text-gold-300">{o.order_number}</td>
                      <td className="px-5 py-3.5 text-sm text-ink-300">{formatDate(o.placed_at)}</td>
                      <td className="px-5 py-3.5"><Badge color={o.status === 'delivered' ? 'success' : 'gold'}>{o.status}</Badge></td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-ink-100">{formatCurrency(o.grand_total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low stock */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-ink-50">Low Stock Alert</h2>
            <Link to="/admin/inventory" className="text-sm text-gold-300 hover:text-gold-200 flex items-center gap-1">Manage <ArrowRight className="w-4 h-4" /></Link>
          </div>
          {loading ? <Skeleton className="h-48" /> : lowStock.length === 0 ? (
            <div className="glass-card p-8 text-center text-ink-400 text-sm">All products well stocked</div>
          ) : (
            <div className="space-y-2">
              {lowStock.map((p) => (
                <div key={p.id} className="glass-card p-4 flex items-center justify-between">
                  <div><p className="text-sm font-medium text-ink-100">{p.name}</p><p className="text-xs text-ink-500">SKU: {p.sku ?? '—'}</p></div>
                  <Badge color={p.stock === 0 ? 'error' : 'warning'}>{p.stock} left</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Activity placeholder */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-ink-50 mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-gold-400" /> Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Add Product', to: '/admin/products', icon: Package },
            { label: 'View Orders', to: '/admin/orders', icon: ShoppingCart },
            { label: 'Manage Inventory', to: '/admin/inventory', icon: TrendingUp },
            { label: 'Add Employee', to: '/admin/employees', icon: Users },
          ].map((a) => (
            <Link key={a.label} to={a.to} className="glass-card p-5 card-hover flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-400"><a.icon className="w-5 h-5" /></div>
              <span className="text-sm font-medium text-ink-100">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
