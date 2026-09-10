"use client";

import { useEffect, useState } from "react";
import { Loader2, Mail, Phone } from "lucide-react";
import { formatINR } from "@/lib/products";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string | null;
};

type Guest = { name: string; email: string; orders: number; totalSpent: number };

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("failed"))))
      .then((d) => {
        setCustomers(d.customers);
        setGuests(d.guests);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--forest)] sm:text-3xl">Customers</h1>
        <p className="mt-1 text-sm font-medium text-[var(--forest-deep)]/70">
          {customers.length} registered accounts · {guests.length} guest buyers
        </p>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-white p-10 shadow">
          <Loader2 className="mx-auto h-5 w-5 animate-spin text-[var(--olive)]" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-3xl bg-white shadow-[0_10px_30px_rgba(69,31,34,0.07)]">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-[var(--forest)]/8 text-left text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--olive)]">
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-3 py-4">Contact</th>
                  <th className="px-3 py-4">Orders</th>
                  <th className="px-3 py-4">Spent</th>
                  <th className="px-5 py-4">Last order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--forest)]/6">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center font-semibold text-[var(--forest-deep)]/60">
                      No registered customers yet.
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c.id} className="hover:bg-[var(--cream-page)]/60">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--sage-soft)] text-sm font-extrabold text-[var(--forest)]">
                            {c.name.slice(0, 1).toUpperCase()}
                          </span>
                          <div>
                            <p className="font-extrabold text-[var(--forest)]">{c.name}</p>
                            <p className="text-xs font-semibold text-[var(--forest-deep)]/55">
                              joined {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <p className="flex items-center gap-1.5 text-xs font-semibold text-[var(--forest-deep)]/75">
                          <Mail className="h-3 w-3" /> {c.email}
                        </p>
                        {c.phone && (
                          <p className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-[var(--forest-deep)]/75">
                            <Phone className="h-3 w-3" /> {c.phone}
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <span className="rounded-full bg-[var(--sage-soft)] px-2.5 py-1 text-xs font-extrabold text-[var(--forest)]">
                          {c.orderCount}
                        </span>
                      </td>
                      <td className="px-3 py-3 font-bold text-[var(--forest)]">{formatINR(c.totalSpent)}</td>
                      <td className="px-5 py-3 text-xs font-semibold text-[var(--forest-deep)]/70">
                        {c.lastOrderAt
                          ? new Date(c.lastOrderAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
                          : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {guests.length > 0 && (
            <div className="overflow-x-auto rounded-3xl bg-white shadow-[0_10px_30px_rgba(69,31,34,0.07)]">
              <div className="border-b border-[var(--forest)]/8 px-5 py-3.5">
                <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-[var(--olive)]">
                  Guest checkouts (no account)
                </h2>
              </div>
              <table className="w-full min-w-[560px] text-sm">
                <tbody className="divide-y divide-[var(--forest)]/6">
                  {guests.map((g) => (
                    <tr key={g.email}>
                      <td className="px-5 py-3 font-bold text-[var(--forest)]">{g.name}</td>
                      <td className="px-3 py-3 text-xs font-semibold text-[var(--forest-deep)]/70">{g.email}</td>
                      <td className="px-3 py-3 text-xs font-bold text-[var(--forest-deep)]/80">{g.orders} orders</td>
                      <td className="px-5 py-3 text-right font-bold text-[var(--forest)]">{formatINR(g.totalSpent)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
