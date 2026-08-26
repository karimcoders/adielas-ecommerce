import type { Metadata } from "next";
import { Anton, Archivo, Yellowtail, Caveat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

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
  title: "More Nutrition — Matcha meets Protein",
  description:
    "Protein Iced Matcha Latte — 20g of protein, 95% less sugar, 85mg of natural caffeine. Clean, green goodness in every sip.",
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
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
        {children}
        <Toaster />
      </body>
    </html>
  );
}
