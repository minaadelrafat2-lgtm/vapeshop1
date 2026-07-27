import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { getSessionId } from '@/lib/utils';
import type { CartLine, CartItem, Product, ProductVariant } from '@/types';
import { useAuth } from './AuthContext';

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  loading: boolean;
  add: (product: Product, variant?: ProductVariant | null, qty?: number) => Promise<void>;
  updateQty: (cartId: string, qty: number) => Promise<void>;
  remove: (cartId: string) => Promise<void>;
  clear: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [variants, setVariants] = useState<Record<string, ProductVariant>>({});
  const [loading, setLoading] = useState(true);

  const session = useMemo(() => (user ? null : getSessionId()), [user]);

  const fetchCart = async (uid: string | null, sid: string | null) => {
    setLoading(true);
    let q = supabase.from('cart_items').select('*');
    if (uid) q = q.eq('user_id', uid);
    else if (sid) q = q.eq('session_id', sid).is('user_id', null);
    else {
      setItems([]); setProducts({}); setVariants({}); setLoading(false); return;
    }
    const { data } = await q.order('created_at', { ascending: false });
    const cart = (data ?? []) as CartItem[];
    setItems(cart);
    if (cart.length) {
      const pIds = [...new Set(cart.map((c) => c.product_id))];
      const vIds = cart.map((c) => c.variant_id).filter(Boolean) as string[];
      const [{ data: pRows }, { data: vRows }] = await Promise.all([
        supabase.from('products').select('*').in('id', pIds),
        vIds.length ? supabase.from('product_variants').select('*').in('id', vIds) : Promise.resolve({ data: [] }),
      ]);
      setProducts(Object.fromEntries((pRows ?? []).map((p) => [p.id, p])));
      setVariants(Object.fromEntries((vRows ?? []).map((v) => [v.id, v])));
    } else {
      setProducts({}); setVariants({});
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCart(user?.id ?? null, session);
  }, [user?.id, session]);

  const add = async (product: Product, variant?: ProductVariant | null, qty = 1) => {
    const payload: Partial<CartItem> = {
      product_id: product.id,
      variant_id: variant?.id ?? null,
      quantity: qty,
    };
    if (user) payload.user_id = user.id;
    else payload.session_id = getSessionId();
    const { error } = await supabase.from('cart_items').insert(payload);
    if (error) {
      // try update existing line qty
      let q = supabase.from('cart_items').select('id,quantity').eq('product_id', product.id);
      if (variant) q = q.eq('variant_id', variant.id); else q = q.is('variant_id', null);
      if (user) q = q.eq('user_id', user.id); else q = q.eq('session_id', getSessionId()).is('user_id', null);
      const { data } = await q.maybeSingle();
      if (data) await supabase.from('cart_items').update({ quantity: data.quantity + qty }).eq('id', data.id);
    }
    fetchCart(user?.id ?? null, session);
  };

  const updateQty = async (cartId: string, qty: number) => {
    if (qty <= 0) return remove(cartId);
    await supabase.from('cart_items').update({ quantity: qty }).eq('id', cartId);
    setItems((prev) => prev.map((i) => (i.id === cartId ? { ...i, quantity: qty } : i)));
  };

  const remove = async (cartId: string) => {
    await supabase.from('cart_items').delete().eq('id', cartId);
    setItems((prev) => prev.filter((i) => i.id !== cartId));
  };

  const clear = async () => {
    if (user) await supabase.from('cart_items').delete().eq('user_id', user.id);
    else if (session) await supabase.from('cart_items').delete().eq('session_id', session).is('user_id', null);
    setItems([]);
  };

  const lines: CartLine[] = items
    .map((cart) => {
      const product = products[cart.product_id];
      if (!product) return null;
      return { cart, product, variant: cart.variant_id ? variants[cart.variant_id] : null };
    })
    .filter(Boolean) as CartLine[];

  const subtotal = lines.reduce((sum, l) => sum + (l.variant?.price ?? l.product.price) * l.cart.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ lines, count, subtotal, loading, add, updateQty, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
