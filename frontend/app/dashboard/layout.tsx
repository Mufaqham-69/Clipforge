"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem("access_token");
    router.push("/");
  }

  const menuItems = [
    {
      label: "Shows",
      href: "/dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      label: "Billing",
      href: "/pricing", // Direct to pricing to add card or see pricing
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen text-ink bg-void flex flex-col md:flex-row relative">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-surface border-b border-line sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-tr from-lime to-violet flex items-center justify-center font-bold text-void text-xs">
            CF
          </div>
          <span className="font-display text-base font-bold tracking-tight">
            Clip<span className="text-lime">Forge</span>
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-ink-dim hover:text-ink focus:outline-none p-1.5 border border-line rounded"
        >
          {mobileMenuOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </header>

      {/* Sidebar - Desktop */}
      <aside className={`w-64 bg-surface border-r border-line flex flex-col justify-between p-6 fixed h-[calc(100vh-65px)] md:h-screen top-[65px] md:top-0 left-0 z-30 transition-transform duration-300 md:translate-x-0 ${
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="space-y-8">
          {/* Brand header - Desktop only */}
          <div className="hidden md:flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-lime to-violet flex items-center justify-center font-bold text-void">
              CF
            </div>
            <span className="font-display text-xl font-bold tracking-tight">
              Clip<span className="text-lime">Forge</span>
            </span>
          </div>

          {/* Workspace drop selection mock */}
          <div className="bg-surface-raised border border-line rounded-lg p-3">
            <p className="text-[10px] font-mono text-ink-dim uppercase tracking-wider">Active Workspace</p>
            <div className="flex items-center justify-between mt-1 cursor-pointer group">
              <span className="text-sm font-semibold truncate group-hover:text-lime">My Show Studio</span>
              <svg className="w-3.5 h-3.5 text-ink-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4 4 4-4" />
              </svg>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href === "/dashboard" && pathname.startsWith("/dashboard"));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-lime/10 text-lime border-l-2 border-lime font-semibold"
                      : "text-ink-dim hover:text-ink hover:bg-surface-raised border-l-2 border-transparent"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom profile and logout */}
        <div className="space-y-4 border-t border-line/60 pt-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-violet-bg border border-violet/30 flex items-center justify-center text-violet text-sm font-bold">
              U
            </div>
            <div className="truncate">
              <h5 className="text-xs font-semibold text-ink">Creator Account</h5>
              <p className="text-[10px] text-ink-dim truncate">trialing active</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-void hover:bg-line/40 border border-line text-ink-dim hover:text-coral text-xs py-2 rounded-md transition-all duration-200 font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 md:pl-64 min-h-[calc(100vh-65px)] md:min-h-screen dashboard-mesh-bg">
        {children}
      </div>
    </div>
  );
}
