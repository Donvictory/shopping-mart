import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./components/storefront/cart-provider";
import SmoothSectionScroll from "./components/storefront/smooth-section-scroll";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Little Orbit | Clothes for Little Adventures",
    template: "%s | Little Orbit",
  },
  description:
    "Feel-good clothing for children and teenagers. Discover soft, comfortable styles made for every hop, skip, and grow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <CartProvider>
          <SmoothSectionScroll />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
