import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ToastProvider } from '@/context/ToastContext';
import { StorefrontLayout } from '@/components/storefront/StorefrontLayout';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Storefront pages
import Home from '@/pages/storefront/Home';
import Shop from '@/pages/storefront/Shop';
import Categories from '@/pages/storefront/Categories';
import Brands from '@/pages/storefront/Brands';
import ProductDetails from '@/pages/storefront/ProductDetails';
import Search from '@/pages/storefront/Search';
import Wishlist from '@/pages/storefront/Wishlist';
import Cart from '@/pages/storefront/Cart';
import Checkout from '@/pages/storefront/Checkout';
import Account from '@/pages/storefront/Account';
import OrderTracking from '@/pages/storefront/OrderTracking';
import { Blog, BlogPost } from '@/pages/storefront/Blog';
import Contact from '@/pages/storefront/Contact';
import About from '@/pages/storefront/About';
import FAQ from '@/pages/storefront/FAQ';
import StoreLocator from '@/pages/storefront/StoreLocator';
import Careers from '@/pages/storefront/Careers';
import { SignIn, SignUp } from '@/pages/storefront/Auth';
import { Privacy, Terms, Cookies } from '@/pages/storefront/Legal';
import NotFound from '@/pages/storefront/NotFound';

// Admin pages
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminCategories from '@/pages/admin/AdminCategories';
import AdminCustomers from '@/pages/admin/AdminCustomers';
import AdminInventory from '@/pages/admin/AdminInventory';
import AdminBranches from '@/pages/admin/AdminBranches';
import AdminEmployees from '@/pages/admin/AdminEmployees';
import AdminSuppliers from '@/pages/admin/AdminSuppliers';
import AdminWarehouses from '@/pages/admin/AdminWarehouses';
import AdminPurchaseOrders from '@/pages/admin/AdminPurchaseOrders';
import AdminStockTransfers from '@/pages/admin/AdminStockTransfers';
import AdminInventoryTimeline from '@/pages/admin/AdminInventoryTimeline';
import AdminReports from '@/pages/admin/AdminReports';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';
import AdminNotifications from '@/pages/admin/AdminNotifications';
import AdminSettings from '@/pages/admin/AdminSettings';
import AdminRoles from '@/pages/admin/AdminRoles';
import AdminPermissions from '@/pages/admin/AdminPermissions';
import AdminAuditLogs from '@/pages/admin/AdminAuditLogs';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <WishlistProvider>
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
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/store-locator" element={<StoreLocator />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/cookies" element={<Cookies />} />
                  <Route path="*" element={<NotFound />} />
                </Route>

                {/* Auth (no storefront layout) */}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />

                {/* Admin (protected — staff only) */}
                <Route path="/admin" element={<ProtectedRoute requireStaff><AdminLayout /></ProtectedRoute>}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="orders" element={<AdminOrders />} />
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
            </WishlistProvider>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
