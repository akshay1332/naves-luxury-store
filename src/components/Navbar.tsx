import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { CartIndicator } from './cart/CartIndicator';
import { NotificationBell } from './notifications/NotificationBell';

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-3xl font-bold tracking-wider">
                <span className="text-black">UNIS</span>
                <span className="text-white">EX HAUL</span>
              </h1>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-black hover:text-white uppercase text-sm font-medium tracking-wider"
            >
              HOME
            </Link>
            <Link
              to="/sale"
              className="text-black hover:text-white uppercase text-sm font-medium tracking-wider"
            >
              SALE
            </Link>
            <Link
              to="/category"
              className="text-black hover:text-white uppercase text-sm font-medium tracking-wider"
            >
              CATEGORY
            </Link>
            <Link
              to="/about"
              className="text-black hover:text-white uppercase text-sm font-medium tracking-wider"
            >
              ABOUT US
            </Link>
            <Link
              to="/contact"
              className="text-black hover:text-white uppercase text-sm font-medium tracking-wider"
            >
              CONTACT US
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <CartIndicator />
                <NotificationBell />
                <Link to="/profile">
                  <Button variant="ghost" className="text-black hover:text-white">Profile</Button>
                </Link>
                {user.user_metadata?.is_admin && (
                  <Link to="/admin">
                    <Button variant="ghost" className="text-black hover:text-white">Admin</Button>
                  </Link>
                )}
                <Button variant="ghost" onClick={signOut} className="text-black hover:text-white">
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button className="text-black hover:text-white">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 text-6xl font-bold text-white p-4">
        2024
      </div>
    </nav>
  );
}