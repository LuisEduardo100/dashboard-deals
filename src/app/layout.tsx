import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Dashboard Comercial | Bitrix24",
  description: "Dashboard de vendas em tempo real integrado ao Bitrix24",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body
        className="font-sans antialiased bg-[#121212] text-white min-h-screen"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
