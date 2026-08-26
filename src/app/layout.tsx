import type { Metadata } from "next";
import { Anton, Archivo, Yellowtail, Caveat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/components/more/CartProvider";
import { CartDrawer } from "@/components/more/CartDrawer";
import { Navbar } from "@/components/more/Navbar";
import { Footer } from "@/components/more/Footer";
import { ScrollProgress } from "@/components/more/motion";

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const yellowtail = Yellowtail({
  variable: "--font-yellowtail",
  weight: "400",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ADIELAS — Premium Nutrition for Growing Children",
  description:
    "Clean, simple, science-backed nutrition for growing children — sprouted grains, multigrains and dry fruits, formulated with a pediatrician. Stage 1, 2 and 3.",
  icons: {
    icon: "/images/adielas/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${anton.variable} ${archivo.variable} ${yellowtail.variable} ${caveat.variable} antialiased`}
      >
        <CartProvider>
          <div className="flex min-h-screen flex-col bg-[var(--sage)] text-[var(--forest)]">
            <ScrollProgress />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer className="mt-auto" />
            <CartDrawer />
          </div>
        </CartProvider>
        <Toaster />
      </body>
    </html>
  );
}
