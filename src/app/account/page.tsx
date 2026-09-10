"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  LogOut,
  MapPin,
  Package,
  Plus,
  Star,
  Trash2,
  UserRound,
} from "lucide-react";
import { formatINR } from "@/lib/products";

type User = { id: string; name: string; email: string; phone: string | null; role: string };

type OrderItem = { id: string; slug: string; name: string; price: number; qty: number; image: string | null };
type Order = {
  id: string;
  orderNumber: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  couponCode: string | null;
  createdAt: string;
  items: OrderItem[];
};

type Address = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

const STATUS_STEPS = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];
const STATUS_COPY: Record<string, { label: string; cls: string }> = {
  PLACED: { label: "Placed", cls: "bg-[#fdf3d7] text-[#8a6a2f]" },
  CONFIRMED: { label: "Confirmed", cls: "bg-[#f3e6c8] text-[#a98139]" },
  SHIPPED: { label: "Shipped", cls: "bg-[#efe4cf] text-[#6b5320]" },
  DELIVERED: { label: "Delivered", cls: "bg-[#e8eedd] text-[#5c7a3f]" },
  CANCELLED: { label: "Cancelled", cls: "bg-[#fbeaea] text-[#b3352f]" },
};

type Tab = "orders" | "addresses" | "profile";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("orders");

  const loadAll = useCallback(async () => {
    try {
      const [meRes, ordersRes, addrRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/orders"),
        fetch("/api/account/addresses"),
      ]);
      if (meRes.status === 401) {
        router.push("/login?next=/account");
        return;
      }
      const me = await meRes.json();
      setUser(me.user);
      if (ordersRes.ok) setOrders((await ordersRes.json()).orders);
      if (addrRes.ok) setAddresses((await addrRes.json()).addresses);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--olive)]" />
      </div>
    );
  }

  const totalSpent = orders.filter((o) => o.status !== "CANCELLED").reduce((s, o) => s + o.total, 0);

  return (
    <div className="bg-[var(--cream-page)] px-4 pb-24 pt-28 sm:pt-36">
      <div className="mx-auto max-w-4xl">
        {/* header card */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[1.8rem] bg-[var(--forest)] p-6 text-[var(--cream)] shadow-[0_24px_54px_rgba(69,31,34,0.25)] sm:p-8">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-xl font-extrabold">
              {user?.name?.slice(0, 1).toUpperCase() ?? "A"}
            </span>
            <div>
              <h1 className="font-display text-2xl leading-tight sm:text-3xl">{user?.name}</h1>
              <p className="text-sm font-semibold text-white/70">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 px-4 py-2.5 text-center">
              <p className="text-lg font-extrabold leading-none">{orders.length}</p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">orders</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-2.5 text-center">
              <p className="text-lg font-extrabold leading-none">{formatINR(totalSpent)}</p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">spent</p>
            </div>
            <button
              type="button"
              onClick={logout}
              aria-label="Log out"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* tabs */}
        <div className="mt-6 flex gap-2">
          {(
            [
              { id: "orders", label: "My orders", Icon: Package },
              { id: "addresses", label: "Addresses", Icon: MapPin },
              { id: "profile", label: "Profile", Icon: UserRound },
            ] as { id: Tab; label: string; Icon: typeof Package }[]
          ).map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold transition sm:px-5 ${
                tab === id
                  ? "bg-[var(--forest)] text-[var(--cream)]"
                  : "bg-white text-[var(--forest)]/60 hover:bg-[var(--cloud)]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* ORDERS TAB */}
        {tab === "orders" && (
          <div className="mt-5 space-y-4">
            {orders.length === 0 ? (
              <div className="rounded-[1.6rem] bg-white p-10 text-center shadow-[0_18px_44px_rgba(69,31,34,0.08)]">
                <p className="font-script text-3xl text-[var(--forest)]">no orders yet…</p>
                <p className="mx-auto mt-2 max-w-sm text-sm font-medium text-[var(--forest-deep)]/75">
                  Your order history will appear here once you place your first order.
                </p>
                <a href="/shop" className="btn-pill mt-5 inline-block px-6 py-3 text-base">
                  Browse the jar wall
                </a>
              </div>
            ) : (
              orders.map((o) => {
                const stepIdx = STATUS_STEPS.indexOf(o.status);
                const cancelled = o.status === "CANCELLED";
                return (
                  <div key={o.id} className="rounded-[1.6rem] bg-white p-5 shadow-[0_18px_44px_rgba(69,31,34,0.08)] sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-extrabold text-[var(--forest)]">{o.orderNumber}</p>
                        <p className="text-xs font-semibold text-[var(--forest-deep)]/60">
                          {new Date(o.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                          {" · "}
                          {o.paymentMethod}
                          {o.couponCode ? ` · ${o.couponCode}` : ""}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wide ${
                          (STATUS_COPY[o.status] ?? STATUS_COPY.PLACED).cls
                        }`}
                      >
                        {(STATUS_COPY[o.status] ?? STATUS_COPY.PLACED).label}
                      </span>
                    </div>

                    {/* timeline */}
                    {!cancelled && (
                      <div className="mt-4 flex items-center">
                        {STATUS_STEPS.map((s, i) => (
                          <div key={s} className="flex flex-1 items-center last:flex-none">
                            <span
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold ${
                                i <= stepIdx
                                  ? "bg-[var(--forest)] text-[var(--cream)]"
                                  : "bg-[var(--cloud)] text-[var(--forest)]/40"
                              }`}
                            >
                              {i + 1}
                            </span>
                            <span
                              className={`mx-1.5 hidden text-[10px] font-bold uppercase tracking-wide text-[var(--forest)]/60 sm:block`}
                            >
                              {STATUS_COPY[s].label}
                            </span>
                            {i < STATUS_STEPS.length - 1 && (
                              <span
                                className={`h-0.5 flex-1 rounded-full ${
                                  i < stepIdx ? "bg-[var(--forest)]" : "bg-[var(--cloud)]"
                                }`}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* items */}
                    <ul className="mt-4 space-y-2.5 border-t border-[var(--forest)]/8 pt-4">
                      {o.items.map((it) => (
                        <li key={it.id} className="flex items-center gap-3">
                          {it.image && (
                            <img src={it.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-[var(--forest)]">{it.name}</p>
                            <p className="text-xs font-semibold text-[var(--forest-deep)]/60">
                              {formatINR(it.price)} × {it.qty}
                            </p>
                          </div>
                          <span className="text-sm font-extrabold text-[var(--forest)]">
                            {formatINR(it.price * it.qty)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 flex items-center justify-between border-t border-[var(--forest)]/8 pt-3">
                      <span className="text-xs font-semibold text-[var(--forest-deep)]/65">
                        {o.discount > 0 && <>You saved {formatINR(o.discount)} · </>}
                        {o.shipping === 0 ? "Free shipping" : `Shipping ${formatINR(o.shipping)}`}
                      </span>
                      <span className="text-lg font-extrabold text-[var(--forest)]">{formatINR(o.total)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ADDRESSES TAB */}
        {tab === "addresses" && (
          <AddressesTab addresses={addresses} reload={loadAll} />
        )}

        {/* PROFILE TAB */}
        {tab === "profile" && <ProfileTab user={user} reload={loadAll} />}
      </div>
    </div>
  );
}

/* ---------- Addresses ---------- */
function AddressesTab({ addresses, reload }: { addresses: Address[]; reload: () => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    label: "Home",
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not save address.");
        return;
      }
      setOpen(false);
      setForm({ label: "Home", fullName: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" });
      await reload();
    } finally {
      setSaving(false);
    }
  };

  const makeDefault = async (a: Address) => {
    await fetch(`/api/account/addresses/${a.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDefault: true }),
    });
    await reload();
  };

  const remove = async (a: Address) => {
    if (!window.confirm(`Delete this ${a.label.toLowerCase()} address?`)) return;
    await fetch(`/api/account/addresses/${a.id}`, { method: "DELETE" });
    await reload();
  };

  const field =
    "w-full rounded-xl border-2 border-[var(--forest)]/15 bg-white px-3.5 py-2.5 text-base font-medium text-[var(--forest)] outline-none transition focus:border-[var(--sage-deep)] sm:text-sm";
  const label = "mb-1 block text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--olive)]";

  return (
    <div className="mt-5 space-y-4">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-[1.6rem] border-2 border-dashed border-[var(--forest)]/25 bg-white/60 px-6 py-5 text-sm font-bold text-[var(--forest)] transition hover:border-[var(--forest)]/50 hover:bg-white"
      >
        <Plus className="h-4 w-4" /> Add a new address
      </button>

      {addresses.map((a) => (
        <div key={a.id} className="rounded-[1.6rem] bg-white p-5 shadow-[0_18px_44px_rgba(69,31,34,0.08)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-sm font-extrabold text-[var(--forest)]">
                <MapPin className="h-4 w-4 text-[var(--sage-deep)]" />
                {a.label}
                {a.isDefault && (
                  <span className="flex items-center gap-1 rounded-full bg-[var(--sage-soft)] px-2 py-0.5 text-[10px] font-extrabold uppercase text-[var(--forest)]">
                    <Star className="h-2.5 w-2.5 fill-current" /> Default
                  </span>
                )}
              </p>
              <p className="mt-1.5 text-sm font-semibold leading-relaxed text-[var(--forest-deep)]/85">
                {a.fullName} · {a.phone}
                <br />
                {a.line1}
                {a.line2 ? `, ${a.line2}` : ""}
                <br />
                {a.city}, {a.state} — {a.pincode}
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              {!a.isDefault && (
                <button
                  type="button"
                  onClick={() => makeDefault(a)}
                  className="rounded-full bg-[var(--cloud)] px-3 py-1.5 text-[11px] font-extrabold uppercase text-[var(--forest)] transition hover:bg-[var(--sage-soft)]"
                >
                  Set default
                </button>
              )}
              <button
                type="button"
                onClick={() => remove(a)}
                aria-label="Delete address"
                className="flex h-8 w-8 items-center justify-center self-end rounded-full text-[var(--forest)]/50 transition hover:bg-[#fbeaea] hover:text-[#b3352f]"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {open && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 backdrop-blur-sm sm:items-center sm:p-6">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] bg-[var(--cream)] p-6 shadow-2xl sm:rounded-[2rem] sm:p-8">
            <h2 className="text-xl font-extrabold text-[var(--forest)]">New address</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label>
                <span className={label}>Label</span>
                <input className={field} value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} placeholder="Home / Office" />
              </label>
              <label>
                <span className={label}>Full name</span>
                <input className={field} value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} />
              </label>
              <label>
                <span className={label}>Phone</span>
                <input className={field} value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} inputMode="tel" />
              </label>
              <label>
                <span className={label}>PIN code</span>
                <input className={field} value={form.pincode} onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value }))} inputMode="numeric" maxLength={6} />
              </label>
              <label className="sm:col-span-2">
                <span className={label}>Address line 1</span>
                <input className={field} value={form.line1} onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))} placeholder="Flat / house no, street" />
              </label>
              <label className="sm:col-span-2">
                <span className={label}>Address line 2 (optional)</span>
                <input className={field} value={form.line2} onChange={(e) => setForm((f) => ({ ...f, line2: e.target.value }))} placeholder="Area, landmark" />
              </label>
              <label>
                <span className={label}>City</span>
                <input className={field} value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
              </label>
              <label>
                <span className={label}>State</span>
                <input className={field} value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} />
              </label>
            </div>

            {error && (
              <p role="alert" className="mt-4 rounded-xl bg-[#fbeaea] px-4 py-3 text-sm font-semibold text-[#b3352f]">
                {error}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border-2 border-[var(--forest)]/20 px-6 py-3 text-sm font-bold text-[var(--forest)] transition hover:bg-[var(--cloud)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="flex items-center gap-2 rounded-full bg-[var(--forest)] px-7 py-3 text-sm font-bold text-[var(--cream)] transition hover:bg-[var(--forest-deep)] disabled:opacity-60"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Profile ---------- */
function ProfileTab({ user, reload }: { user: User | null; reload: () => Promise<void> }) {
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async (withPassword: boolean) => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          withPassword
            ? { currentPassword, newPassword }
            : { name, phone },
        ),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ ok: false, text: data.error ?? "Could not update." });
        return;
      }
      if (withPassword) {
        setCurrentPassword("");
        setNewPassword("");
      }
      setMsg({ ok: true, text: withPassword ? "Password updated!" : "Profile updated!" });
      await reload();
    } finally {
      setSaving(false);
    }
  };

  const field =
    "w-full rounded-xl border-2 border-[var(--forest)]/15 bg-white px-3.5 py-2.5 text-base font-medium text-[var(--forest)] outline-none transition focus:border-[var(--sage-deep)] sm:text-sm";
  const label = "mb-1 block text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--olive)]";

  return (
    <div className="mt-5 space-y-4">
      <div className="rounded-[1.6rem] bg-white p-6 shadow-[0_18px_44px_rgba(69,31,34,0.08)] sm:p-8">
        <h2 className="text-lg font-extrabold text-[var(--forest)]">Personal details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label>
            <span className={label}>Full name</span>
            <input className={field} value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            <span className={label}>Mobile</span>
            <input className={field} value={phone ?? ""} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />
          </label>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => save(false)}
            disabled={saving}
            className="rounded-full bg-[var(--forest)] px-6 py-3 text-sm font-bold text-[var(--cream)] transition hover:bg-[var(--forest-deep)] disabled:opacity-60"
          >
            Save profile
          </button>
          <span className="text-xs font-semibold text-[var(--forest-deep)]/60">
            Email: {user?.email} (cannot be changed)
          </span>
        </div>
      </div>

      <div className="rounded-[1.6rem] bg-white p-6 shadow-[0_18px_44px_rgba(69,31,34,0.08)] sm:p-8">
        <h2 className="text-lg font-extrabold text-[var(--forest)]">Change password</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label>
            <span className={label}>Current password</span>
            <input type="password" className={field} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} autoComplete="current-password" />
          </label>
          <label>
            <span className={label}>New password</span>
            <input type="password" className={field} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" placeholder="At least 6 characters" />
          </label>
        </div>
        <button
          type="button"
          onClick={() => save(true)}
          disabled={saving || !currentPassword || !newPassword}
          className="mt-4 rounded-full border-2 border-[var(--forest)]/25 px-6 py-3 text-sm font-bold text-[var(--forest)] transition hover:bg-[var(--cloud)] disabled:opacity-50"
        >
          Update password
        </button>
      </div>

      {msg && (
        <p
          role="status"
          className={`rounded-2xl px-5 py-4 text-sm font-bold ${
            msg.ok ? "bg-[#e8eedd] text-[#5c7a3f]" : "bg-[#fbeaea] text-[#b3352f]"
          }`}
        >
          {msg.text}
        </p>
      )}
    </div>
  );
}
