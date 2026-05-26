import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../components/providers";

export const metadata: Metadata = {
  title: "RentMatch — שוק השכרות חכם",
  description:
    "RentMatch הוא שוק ההשכרות החכם בישראל: בונים לכם חבילה אחת מכל הציוד שצריך, מהמשכירים המאומתים, במחיר משתלם וקרוב לבית.",
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
