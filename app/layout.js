import "@/styles/globals.css";

export const metadata = {
  title: "Anugraha Pillai | Aeronautical Engineer",
  description: "Personal portfolio, technical dispatches, research papers, CFD visual posters, and aerospace engineering advisory.",
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
      <body>{children}</body>
    </html>
  );
}
