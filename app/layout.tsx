import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PaciPort — 1-Click Position Migration",
  description:
    "Migrate open perpetual positions from Binance to Pacifica in < 2 seconds. Zero market exposure. Zero price risk.",
  keywords: [
    "Pacifica Exchange",
    "position migration",
    "delta-neutral",
    "perpetual futures",
    "TVL",
    "CCXT",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full ${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-(--text-primary) font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
