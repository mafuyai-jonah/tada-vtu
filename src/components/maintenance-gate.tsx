"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface MaintenanceStatus {
  active: boolean;
  message: string;
  eta: string | null;
}

// Paths where purchases/deposits actually happen. Withdrawals are a modal
// launched from the dashboard home page, not a route, so the home page is
// intentionally left out of this list — blocking it would also block access
// to withdrawals.
const BLOCKED_PATH_PREFIXES = [
  "/dashboard/buy-airtime",
  "/dashboard/buy-data",
  "/dashboard/fund-wallet",
];

export function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [status, setStatus] = useState<MaintenanceStatus | null>(null);

  useEffect(() => {
    let cancelled = false;

    const check = () => {
      fetch("/api/system/status")
        .then((r) => r.json())
        .then((data) => {
          if (!cancelled) setStatus(data);
        })
        .catch(() => {
          if (!cancelled) setStatus({ active: false, message: "", eta: null });
        });
    };

    check();
    const id = setInterval(check, 30_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const isBlockedPath = BLOCKED_PATH_PREFIXES.some((p) => pathname?.startsWith(p));

  if (status?.active && isBlockedPath) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <div className="max-w-md space-y-4 rounded-xl border border-border bg-card p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <svg
              className="h-6 w-6 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
              />
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-foreground">
            We&apos;re temporarily closed
          </h1>
          <p className="text-sm text-muted-foreground">
            {status.message ||
              "TADAPAY is offline while we work on the mobile app. Withdrawals are still available from your dashboard."}
          </p>
          {status.eta && (
            <p className="text-xs text-muted-foreground">
              Expected back: {status.eta}
            </p>
          )}
          <a
            href="/dashboard"
            className="inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Back to dashboard
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
