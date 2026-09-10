"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Banknote,
  Check,
  CreditCard,
  Loader2,
  Smartphone,
  ShoppingBag,
  Tag,
  X,
} from "lucide-react";
import { Reveal } from "@/components/more/Reveal";
import { useCart } from "@/components/more/CartProvider";
import { useCatalog } from "@/components/more/CatalogProvider";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, formatINR } from "@/lib/products";

type Fields = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
};

type PayMethod = "upi" | "card" | "cod";

type PlacedOrder = {
  orderNumber: string;
  total: number;
  discount: number;
};

const payOptions: { id: PayMethod; label: string; hint: string; Icon: typeof Smartphone }[] = [
  { id: "upi", label: "UPI", hint: "GPay, PhonePe, Paytm", Icon: Smartphone },
  { id: "card", label: "Card", hint: "Visa, RuPay, Mastercard", Icon: CreditCard },
  { id: "cod", label: "COD", hint: "Cash on delivery", Icon: Banknote },
];

const initialFields: Fields = {
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  pincode: "",
};

function Input({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-[var(--olive)]">
        {label}
      </span>
      <input
        {...props}
        className={`w-full rounded-2xl border-2 bg-white px-4 py-3 text-base font-medium text-[var(--forest)] outline-none transition placeholder:text-[var(--forest)]/35 ${
          error
            ? "border-[#b3352f]"
            : "border-[var(--forest)]/15 focus:border-[var(--sage-deep)]"
        }`}
      />
      {error && (
        <span className="mt-1 block text-xs font-semibold text-[#b3352f]">
          {error}
        </span>
      )}
    </label>
  );
}

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const { getProduct } = useCatalog();
  const [fields, setFields] = useState<Fields>(initialFields);
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [method, setMethod] = useState<PayMethod>("upi");
  const [order, setOrder] = useState<PlacedOrder | null>(null);

  // coupon state
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponMsg, setCouponMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  // submit state
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState<string | null>(null);

  const lines = useMemo(
    () =>
      items
        .map((it) => ({ item: it, product: getProduct(it.slug) }))
        .filter((x) => x.product),
    [items, getProduct],
  );

  const subtotal = lines.reduce((s, l) => s + l.product!.price * l.item.qty, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const discount = coupon?.discount ?? 0;
  const total = Math.max(0, subtotal - discount + shipping);

  // prefill from logged-in profile when available
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.user) {
          setFields((f) => ({
            ...f,
            name: f.name || d.user.name || "",
            email: f.email || d.user.email || "",
            phone: f.phone || d.user.phone || "",
          }));
        }
      })
      .catch(() => {});
  }, []);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const applyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setCheckingCoupon(true);
    setCouponMsg(null);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCoupon(null);
        setCouponMsg({ ok: false, text: data.error ?? "Invalid code" });
      } else {
        setCoupon({ code: data.code, discount: data.discount });
        setCouponMsg({ ok: true, text: `${data.code} applied — you saved ${formatINR(data.discount)}!` });
      }
    } catch {
      setCouponMsg({ ok: false, text: "Could not check the code. Try again." });
    } finally {
      setCheckingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponInput("");
    setCouponMsg(null);
  };

  const placeOrder = async () => {
    const er: Partial<Fields> = {};
    if (fields.name.trim().length < 2) er.name = "Please enter your name";
    if (!/^[6-9]\d{9}$/.test(fields.phone.replace(/\s/g, "")))
      er.phone = "Enter a valid 10-digit mobile number";
    if (!/^\S+@\S+\.\S+$/.test(fields.email)) er.email = "Enter a valid email";
    if (fields.address.trim().length < 8)
      er.address = "Enter your full delivery address";
    if (fields.city.trim().length < 2) er.city = "Enter your city";
    if (!/^\d{6}$/.test(fields.pincode.trim()))
      er.pincode = "6-digit PIN code";
    setErrors(er);
    if (Object.keys(er).length > 0) return;

    setPlacing(true);
    setPlaceError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((it) => ({ slug: it.slug, qty: it.qty })),
          customerName: fields.name.trim(),
          email: fields.email.trim(),
          phone: fields.phone.replace(/\s/g, ""),
          addressLine1: fields.address.trim(),
          city: fields.city.trim(),
          state: "Karnataka",
          pincode: fields.pincode.trim(),
          paymentMethod: method.toUpperCase(),
          couponCode: coupon?.code ?? null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPlaceError(data.error ?? "Could not place the order.");
        return;
      }
      setOrder({
        orderNumber: data.order.orderNumber,
        total: data.order.total,
        discount: data.order.discount,
      });
      clear();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setPlaceError("Network error — please try again.");
    } finally {
      setPlacing(false);
    }
  };

  /* ---------- success screen ---------- */
  if (order) {
    const eta = new Date(Date.now() + 4 * 24 * 3600 * 1000).toLocaleDateString(
      "en-IN",
      { weekday: "long", day: "numeric", month: "long" },
    );
    return (
      <div className="bg-[var(--cream-page)] px-4 pb-24 pt-28 sm:pt-36">
        <div className="mx-auto max-w-xl text-center">
          <Reveal variant="zoom">
            <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[var(--forest)] shadow-[0_24px_50px_rgba(69,31,34,0.3)]">
              <Check className="h-12 w-12 text-[var(--cream)]" strokeWidth={3} />
            </span>
          </Reveal>
          <h1 className="font-display mt-8 text-[clamp(2.6rem,7vw,4.4rem)] leading-[0.95] text-[var(--forest)]">
            ORDER
            <br />
            <span className="text-[var(--sage-deep)]">CONFIRMED!</span>
          </h1>
          <p className="mt-4 text-base font-medium leading-relaxed text-[var(--forest-deep)]/90 sm:text-lg">
            Thank you, {fields.name.split(" ")[0] || "friend"}! Order{" "}
            <span className="font-extrabold text-[var(--forest)]">
              {order.orderNumber}
            </span>{" "}
            is being packed in our Bengaluru kitchen.
          </p>
          <div className="mt-8 rounded-[1.6rem] bg-white p-6 text-left shadow-[0_18px_44px_rgba(69,31,34,0.10)]">
            <dl className="space-y-2.5 text-sm font-semibold">
              <div className="flex justify-between">
                <dt className="text-[var(--olive)]">Amount {method === "cod" ? "to pay" : "paid"}</dt>
                <dd className="text-[var(--forest)]">
                  {formatINR(order.total)}
                </dd>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <dt className="text-[var(--olive)]">You saved</dt>
                  <dd className="text-[var(--sage-deep)]">{formatINR(order.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-[var(--olive)]">Payment</dt>
                <dd className="uppercase text-[var(--forest)]">
                  {payOptions.find((p) => p.id === method)?.label}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--olive)]">Expected delivery</dt>
                <dd className="text-[var(--forest)]">{eta}</dd>
              </div>
            </dl>
            <p className="mt-4 border-t border-[var(--forest)]/10 pt-4 text-xs font-medium leading-relaxed text-[var(--forest-deep)]/75">
              A confirmation has been sent to {fields.email}. Track this order
              anytime from <Link href="/account" className="font-bold underline">your account</Link>.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/account" className="btn-pill px-7 py-3.5 text-base">
              Track my order
            </Link>
            <Link
              href="/shop"
              className="rounded-full border-2 border-[var(--forest)]/25 px-7 py-3.5 text-base font-semibold text-[var(--forest)] transition hover:bg-[var(--cloud)]"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- empty cart ---------- */
  if (lines.length === 0) {
    return (
      <div className="bg-[var(--cream-page)] px-4 pb-24 pt-28 sm:pt-36">
        <div className="mx-auto max-w-md text-center">
          <img
            src="/images/adielas/jar-trio.png"
            alt=""
            aria-hidden="true"
            className="mx-auto w-48 -rotate-3 rounded-2xl shadow-md"
          />
          <h1 className="font-display mt-8 text-4xl leading-[0.95] text-[var(--forest)] sm:text-5xl">
            YOUR CART IS
            <br />
            <span className="text-[var(--sage-deep)]">STILL EMPTY</span>
          </h1>
          <p className="mt-3 text-base font-medium text-[var(--forest-deep)]/85">
            Add a jar (or three) and come back — checkout takes less than a
            minute.
          </p>
          <Link href="/shop" className="btn-pill mt-6 px-7 py-3.5 text-base">
            <ShoppingBag className="h-4 w-4" />
            Browse the jar wall
          </Link>
        </div>
      </div>
    );
  }

  /* ---------- checkout form ---------- */
  return (
    <div className="bg-[var(--cream-page)] pb-24 pt-28 sm:pt-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <div className="text-center">
          <span className="inline-block rounded-full border border-[var(--olive)]/35 bg-white/70 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--olive)]">
            Secure checkout
          </span>
          <h1 className="font-display mt-4 text-[clamp(2.8rem,7vw,5rem)] leading-[0.95] text-[var(--forest)]">
            ALMOST
            <span className="text-[var(--sage-deep)]"> THERE</span>
          </h1>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
          {/* form */}
          <Reveal variant="left">
            <div className="rounded-[1.8rem] bg-white p-6 shadow-[0_18px_44px_rgba(69,31,34,0.10)] sm:p-8">
              <h2 className="text-xl font-extrabold tracking-tight text-[var(--forest)]">
                Delivery details
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Input
                  label="Parent's name"
                  placeholder="Aarav's mom"
                  value={fields.name}
                  onChange={set("name")}
                  error={errors.name}
                  autoComplete="name"
                />
                <Input
                  label="Mobile"
                  placeholder="98765 43210"
                  inputMode="tel"
                  value={fields.phone}
                  onChange={set("phone")}
                  error={errors.phone}
                  autoComplete="tel"
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Email"
                    placeholder="you@example.com"
                    inputMode="email"
                    value={fields.email}
                    onChange={set("email")}
                    error={errors.email}
                    autoComplete="email"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="Address"
                    placeholder="Flat, street, landmark"
                    value={fields.address}
                    onChange={set("address")}
                    error={errors.address}
                    autoComplete="street-address"
                  />
                </div>
                <Input
                  label="City"
                  placeholder="Bengaluru"
                  value={fields.city}
                  onChange={set("city")}
                  error={errors.city}
                  autoComplete="address-level2"
                />
                <Input
                  label="PIN code"
                  placeholder="560078"
                  inputMode="numeric"
                  maxLength={6}
                  value={fields.pincode}
                  onChange={set("pincode")}
                  error={errors.pincode}
                  autoComplete="postal-code"
                />
              </div>

              <h2 className="mt-8 text-xl font-extrabold tracking-tight text-[var(--forest)]">
                Payment
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {payOptions.map(({ id, label, hint, Icon }) => (
                  <label
                    key={id}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition ${
                      method === id
                        ? "border-[var(--forest)] bg-[var(--cloud)]"
                        : "border-[var(--forest)]/15 bg-white hover:border-[var(--forest)]/35"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={id}
                      checked={method === id}
                      onChange={() => setMethod(id)}
                      className="sr-only"
                    />
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--sage-deep)]" />
                    <span>
                      <span className="block text-sm font-extrabold text-[var(--forest)]">
                        {label}
                      </span>
                      <span className="block text-xs font-medium text-[var(--forest-deep)]/70">
                        {hint}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
              <p className="mt-4 text-xs font-medium leading-relaxed text-[var(--forest-deep)]/70">
                Orders are stored securely in our system — the kitchen gets
                them instantly. COD available across India.
              </p>
            </div>
          </Reveal>

          {/* summary */}
          <Reveal variant="right">
            <div className="rounded-[1.8rem] bg-[var(--sage-soft)] p-6 shadow-[0_24px_54px_rgba(69,31,34,0.14)] sm:p-7 lg:sticky lg:top-24">
              <h2 className="font-display text-2xl tracking-wide text-white">
                YOUR ORDER
              </h2>
              <ul className="mt-5 space-y-3">
                {lines.map(({ item, product }) => (
                  <li key={item.slug} className="flex items-center gap-3">
                    <span className="relative block h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white">
                      <img
                        src={product!.image}
                        alt=""
                        aria-hidden="true"
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--forest)] text-[11px] font-extrabold text-[var(--cream)]">
                        {item.qty}
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-[var(--forest)]">
                        {product!.nameLines[0]} · {product!.nameLines[1]}
                      </span>
                      <span className="block text-xs font-semibold text-[var(--forest-deep)]/70">
                        {product!.weight}
                      </span>
                    </span>
                    <span className="text-sm font-extrabold text-[var(--forest)]">
                      {formatINR(product!.price * item.qty)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* coupon */}
              <div className="mt-5 rounded-2xl bg-white/85 p-3.5">
                {coupon ? (
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-sm font-extrabold text-[var(--forest)]">
                      <Tag className="h-4 w-4 text-[var(--sage-deep)]" />
                      {coupon.code} — {formatINR(coupon.discount)} off
                    </span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      aria-label="Remove coupon"
                      className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--forest)]/50 transition hover:bg-[var(--cloud)] hover:text-[#8c2f39]"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value.toUpperCase());
                        setCouponMsg(null);
                      }}
                      onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                      placeholder="Coupon code"
                      aria-label="Coupon code"
                      className="min-w-0 flex-1 rounded-xl border-2 border-[var(--forest)]/15 bg-white px-3 py-2 text-sm font-bold uppercase tracking-wide text-[var(--forest)] outline-none placeholder:normal-case placeholder:font-medium placeholder:text-[var(--forest)]/35 focus:border-[var(--sage-deep)]"
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      disabled={checkingCoupon || !couponInput.trim()}
                      className="rounded-xl bg-[var(--forest)] px-4 py-2 text-sm font-extrabold text-[var(--cream)] transition hover:bg-[var(--forest-deep)] disabled:opacity-50"
                    >
                      {checkingCoupon ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Apply"
                      )}
                    </button>
                  </div>
                )}
                {couponMsg && (
                  <p
                    className={`mt-2 text-xs font-semibold ${
                      couponMsg.ok ? "text-[var(--sage-deep)]" : "text-[#b3352f]"
                    }`}
                  >
                    {couponMsg.text}
                  </p>
                )}
              </div>

              <dl className="mt-6 space-y-2.5 border-t border-white/60 pt-5 text-sm font-semibold">
                <div className="flex justify-between text-[var(--forest-deep)]">
                  <dt>Subtotal</dt>
                  <dd>{formatINR(subtotal)}</dd>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[var(--sage-deep)]">
                    <dt>Coupon discount</dt>
                    <dd>−{formatINR(discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between text-[var(--forest-deep)]">
                  <dt>Shipping</dt>
                  <dd>
                    {shipping === 0 ? (
                      <span className="font-extrabold text-[var(--forest)]">
                        FREE
                      </span>
                    ) : (
                      formatINR(shipping)
                    )}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-white/60 pt-3">
                  <dt className="text-base font-extrabold text-[var(--forest)]">
                    Total
                  </dt>
                  <dd className="font-display text-3xl text-[var(--forest)]">
                    {formatINR(total)}
                  </dd>
                </div>
              </dl>

              {placeError && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#b3352f]"
                >
                  {placeError}
                </p>
              )}

              <button
                type="button"
                onClick={placeOrder}
                disabled={placing}
                className="btn-pill mt-6 flex w-full items-center justify-center gap-2 py-4 text-lg disabled:opacity-60"
              >
                {placing && <Loader2 className="h-4 w-4 animate-spin" />}
                {placing ? "Placing order…" : `Place order · ${formatINR(total)}`}
              </button>
              <p className="mt-3 text-center text-xs font-semibold text-[var(--forest-deep)]/75">
                Free 7-day returns · FSSAI certified kitchen
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
