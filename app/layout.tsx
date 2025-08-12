import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./context/provider";
import Oneko from "@/components/oneko";
import { Analytics } from "@vercel/analytics/next";
import FeedbackBubble from "@/components/feedbackpopup";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyAttendance",
  description: "Track your attendance easily",
  manifest: "/manifest.json",
  themeColor: "#FFFFFF",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    title: "MyAttendance",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body className={inter.className}>
        <Providers>
          <FeedbackBubble />
          <Oneko />
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
