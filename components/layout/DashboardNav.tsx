"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/types";
import { initials } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard/questions", label: "Q&A Feed",       icon: "💬" },
  { href: "/dashboard/mentors",   label: "Find Mentors",   icon: "🧑‍🏫" },
  { href: "/dashboard/profile",   label: "My Profile",     icon: "👤" },
];

export default function DashboardNav({ profile }: { profile: Profile | null }) {
  const pathname = usePathname();
  const router   = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-surface-100 flex flex-col z-10">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-surface-100">
        <span className="font-display text-xl font-bold text-brand-700">
          Food<span className="text-surface-800">Logic</span>
          <span className="ml-1">🧪</span>
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-surface-600 hover:bg-surface-50 hover:text-surface-900"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      <div className="px-4 py-4 border-t border-surface-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-bold">
            {profile ? initials(profile.full_name) : "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-surface-900 truncate">
              {profile?.full_name ?? "User"}
            </p>
            <p className="text-xs text-surface-400 capitalize truncate">
              {profile?.role ?? ""}
              {profile?.is_verified && (
                <span className="ml-1 text-brand-600">✓ verified</span>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full text-left text-sm text-surface-500 hover:text-surface-900 px-1 py-1 transition-colors"
        >
          ← Sign out
        </button>
      </div>
    </aside>
  );
}
