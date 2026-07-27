import { useState } from 'react';
import { Search, Mail, Phone, Award } from 'lucide-react';
import { useAdminTable } from '@/hooks/useAdminTable';
import { AdminPageHeader } from '@/components/admin/AdminLayout';
import { DataTable } from '@/components/admin/AdminComponents';
import { Badge } from '@/components/ui/Card';
import type { Customer } from '@/types';
import { formatDate } from '@/lib/utils';

export default function AdminCustomers() {
  const { rows, loading } = useAdminTable<Customer>('customers', 'created_at', false);
  const [query, setQuery] = useState('');
  const filtered = rows.filter((c) => [c.first_name, c.last_name, c.phone].join(' ').toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <AdminPageHeader title="Customers" subtitle={`${rows.length} registered customers`} />
      <div className="max-w-md mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search customers…" className="input pl-11" />
        </div>
      </div>
      <DataTable<Customer>
        loading={loading}
        rows={filtered}
        columns={[
          { key: 'name', label: 'Name', render: (c) => <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-gold-500/15 text-gold-300 flex items-center justify-center text-sm font-bold">{(c.first_name ?? 'U').charAt(0)}</div><span className="font-medium text-ink-100">{c.first_name} {c.last_name}</span></div> },
          { key: 'phone', label: 'Phone', render: (c) => <span className="text-ink-300">{c.phone ?? '—'}</span> },
          { key: 'loyalty_points', label: 'Loyalty', render: (c) => <Badge color="gold"><Award className="w-3 h-3" /> {c.loyalty_points}</Badge> },
          { key: 'marketing_opt_in', label: 'Marketing', render: (c) => <Badge color={c.marketing_opt_in ? 'accent' : 'neutral'}>{c.marketing_opt_in ? 'Opted in' : 'Out'}</Badge> },
          { key: 'created_at', label: 'Joined', render: (c) => <span className="text-ink-300">{formatDate(c.created_at)}</span> },
        ]}
      />
    </div>
  );
}
