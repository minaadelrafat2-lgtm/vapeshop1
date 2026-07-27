import { Plus, Trash2, KeyRound } from 'lucide-react';
import { useAdminTable } from '@/hooks/useAdminTable';
import { AdminPageHeader } from '@/components/admin/AdminLayout';
import { DataTable } from '@/components/admin/AdminComponents';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Card';
import { useToast } from '@/context/ToastContext';
import type { Permission } from '@/types';

export default function AdminPermissions() {
  const { rows, loading, remove } = useAdminTable<Permission>('permissions', 'module', true);
  const { toast } = useToast();
  return (
    <div>
      <AdminPageHeader title="Permissions" subtitle={`${rows.length} permissions across modules`} action={<Button><Plus className="w-4 h-4" /> Add Permission</Button>} />
      <DataTable<Permission>
        loading={loading}
        rows={rows}
        columns={[
          { key: 'name', label: 'Permission', render: (p) => <div className="flex items-center gap-2"><KeyRound className="w-4 h-4 text-gold-400" /><span className="font-mono text-sm text-ink-100">{p.name}</span></div> },
          { key: 'description', label: 'Description', render: (p) => <span className="text-ink-300">{p.description ?? '—'}</span> },
          { key: 'module', label: 'Module', render: (p) => <Badge color="gold">{p.module}</Badge> },
          { key: 'actions', label: '', render: (p) => (
            <button onClick={() => { remove(p.id); toast('Permission deleted', 'info'); }} className="text-ink-400 hover:text-error-500"><Trash2 className="w-4 h-4" /></button>
          ) },
        ]}
      />
    </div>
  );
}
