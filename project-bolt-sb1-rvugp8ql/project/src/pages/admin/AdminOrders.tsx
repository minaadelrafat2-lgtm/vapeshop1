import { useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { useAdminTable } from '@/hooks/useAdminTable';
import { AdminPageHeader } from '@/components/admin/AdminLayout';
import { DataTable } from '@/components/admin/AdminComponents';
import { Badge } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import type { Order, OrderItem } from '@/types';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

export default function AdminOrders() {
  const { rows, loading } = useAdminTable<Order>('orders', 'created_at', false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);

  const filtered = rows.filter((o) => [o.order_number, o.status].join(' ').toLowerCase().includes(query.toLowerCase()));

  const view = async (o: Order) => {
    setSelected(o);
    const { data } = await supabase.from('order_items').select('*').eq('order_id', o.id);
    setItems((data ?? []) as OrderItem[]);
  };

  return (
    <div>
      <AdminPageHeader title="Orders" subtitle={`${rows.length} total orders`} />
      <div className="max-w-md mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search orders…" className="input pl-11" />
        </div>
      </div>
      <DataTable<Order>
        loading={loading}
        rows={filtered}
        columns={[
          { key: 'order_number', label: 'Order #', render: (o) => <span className="font-mono text-gold-300">{o.order_number}</span> },
          { key: 'placed_at', label: 'Date', render: (o) => <span className="text-ink-300">{formatDateTime(o.placed_at)}</span> },
          { key: 'status', label: 'Status', render: (o) => <Badge color={o.status === 'delivered' ? 'success' : o.status === 'cancelled' ? 'error' : 'gold'}>{o.status}</Badge> },
          { key: 'payment_status', label: 'Payment', render: (o) => <Badge color={o.payment_status === 'paid' ? 'accent' : 'warning'}>{o.payment_status}</Badge> },
          { key: 'grand_total', label: 'Total', render: (o) => <span className="font-semibold text-ink-100">{formatCurrency(o.grand_total)}</span> },
          { key: 'actions', label: '', render: (o) => <button onClick={() => view(o)} className="text-gold-300 hover:text-gold-200"><Eye className="w-4 h-4" /></button> },
        ]}
      />

      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Order ${selected?.order_number ?? ''}`} size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Info label="Status" value={<Badge color="gold">{selected.status}</Badge>} />
              <Info label="Payment" value={<Badge color={selected.payment_status === 'paid' ? 'accent' : 'warning'}>{selected.payment_status}</Badge>} />
              <Info label="Placed" value={formatDateTime(selected.placed_at)} />
              <Info label="Total" value={<span className="font-semibold text-gold-300">{formatCurrency(selected.grand_total)}</span>} />
            </div>
            {selected.tracking_number && <Info label="Tracking" value={`${selected.carrier ?? ''} ${selected.tracking_number}`} />}
            <div>
              <h4 className="font-semibold text-ink-50 mb-2">Items</h4>
              <div className="space-y-2">
                {items.map((it) => (
                  <div key={it.id} className="flex justify-between text-sm border-b border-white/5 pb-2">
                    <div><p className="text-ink-100">{it.product_name}</p>{it.variant_name && <p className="text-ink-400 text-xs">{it.variant_name}</p>}<p className="text-ink-400 text-xs">Qty {it.quantity} × {formatCurrency(it.price)}</p></div>
                    <span className="text-ink-100">{formatCurrency(it.line_total)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return <div><p className="text-xs text-ink-500 uppercase tracking-wider mb-1">{label}</p><div className="text-ink-100">{value}</div></div>;
}
