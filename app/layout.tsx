import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { DEFAULT_LANG, t } from "@/lib/i18n";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: t("app.name"),
  description: "CVA-based coffee cupping for Colombian specialty coffee",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={DEFAULT_LANG} className={inter.variable}>
      <body className="min-h-screen bg-white text-neutral-900">{children}</body>
    </html>
  );
}
