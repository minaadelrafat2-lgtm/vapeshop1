import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useAdminTable } from '@/hooks/useAdminTable';
import { AdminPageHeader } from '@/components/admin/AdminLayout';
import { DataTable } from '@/components/admin/AdminComponents';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Card';
import { useToast } from '@/context/ToastContext';
import type { Category } from '@/types';

export default function AdminCategories() {
  const { rows, loading, remove } = useAdminTable<Category>('categories', 'sort_order', true);
  const { toast } = useToast();
  return (
    <div>
      <AdminPageHeader title="Categories" subtitle={`${rows.length} categories`} action={<Button><Plus className="w-4 h-4" /> Add Category</Button>} />
      <DataTable<Category>
        loading={loading}
        rows={rows}
        columns={[
          { key: 'name', label: 'Name', render: (c) => <span className="font-medium text-ink-100">{c.name}</span> },
          { key: 'slug', label: 'Slug', render: (c) => <span className="font-mono text-xs text-ink-400">{c.slug}</span> },
          { key: 'sort_order', label: 'Order' },
          { key: 'is_featured', label: 'Featured', render: (c) => <Badge color={c.is_featured ? 'gold' : 'neutral'}>{c.is_featured ? 'Yes' : 'No'}</Badge> },
          { key: 'actions', label: '', render: (c) => (
            <div className="flex gap-2">
              <button className="text-ink-400 hover:text-gold-300"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => { remove(c.id); toast('Category deleted', 'info'); }} className="text-ink-400 hover:text-error-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          ) },
        ]}
      />
    </div>
  );
}
