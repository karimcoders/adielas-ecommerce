"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Box,
  Calendar,
  CheckCircle2,
  Clock,
  LogOut,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";
import { formatINR } from "@/lib/products";

type OrderItem = {
  id: string;
  productSlug: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
};

type Order = {
  id: string;
  createdAt: string;
  total: number;
  subtotal: number;
  shippingFee: number;
  status: string;
  paymentMethod: string;
  address: string;
  city: string;
  pincode: string;
  items: OrderItem[];
};

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"orders" | "profile">("orders");

  useEffect(() => {
    async function loadData() {
      try {
        const meRes = await fetch("/api/auth/me");
        const meData = await meRes.json();
        if (!meData.user) {
          router.push("/login");
          return;
        }
        setUser(meData.user);

        const ordersRes = await fetch("/api/orders");
        if (ordersRes.ok) {
          const oData = await ordersRes.json();
          setOrders(oData.orders || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[var(--cream-page)]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--forest)] border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[var(--cream-page)] pb-24 pt-28 sm:pt-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        {/* Profile Header */}
        <div className="flex flex-col justify-between gap-6 rounded-[2.2rem] bg-white p-6 shadow-[0_20px_50px_rgba(69,31,34,0.08)] sm:flex-row sm:items-center sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--sage-soft)] text-2xl font-bold text-[var(--forest)]">
              {user.name[0]?.toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl text-[var(--forest)] sm:text-3xl">
                  {user.name}
                </h1>
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="rounded-full bg-red-800 px-3 py-0.5 text-[10px] font-extrabold tracking-wider text-white hover:bg-red-900"
                  >
                    ADMIN PORTAL
                  </Link>
                )}
              </div>
              <p className="text-xs font-semibold text-[var(--forest-deep)]/70 sm:text-sm">
                {user.email} {user.phone ? `· +91 ${user.phone}` : ""}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="btn-pill bg-[var(--forest-deep)] px-5 py-2.5 text-xs text-[var(--cream)]"
              >
                Go to Admin Dashboard
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border-2 border-[var(--forest)]/20 px-5 py-2.5 text-xs font-bold text-[var(--forest)] transition hover:bg-[var(--forest)] hover:text-[var(--cream)]"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 flex gap-3 border-b border-[var(--forest)]/12 pb-4">
          <button
            onClick={() => setTab("orders")}
            className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-extrabold transition ${
              tab === "orders"
                ? "bg-[var(--forest)] text-[var(--cream)]"
                : "bg-white/70 text-[var(--forest)] hover:bg-white"
            }`}
          >
            <Package className="h-4 w-4" />
            My Orders ({orders.length})
          </button>
          <button
            onClick={() => setTab("profile")}
            className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-extrabold transition ${
              tab === "profile"
                ? "bg-[var(--forest)] text-[var(--cream)]"
                : "bg-white/70 text-[var(--forest)] hover:bg-white"
            }`}
          >
            <User className="h-4 w-4" />
            Saved Details
          </button>
        </div>

        {/* Orders Tab */}
        {tab === "orders" && (
          <div className="mt-8 space-y-6">
            {orders.length === 0 ? (
              <div className="rounded-[2rem] bg-white p-12 text-center shadow-sm">
                <Box className="mx-auto h-12 w-12 text-[var(--forest)]/30" />
                <h3 className="font-display mt-4 text-2xl text-[var(--forest)]">
                  NO ORDERS YET
                </h3>
                <p className="mt-2 text-sm text-[var(--forest-deep)]/75">
                  You haven't placed any orders with Adielas yet.
                </p>
                <Link
                  href="/shop"
                  className="btn-pill mx-auto mt-6 inline-flex px-7 py-3 text-sm font-bold"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Explore The Jar Wall
                </Link>
              </div>
            ) : (
              orders.map((order) => {
                const isDelivered = order.status === "DELIVERED";
                const isShipped = order.status === "SHIPPED";
                return (
                  <div
                    key={order.id}
                    className="overflow-hidden rounded-[2rem] bg-white shadow-[0_12px_35px_rgba(69,31,34,0.06)]"
                  >
                    {/* Order Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--forest)]/10 bg-[var(--cloud)]/60 px-6 py-4 text-xs font-bold text-[var(--forest)]">
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="font-mono text-sm font-extrabold text-[var(--forest-deep)]">
                          Order #{order.id}
                        </span>
                        <span className="flex items-center gap-1.5 text-[var(--forest-deep)]/75">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold tracking-wide uppercase ${
                            isDelivered
                              ? "bg-emerald-100 text-emerald-800"
                              : isShipped
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-900"
                          }`}
                        >
                          {isDelivered ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : isShipped ? (
                            <Truck className="h-3.5 w-3.5" />
                          ) : (
                            <Clock className="h-3.5 w-3.5" />
                          )}
                          {order.status}
                        </span>
                        <span className="font-display text-lg text-[var(--forest)]">
                          {formatINR(order.total)}
                        </span>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="p-6">
                      <div className="divide-y divide-[var(--forest)]/10">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between py-3 text-sm"
                          >
                            <div className="flex items-center gap-4">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.productName}
                                  className="h-12 w-12 rounded-xl object-contain bg-[var(--cream-page)] p-1"
                                />
                              )}
                              <div>
                                <h4 className="font-bold text-[var(--forest)]">
                                  {item.productName}
                                </h4>
                                <span className="text-xs text-[var(--forest-deep)]/70">
                                  Qty: {item.quantity} · {formatINR(item.price)} each
                                </span>
                              </div>
                            </div>
                            <span className="font-bold text-[var(--forest)]">
                              {formatINR(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Delivery Address & Status */}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--forest)]/10 pt-4 text-xs font-medium text-[var(--forest-deep)]/80">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-[var(--olive)]" />
                          <span>
                            Delivery to: {order.address}, {order.city} - {order.pincode}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[var(--forest)]">
                          <ShieldCheck className="h-4 w-4 text-emerald-600" />
                          <span>Payment via {order.paymentMethod}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Profile Tab */}
        {tab === "profile" && (
          <div className="mt-8 rounded-[2rem] bg-white p-6 shadow-[0_12px_35px_rgba(69,31,34,0.06)] sm:p-8">
            <h2 className="text-xl font-bold text-[var(--forest)]">
              Personal Information &amp; Address
            </h2>
            <p className="mt-1 text-xs text-[var(--forest-deep)]/75">
              These details are automatically filled when you order at checkout.
            </p>

            <dl className="mt-6 grid gap-4 divide-y divide-[var(--forest)]/10 text-sm sm:grid-cols-2 sm:divide-y-0">
              <div className="rounded-2xl bg-[var(--cloud)]/40 p-4">
                <dt className="text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                  Full Name
                </dt>
                <dd className="mt-1 font-semibold text-[var(--forest)]">{user.name}</dd>
              </div>

              <div className="rounded-2xl bg-[var(--cloud)]/40 p-4">
                <dt className="text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                  Email Address
                </dt>
                <dd className="mt-1 font-semibold text-[var(--forest)]">{user.email}</dd>
              </div>

              <div className="rounded-2xl bg-[var(--cloud)]/40 p-4">
                <dt className="text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                  Phone Number
                </dt>
                <dd className="mt-1 font-semibold text-[var(--forest)]">
                  {user.phone ? `+91 ${user.phone}` : "Not provided"}
                </dd>
              </div>

              <div className="rounded-2xl bg-[var(--cloud)]/40 p-4">
                <dt className="text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                  Delivery Address
                </dt>
                <dd className="mt-1 font-semibold text-[var(--forest)]">
                  {user.address
                    ? `${user.address}, ${user.city} - ${user.pincode}`
                    : "No saved address"}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
