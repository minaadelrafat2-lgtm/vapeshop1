import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Clock, DollarSign, TrendingUp, Users, Building2 } from 'lucide-react';
import { useAdminTable } from '@/hooks/useAdminTable';
import { AdminPageHeader } from '@/components/admin/AdminLayout';
import { DataTable, StatCard } from '@/components/admin/AdminComponents';
import { Button } from '@/components/ui/Button';
import { Badge, Skeleton } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';
import type { Branch, Employee, Expense } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function AdminBranches() {
  const { rows, loading, remove } = useAdminTable<Branch>('branches', 'name', true);
  const { toast } = useToast();
  const [selected, setSelected] = useState<Branch | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  const viewDetail = async (b: Branch) => {
    setSelected(b);
    setDetailLoading(true);
    const [{ data: emps }, { data: exps }] = await Promise.all([
      supabase.from('employees').select('*').eq('branch_id', b.id).order('first_name'),
      supabase.from('expenses').select('*').eq('branch_id', b.id).order('created_at', { ascending: false }).limit(10),
    ]);
    setEmployees((emps ?? []) as Employee[]);
    setExpenses((exps ?? []) as Expense[]);
    setDetailLoading(false);
  };

  const totalExpenses = rows.length ? null : null; // placeholder; computed per-branch in modal
  const activeCount = rows.filter((b) => b.is_active).length;

  return (
    <div>
      <AdminPageHeader title="Branches" subtitle={`${rows.length} branches — ${activeCount} active`} action={<Button><Plus className="w-4 h-4" /> Add Branch</Button>} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />) : (
          <>
            <StatCard icon={Building2} label="Total Branches" value={rows.length} accent="gold" />
            <StatCard icon={Building2} label="Active" value={activeCount} accent="accent" />
            <StatCard icon={Users} label="Total Employees" value={rows.filter((b) => b.manager_id).length} accent="warning" />
            <StatCard icon={Building2} label="Countries" value={new Set(rows.map((b) => b.country)).size} accent="gold" />
          </>
        )}
      </div>

      <DataTable<Branch>
        loading={loading}
        rows={rows}
        columns={[
          { key: 'name', label: 'Branch', render: (b) => <div><p className="font-medium text-ink-100">{b.name}</p><p className="text-xs text-ink-500 font-mono">{b.code}</p></div> },
          { key: 'address', label: 'Address', render: (b) => <span className="text-ink-300">{b.address}, {b.city}, {b.state ?? ''}</span> },
          { key: 'manager', label: 'Manager', render: (b) => <span className="text-ink-300">{b.manager ?? '—'}</span> },
          { key: 'opening_hours', label: 'Hours', render: (b) => {
            const hours = b.opening_hours;
            const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
            const todayHours = hours[today] ?? hours[today.charAt(0).toUpperCase() + today.slice(1)] ?? '—';
            return <span className="text-ink-400 text-xs">{todayHours}</span>;
          } },
          { key: 'is_active', label: 'Status', render: (b) => <Badge color={b.is_active ? 'success' : 'neutral'}>{b.is_active ? 'Active' : 'Inactive'}</Badge> },
          { key: 'actions', label: '', render: (b) => (
            <div className="flex gap-2">
              <button onClick={() => viewDetail(b)} className="text-ink-400 hover:text-gold-300" title="View details"><Building2 className="w-4 h-4" /></button>
              <button className="text-ink-400 hover:text-gold-300"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => { remove(b.id); toast('Branch deleted', 'info'); }} className="text-ink-400 hover:text-error-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          ) },
        ]}
      />

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ''} size="lg">
        {selected && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <Info label="Code" value={selected.code} />
              <Info label="Status" value={<Badge color={selected.is_active ? 'success' : 'neutral'}>{selected.is_active ? 'Active' : 'Inactive'}</Badge>} />
              <Info label="Manager" value={selected.manager ?? '—'} />
              <Info label="Phone" value={selected.phone ?? '—'} />
              <Info label="Email" value={selected.email ?? '—'} />
              <Info label="Address" value={`${selected.address}, ${selected.city}, ${selected.state ?? ''} ${selected.postal_code ?? ''}`} />
            </div>

            <div>
              <h4 className="font-semibold text-ink-50 mb-2 flex items-center gap-2"><Clock className="w-4 h-4 text-gold-400" /> Opening Hours</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map((day) => (
                  <div key={day} className="glass rounded-lg px-3 py-2">
                    <p className="text-xs text-ink-500">{day.slice(0, 3)}</p>
                    <p className="text-sm text-ink-200">{selected.opening_hours[day] ?? 'Closed'}</p>
                  </div>
                ))}
              </div>
            </div>

            {detailLoading ? <Skeleton className="h-32" /> : (
              <>
                <div>
                  <h4 className="font-semibold text-ink-50 mb-2 flex items-center gap-2"><Users className="w-4 h-4 text-gold-400" /> Employees ({employees.length})</h4>
                  <div className="space-y-2 max-h-40 overflow-auto">
                    {employees.length === 0 ? <p className="text-ink-400 text-sm">No employees assigned</p> : employees.map((e) => (
                      <div key={e.id} className="flex items-center justify-between text-sm border-b border-white/5 pb-1.5">
                        <span className="text-ink-100">{e.first_name} {e.last_name}</span>
                        <span className="text-ink-400 text-xs">{e.position ?? '—'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-ink-50 mb-2 flex items-center gap-2"><DollarSign className="w-4 h-4 text-gold-400" /> Recent Expenses ({expenses.length})</h4>
                  <div className="space-y-2 max-h-40 overflow-auto">
                    {expenses.length === 0 ? <p className="text-ink-400 text-sm">No expenses recorded</p> : expenses.map((e) => (
                      <div key={e.id} className="flex items-center justify-between text-sm border-b border-white/5 pb-1.5">
                        <div><span className="text-ink-100">{e.description}</span><span className="text-ink-400 text-xs ml-2">{e.category}</span></div>
                        <span className="text-ink-100">{formatCurrency(e.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return <div><p className="text-xs text-ink-500 uppercase tracking-wider mb-1">{label}</p><div className="text-ink-100">{value}</div></div>;
}
