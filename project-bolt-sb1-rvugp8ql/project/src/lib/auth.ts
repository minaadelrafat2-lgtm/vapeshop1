import { supabase } from '@/lib/supabase';
import type { Profile, UserRole } from '@/types';

export const STAFF_ROLES: UserRole[] = [
  'admin', 'manager', 'staff',
  'super_admin', 'company_owner', 'general_manager',
  'warehouse_manager', 'branch_manager', 'inventory_employee',
  'sales_employee', 'marketing', 'accountant', 'customer_support',
];

export function isStaffRole(role: UserRole | undefined | null): boolean {
  return !!role && STAFF_ROLES.includes(role);
}

export function isAdminRole(role: UserRole | undefined | null): boolean {
  return role === 'admin' || role === 'super_admin' || role === 'company_owner';
}

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error) return null;
  return data as Profile | null;
}

export async function checkPermission(permission: string): Promise<boolean> {
  try {
    const { data } = await supabase.rpc('has_permission', { p_permission: permission });
    return data === true;
  } catch {
    return false;
  }
}

export async function checkIsStaff(): Promise<boolean> {
  try {
    const { data } = await supabase.rpc('is_staff');
    return data === true;
  } catch {
    return false;
  }
}

export async function logActivity(
  action: string,
  entityType?: string,
  entityId?: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  await supabase.rpc('log_activity', {
    p_action: action,
    p_entity_type: entityType ?? null,
    p_entity_id: entityId ?? null,
    p_metadata: metadata ?? null,
  });
}

const SESSION_TIMEOUT_KEY = 'luxe_session_expires';
const REMEMBER_KEY = 'luxe_remember_me';

export function setSessionExpiry(remember: boolean): void {
  const ttl = remember ? 30 * 24 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000;
  localStorage.setItem(REMEMBER_KEY, remember ? 'true' : 'false');
  localStorage.setItem(SESSION_TIMEOUT_KEY, String(Date.now() + ttl));
}

export function isSessionExpired(): boolean {
  const exp = localStorage.getItem(SESSION_TIMEOUT_KEY);
  if (!exp) return false;
  return Date.now() > parseInt(exp, 10);
}

export function clearSessionExpiry(): void {
  localStorage.removeItem(SESSION_TIMEOUT_KEY);
  localStorage.removeItem(REMEMBER_KEY);
}

export function getRememberPreference(): boolean {
  return localStorage.getItem(REMEMBER_KEY) === 'true';
}

const FAILED_LOGIN_KEY = 'luxe_failed_logins';
const LOCK_THRESHOLD = 5;

export function recordFailedLogin(email: string): number {
  let store: Record<string, number> = {};
  try {
    const raw = localStorage.getItem(FAILED_LOGIN_KEY);
    store = raw ? JSON.parse(raw) : {};
  } catch { store = {}; }
  store[email] = (store[email] ?? 0) + 1;
  localStorage.setItem(FAILED_LOGIN_KEY, JSON.stringify(store));
  return store[email];
}

export function clearFailedLogins(email: string): void {
  try {
    const raw = localStorage.getItem(FAILED_LOGIN_KEY);
    if (!raw) return;
    const store: Record<string, number> = JSON.parse(raw);
    delete store[email];
    localStorage.setItem(FAILED_LOGIN_KEY, JSON.stringify(store));
  } catch { /* ignore */ }
}

export function isAccountLocked(email: string): boolean {
  try {
    const raw = localStorage.getItem(FAILED_LOGIN_KEY);
    if (!raw) return false;
    const store: Record<string, number> = JSON.parse(raw);
    return (store[email] ?? 0) >= LOCK_THRESHOLD;
  } catch { return false; }
}

export { LOCK_THRESHOLD };
