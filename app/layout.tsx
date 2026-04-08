import type { Metadata } from "next";
import { Manrope, Montserrat } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope"
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat"
});

export const metadata: Metadata = {
  title: "Wall Calendar",
  description: "A realistic wall calendar with tactile depth, page flips, and editable notes."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${montserrat.variable}`}>{children}</body>
    </html>
  );
}
