import type { Metadata } from "next";
import { Anton, Archivo, Yellowtail, Caveat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { CatalogProvider } from "@/components/more/CatalogProvider";
import { CartProvider } from "@/components/more/CartProvider";
import { SiteChrome } from "@/components/more/SiteChrome";
import { getCatalog } from "@/lib/server-catalog";
import { getAllCms } from "@/lib/cms";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const catalog = await getCatalog();
  const cms = await getAllCms();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${anton.variable} ${archivo.variable} ${yellowtail.variable} ${caveat.variable} antialiased`}
      >
        <CatalogProvider products={catalog}>
          <CartProvider>
          <SiteChrome cmsFooter={cms.footer} cmsSettings={cms.settings}>
          <div className="flex min-h-screen flex-col bg-[var(--sage)] text-[var(--forest)]">
            <main className="flex-1">{children}</main>
          </div>
          </SiteChrome>
          </CartProvider>
        </CatalogProvider>
        <Toaster />
      </body>
    </html>
  );
}
