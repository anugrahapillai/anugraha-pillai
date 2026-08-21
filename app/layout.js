import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "Anugraha Pillai | Aeronautical Engineer",
  description: "Personal portfolio, technical dispatches, research papers, CFD visual posters, and aeronautical engineering advisory.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
