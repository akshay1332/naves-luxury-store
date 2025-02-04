import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { CouponList } from "./CouponList";
import ProductForm from "./ProductForm";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm border-r border-gray-200">
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveSection("dashboard")}
                className={`w-full text-left px-4 py-2 rounded ${
                  activeSection === "dashboard"
                    ? "bg-gray-100 text-gray-900"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection("products")}
                className={`w-full text-left px-4 py-2 rounded ${
                  activeSection === "products"
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                Products
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection("coupons")}
                className={`w-full text-left px-4 py-2 rounded ${
                  activeSection === "coupons"
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                Coupons
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 bg-white shadow-sm">
                  <h3 className="font-semibold text-lg mb-2">Total Products</h3>
                  <p className="text-3xl font-bold">245</p>
                  <p className="text-sm text-muted-foreground">+12% from last month</p>
                </Card>
                <Card className="p-6 bg-white shadow-sm">
                  <h3 className="font-semibold text-lg mb-2">Total Orders</h3>
                  <p className="text-3xl font-bold">1,234</p>
                  <p className="text-sm text-muted-foreground">+5% from last month</p>
                </Card>
                <Card className="p-6 bg-white shadow-sm">
                  <h3 className="font-semibold text-lg mb-2">Total Revenue</h3>
                  <p className="text-3xl font-bold">₹89,456</p>
                  <p className="text-sm text-muted-foreground">+18% from last month</p>
                </Card>
                <Card className="p-6 bg-white shadow-sm">
                  <h3 className="font-semibold text-lg mb-2">Active Customers</h3>
                  <p className="text-3xl font-bold">892</p>
                  <p className="text-sm text-muted-foreground">+8% from last month</p>
                </Card>
              </div>
            </div>
          )}
          {activeSection === "products" && (
            <ProductForm onSuccess={() => setActiveSection("dashboard")} />
          )}
          {activeSection === "coupons" && (
            <CouponList />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 
