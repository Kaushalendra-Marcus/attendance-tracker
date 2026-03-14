import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./context/provider";
import Oneko from "@/components/oneko";
import { Analytics } from "@vercel/analytics/next";
import FeedbackBubble from "@/components/feedbackpopup";

// ✅ FIX: Inter (Google Font) hataya — network pe block hoti thi, app crash hoti thi
// System font stack use kar raha hai — fast + no network needed

// ✅ FIX: themeColor metadata se viewport mein move kiya (Next.js 15 requirement)
export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export const metadata: Metadata = {
  title: "MyAttendance",
  description: "Track your attendance easily",
  manifest: "/manifest.json",
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
      {/* ✅ System font — Inter jaisi dikhti hai, zero network calls */}
      <body style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
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