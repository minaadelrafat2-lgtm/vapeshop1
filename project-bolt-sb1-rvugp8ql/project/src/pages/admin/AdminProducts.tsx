import { useState } from 'react';
import { Search, Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminTable } from '@/hooks/useAdminTable';
import { AdminPageHeader } from '@/components/admin/AdminLayout';
import { DataTable } from '@/components/admin/AdminComponents';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Card';
import { useToast } from '@/context/ToastContext';
import type { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function AdminProducts() {
  const { rows, loading, remove } = useAdminTable<Product>('products', 'created_at', false);
  const { toast } = useToast();
  const [query, setQuery] = useState('');

  const filtered = rows.filter((p) => [p.name, p.sku].join(' ').toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <AdminPageHeader title="Products" subtitle={`${rows.length} products in catalog`} action={<Button><Plus className="w-4 h-4" /> Add Product</Button>} />
      <div className="max-w-md mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products…" className="input pl-11" />
        </div>
      </div>
      <DataTable<Product>
        loading={loading}
        rows={filtered}
        columns={[
          { key: 'name', label: 'Product', render: (p) => <div><p className="font-medium text-ink-100">{p.name}</p><p className="text-xs text-ink-500">{p.sku ?? '—'}</p></div> },
          { key: 'price', label: 'Price', render: (p) => <span className="text-gold-300">{formatCurrency(p.price)}</span> },
          { key: 'stock', label: 'Stock', render: (p) => <Badge color={p.stock === 0 ? 'error' : p.stock < 10 ? 'warning' : 'accent'}>{p.stock}</Badge> },
          { key: 'is_featured', label: 'Flags', render: (p) => (
            <div className="flex flex-wrap gap-1">
              {p.is_featured && <Badge color="gold">F</Badge>}
              {p.is_best_seller && <Badge color="accent">BS</Badge>}
              {p.is_new_arrival && <Badge color="success">N</Badge>}
              {p.is_flash_sale && <Badge color="warning">FS</Badge>}
            </div>
          ) },
          { key: 'is_active', label: 'Status', render: (p) => <Badge color={p.is_active ? 'success' : 'neutral'}>{p.is_active ? 'Active' : 'Hidden'}</Badge> },
          { key: 'actions', label: '', render: (p) => (
            <div className="flex gap-2">
              <Link to={`/product/${p.slug}`} className="text-ink-400 hover:text-gold-300"><Eye className="w-4 h-4" /></Link>
              <button className="text-ink-400 hover:text-gold-300"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => { remove(p.id); toast('Product deleted', 'info'); }} className="text-ink-400 hover:text-error-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          ) },
        ]}
      />
    </div>
  );
}
