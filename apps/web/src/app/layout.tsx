import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../components/providers";

export const metadata: Metadata = {
  title: "RentMatch",
  description: "Rental marketplace with smart bundle ranking and Hebrew-first RTL UX.",
  icons: {
    icon: "/logos/2.png",
    shortcut: "/logos/2.png",
    apple: "/logos/2.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
