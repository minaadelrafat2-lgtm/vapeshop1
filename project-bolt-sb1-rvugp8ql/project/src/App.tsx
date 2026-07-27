import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ToastProvider } from '@/context/ToastContext';
import { StorefrontLayout } from '@/components/storefront/StorefrontLayout';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Spinner } from '@/components/ui/Card';

// Storefront pages — lazy loaded for code splitting
const Home = lazy(() => import('@/pages/storefront/Home'));
const Shop = lazy(() => import('@/pages/storefront/Shop'));
const Categories = lazy(() => import('@/pages/storefront/Categories'));
const Brands = lazy(() => import('@/pages/storefront/Brands'));
const ProductDetails = lazy(() => import('@/pages/storefront/ProductDetails'));
const Search = lazy(() => import('@/pages/storefront/Search'));
const Wishlist = lazy(() => import('@/pages/storefront/Wishlist'));
const Cart = lazy(() => import('@/pages/storefront/Cart'));
const Checkout = lazy(() => import('@/pages/storefront/Checkout'));
const Account = lazy(() => import('@/pages/storefront/Account'));
const OrderTracking = lazy(() => import('@/pages/storefront/OrderTracking'));
const Blog = lazy(() => import('@/pages/storefront/Blog').then(m => ({ default: m.Blog })));
const BlogPost = lazy(() => import('@/pages/storefront/Blog').then(m => ({ default: m.BlogPost })));
const Contact = lazy(() => import('@/pages/storefront/Contact'));
const About = lazy(() => import('@/pages/storefront/About'));
const FAQ = lazy(() => import('@/pages/storefront/FAQ'));
const StoreLocator = lazy(() => import('@/pages/storefront/StoreLocator'));
const Careers = lazy(() => import('@/pages/storefront/Careers'));
const Auth = lazy(() => import('@/pages/storefront/Auth').then(m => ({ default: m.SignIn })));
const Legal = lazy(() => import('@/pages/storefront/Legal').then(m => ({ default: m.Privacy })));
const NotFound = lazy(() => import('@/pages/storefront/NotFound'));

// Admin pages — lazy loaded
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminOrders = lazy(() => import('@/pages/admin/AdminOrders'));
const AdminReturnsRefunds = lazy(() => import('@/pages/admin/AdminReturnsRefunds'));
const AdminProducts = lazy(() => import('@/pages/admin/AdminProducts'));
const AdminCategories = lazy(() => import('@/pages/admin/AdminCategories'));
const AdminCustomers = lazy(() => import('@/pages/admin/AdminCustomers'));
const AdminInventory = lazy(() => import('@/pages/admin/AdminInventory'));
const AdminBranches = lazy(() => import('@/pages/admin/AdminBranches'));
const AdminEmployees = lazy(() => import('@/pages/admin/AdminEmployees'));
const AdminSuppliers = lazy(() => import('@/pages/admin/AdminSuppliers'));
const AdminWarehouses = lazy(() => import('@/pages/admin/AdminWarehouses'));
const AdminPurchaseOrders = lazy(() => import('@/pages/admin/AdminPurchaseOrders'));
const AdminStockTransfers = lazy(() => import('@/pages/admin/AdminStockTransfers'));
const AdminInventoryTimeline = lazy(() => import('@/pages/admin/AdminInventoryTimeline'));
const AdminReports = lazy(() => import('@/pages/admin/AdminReports'));
const AdminAnalytics = lazy(() => import('@/pages/admin/AdminAnalytics'));
const AdminNotifications = lazy(() => import('@/pages/admin/AdminNotifications'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));
const AdminRoles = lazy(() => import('@/pages/admin/AdminRoles'));
const AdminPermissions = lazy(() => import('@/pages/admin/AdminPermissions'));
const AdminAuditLogs = lazy(() => import('@/pages/admin/AdminAuditLogs'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Spinner />
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <WishlistProvider>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Storefront */}
                  <Route element={<StorefrontLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/brands" element={<Brands />} />
                    <Route path="/brands/:slug" element={<Brands />} />
                    <Route path="/product/:slug" element={<ProductDetails />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/track-order" element={<OrderTracking />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<Blog />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/store-locator" element={<StoreLocator />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/privacy" element={<Legal />} />
                    <Route path="/terms" element={<Legal />} />
                    <Route path="/cookies" element={<Legal />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>

                  {/* Auth (no storefront layout) */}
                  <Route path="/signin" element={<Auth />} />
                  <Route path="/signup" element={<Auth />} />

                  {/* Admin (protected — staff only) */}
                  <Route path="/admin" element={<ProtectedRoute requireStaff><AdminLayout /></ProtectedRoute>}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="returns-refunds" element={<AdminReturnsRefunds />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="customers" element={<AdminCustomers />} />
                    <Route path="inventory" element={<AdminInventory />} />
                    <Route path="inventory-timeline" element={<AdminInventoryTimeline />} />
                    <Route path="stock-transfers" element={<AdminStockTransfers />} />
                    <Route path="branches" element={<AdminBranches />} />
                    <Route path="warehouses" element={<AdminWarehouses />} />
                    <Route path="employees" element={<AdminEmployees />} />
                    <Route path="suppliers" element={<AdminSuppliers />} />
                    <Route path="purchase-orders" element={<AdminPurchaseOrders />} />
                    <Route path="reports" element={<AdminReports />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="notifications" element={<AdminNotifications />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="roles" element={<AdminRoles />} />
                    <Route path="permissions" element={<AdminPermissions />} />
                    <Route path="audit-logs" element={<AdminAuditLogs />} />
                  </Route>
                </Routes>
              </Suspense>
            </WishlistProvider>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
