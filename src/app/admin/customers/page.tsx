"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, RefreshCw, Search, UserCheck, Users } from "lucide-react";
import { formatINR } from "@/lib/products";
import { AdminLayout } from "@/components/admin/AdminLayout";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  ordersCount: number;
  totalSpent: number;
  createdAt: string;
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/customers");
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout
      title="Customers &amp; Members"
      subtitle="View registered parent accounts, purchase history, and contact info"
      actions={
        <button
          onClick={loadCustomers}
          title="Refresh"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      }
    >
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        {/* Search */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-xs font-medium text-gray-900 outline-none focus:bg-white focus:border-amber-400"
            />
          </div>
          <div className="text-xs font-semibold text-gray-500">
            Total Customers: <span className="font-bold text-gray-900">{customers.length}</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs font-semibold text-gray-500">
              No registered customers yet. When customers create accounts, they will appear here.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3 pr-4">Customer Name</th>
                  <th className="py-3 pr-4">Contact</th>
                  <th className="py-3 pr-4">City</th>
                  <th className="py-3 pr-4">Orders</th>
                  <th className="py-3 pr-4">Total Spent</th>
                  <th className="py-3 text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/70">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--sage-soft)] font-bold text-[var(--forest)]">
                          {c.name[0]?.toUpperCase() || "U"}
                        </div>
                        <span className="font-bold text-gray-900">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className="block font-medium text-gray-700">{c.email}</span>
                      <span className="block text-[11px] text-gray-500">{c.phone}</span>
                    </td>
                    <td className="py-3.5 pr-4 font-medium text-gray-700">{c.city}</td>
                    <td className="py-3.5 pr-4">
                      <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-800">
                        {c.ordersCount} orders
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 font-bold text-gray-900">
                      {formatINR(c.totalSpent)}
                    </td>
                    <td className="py-3.5 text-right text-gray-500">
                      {new Date(c.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
