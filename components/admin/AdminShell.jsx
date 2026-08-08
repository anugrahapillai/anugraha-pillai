"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { phaseOneAuth, phaseOneAuthNotice } from "@/lib/client/auth-client";

import FirebaseStorageWidget from "@/components/admin/FirebaseStorageWidget";

const navigation = [
  ["Dashboard", "/admin/dashboard"], ["Aero Outlook", "/admin/blogs"],
  ["Aero Graphics", "/admin/posters"], ["Research & Analysis", "/admin/research"],
  ["Services", "/admin/services"], ["Edit Profile", "/admin/settings"],
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuRef = useRef(null);
  const firstLinkRef = useRef(null);
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (!drawerOpen) return;
    const menuButton = menuRef.current;
    firstLinkRef.current?.focus();
    const close = (event) => { if (event.key === "Escape") setDrawerOpen(false); };
    document.addEventListener("keydown", close);
    return () => { document.removeEventListener("keydown", close); menuButton?.focus(); };
  }, [drawerOpen]);

  if (isLogin) return children;

  const logout = async () => {
    await phaseOneAuth.signOut().catch(() => null);
    router.replace("/admin/login?reason=signed-out");
    router.refresh();
  };

  return <div className="admin-shell">
    <aside id="admin-navigation" className={`admin-sidebar ${drawerOpen ? "is-open" : ""}`} aria-label="Admin navigation">
      <div className="admin-brand">
        <img
          src="/assets/logo.jpg"
          alt="Anugraha Logo"
          style={{ width: "33px", height: "33px", borderRadius: "50%", objectFit: "cover", border: "1.5px solid var(--lilac)" }}
        />
        <span>Anugraha<br /><small>Content studio</small></span>
      </div>
      <nav>{navigation.map(([label, href], index) => <Link ref={index === 0 ? firstLinkRef : undefined} key={href} href={href} aria-current={pathname === href ? "page" : undefined} onClick={() => setDrawerOpen(false)}>{label}</Link>)}</nav>
      <div className="admin-sidebar__footer"><button type="button" onClick={logout}>Sign out</button><small>CMS Admin Studio</small></div>
    </aside>
    {drawerOpen && <button className="admin-backdrop" aria-label="Close navigation" onClick={() => setDrawerOpen(false)} />}
    <div className="admin-workspace">
      <header className="admin-topbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button ref={menuRef} className="admin-menu" type="button" aria-expanded={drawerOpen} aria-controls="admin-navigation" onClick={() => setDrawerOpen(!drawerOpen)}>Menu</button>
          <p style={{ margin: 0 }}>{phaseOneAuthNotice}</p>
        </div>
        <FirebaseStorageWidget />
      </header>
      <main className="admin-main">{children}</main>
    </div>
  </div>;
}
