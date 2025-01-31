import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { ThemeProvider } from './hooks/useTheme';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeToggle } from './components/ui/ThemeToggle';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { PrivateRoute, AdminRoute } from './components/routing';
import Index from './pages/Index';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import AdminUsers from './pages/admin/Users';
import AdminOrders from './pages/admin/Orders';
import AdminMessages from './pages/admin/Messages';
import AdminReviews from './pages/admin/Reviews';
import AdminCoupons from './pages/admin/Coupons';
import AdminAnalytics from './pages/admin/Analytics';
import Checkout from './pages/Checkout';
import { queryClient } from './lib/react-query';

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {({ theme }) => (
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="flex flex-col min-h-screen">
                <div className="fixed top-4 right-4 z-50">
                  <ThemeToggle />
                </div>
                <Navbar />
                <main className="flex-grow pt-20">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route
                      path="/cart"
                      element={
                        <PrivateRoute>
                          <Cart />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <PrivateRoute>
                          <Profile />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin/*"
                      element={
                        <AdminRoute>
                          <Routes>
                            <Route path="/" element={<Admin />} />
                            <Route path="/analytics" element={<AdminAnalytics />} />
                            <Route path="/users" element={<AdminUsers />} />
                            <Route path="/orders" element={<AdminOrders />} />
                            <Route path="/messages" element={<AdminMessages />} />
                            <Route path="/reviews" element={<AdminReviews />} />
                            <Route path="/coupons" element={<AdminCoupons />} />
                          </Routes>
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/checkout"
                      element={
                        <PrivateRoute>
                          <Checkout />
                        </PrivateRoute>
                      }
                    />
                  </Routes>
                </main>
                <Footer />
              </div>
            </BrowserRouter>
          </TooltipProvider>
        )}
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
