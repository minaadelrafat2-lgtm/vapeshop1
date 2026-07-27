import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useAdminTable } from '@/hooks/useAdminTable';
import { AdminPageHeader } from '@/components/admin/AdminLayout';
import { DataTable } from '@/components/admin/AdminComponents';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Card';
import { useToast } from '@/context/ToastContext';
import type { Employee } from '@/types';
import { formatDate } from '@/lib/utils';

export default function AdminEmployees() {
  const { rows, loading, remove } = useAdminTable<Employee>('employees', 'created_at', false);
  const { toast } = useToast();
  return (
    <div>
      <AdminPageHeader title="Employees" subtitle={`${rows.length} team members`} action={<Button><Plus className="w-4 h-4" /> Add Employee</Button>} />
      <DataTable<Employee>
        loading={loading}
        rows={rows}
        columns={[
          { key: 'name', label: 'Name', render: (e) => <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-gold-500/15 text-gold-300 flex items-center justify-center text-sm font-bold">{e.first_name.charAt(0)}</div><div><p className="font-medium text-ink-100">{e.first_name} {e.last_name}</p><p className="text-xs text-ink-500">{e.email}</p></div></div> },
          { key: 'position', label: 'Position', render: (e) => <span className="text-ink-300">{e.position ?? '—'}</span> },
          { key: 'phone', label: 'Phone', render: (e) => <span className="text-ink-300">{e.phone ?? '—'}</span> },
          { key: 'hire_date', label: 'Hired', render: (e) => <span className="text-ink-300">{e.hire_date ? formatDate(e.hire_date) : '—'}</span> },
          { key: 'status', label: 'Status', render: (e) => <Badge color={e.status === 'active' ? 'success' : 'neutral'}>{e.status}</Badge> },
          { key: 'actions', label: '', render: (e) => (
            <div className="flex gap-2">
              <button className="text-ink-400 hover:text-gold-300"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => { remove(e.id); toast('Employee removed', 'info'); }} className="text-ink-400 hover:text-error-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          ) },
        ]}
      />
    </div>
  );
}
