import "@/styles/globals.css";

export const metadata = {
  title: "Anugraha Pillai | Aeronautical Engineer & Aerospace Researcher",
  description: "Personal portfolio, technical dispatches, research papers, CFD visual posters, and aerospace engineering advisory.",
  icons: {
    icon: "/assets/logo.jpg",
    shortcut: "/assets/logo.jpg",
    apple: "/assets/logo.jpg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
