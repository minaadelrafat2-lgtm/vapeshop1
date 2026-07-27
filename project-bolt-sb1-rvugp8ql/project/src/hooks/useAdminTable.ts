import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useAdminTable<T extends { id: string }>(table: string, orderBy = 'created_at', ascending = false) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from(table).select('*').order(orderBy, { ascending });
    if (error) setError(error.message);
    setRows((data ?? []) as T[]);
    setLoading(false);
  }, [table, orderBy, ascending]);

  useEffect(() => { fetch(); }, [fetch]);

  const remove = async (id: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) return { error: error.message };
    setRows((prev) => prev.filter((r) => r.id !== id));
    return { error: null };
  };

  const update = async (id: string, patch: Partial<T>): Promise<{ error: string | null }> => {
    const { error } = await supabase.from(table).update(patch).eq('id', id);
    if (error) return { error: error.message };
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    return { error: null };
  };

  return { rows, loading, error, refetch: fetch, remove, update };
}
