"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IonIcon } from "@/components/ion-icon";
import { LogoInline } from "@/components/logo";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "/dashboard", icon: "home", exact: true },
  { name: "Airtime", href: "/dashboard/buy-airtime", icon: "call" },
  { name: "Data", href: "/dashboard/buy-data", icon: "wifi" },
  { name: "Transactions", href: "/dashboard/transactions", icon: "time" },
  { name: "Rewards", href: "/dashboard/rewards", icon: "gift" },
  { name: "Profile", href: "/dashboard/profile", icon: "person" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-border bg-card/50 backdrop-blur-xl z-40">
      <div className="p-6 border-b border-border">
        <LogoInline size="sm" />
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <IonIcon
                name={isActive ? item.icon : `${item.icon}-outline`}
                className={cn(
                  "transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
                size="20px"
              />
              <span>{item.name}</span>
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-border space-y-1">
          <Link
            href="/dashboard/referrals"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              pathname.startsWith("/dashboard/referrals")
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <IonIcon
              name={
                pathname.startsWith("/dashboard/referrals")
                  ? "people"
                  : "people-outline"
              }
              className={cn(
                "transition-colors",
                pathname.startsWith("/dashboard/referrals")
                  ? "text-primary"
                  : "text-muted-foreground group-hover:text-foreground",
              )}
              size="20px"
            />
            <span>Referrals</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              pathname.startsWith("/dashboard/settings")
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <IonIcon
              name={
                pathname.startsWith("/dashboard/settings")
                  ? "settings"
                  : "settings-outline"
              }
              className={cn(
                "transition-colors",
                pathname.startsWith("/dashboard/settings")
                  ? "text-primary"
                  : "text-muted-foreground group-hover:text-foreground",
              )}
              size="20px"
            />
            <span>Settings</span>
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-muted/50 p-4 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground mb-2">Need Help?</p>
          <Link
            href="https://wa.me/2349076721885"
            target="_blank"
            className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center gap-2"
          >
            <IonIcon name="logo-whatsapp" />
            Contact Support
          </Link>
        </div>
      </div>
    </aside>
  );
}

export function DashboardBottomNav() {
  const pathname = usePathname();

  // Mobile nav usually has fewer items to fit screen
  const mobileNavItems = [
    { name: "Home", href: "/dashboard", icon: "home", exact: true },
    // Assuming airtime is a key service to jump to
    { name: "Airtime", href: "/dashboard/buy-airtime", icon: "call" },
    { name: "Rewards", href: "/dashboard/rewards", icon: "gift" },
    { name: "History", href: "/dashboard/transactions", icon: "time" },
    { name: "Profile", href: "/dashboard/profile", icon: "person" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border lg:hidden z-50 pb-1">
      <div className="flex items-center justify-around py-2">
        {mobileNavItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all min-w-[4rem]",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <IonIcon
                name={isActive ? item.icon : `${item.icon}-outline`}
                size="22px"
              />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
