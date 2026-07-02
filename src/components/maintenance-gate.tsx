"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IonIcon } from "@/components/ion-icon";

interface MaintenanceStatus {
  active: boolean;
  message: string;
  eta: string | null;
}

const BLOCKED_PATHS = [
  "/dashboard/buy-airtime",
  "/dashboard/buy-data",
  "/dashboard/fund-wallet",
];

export function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
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

  // Redirect away from purchase pages when maintenance is active
  useEffect(() => {
    if (!status?.active) return;
    const isBlocked = BLOCKED_PATHS.some((p) => pathname?.startsWith(p));
    if (isBlocked) {
      router.replace("/dashboard");
    }
  }, [status, pathname, router]);

  return (
    <>
      {status?.active && (
        <div className="fixed top-0 left-0 right-0 z-[100] px-4 py-2 text-center text-sm font-medium bg-amber-500 text-white">
          <div className="flex items-center justify-center gap-2">
            <IonIcon name="construct-outline" size="16px" />
            <span>
              {status.message || "TADAPAY is temporarily under maintenance. Withdrawals are still available."}
            </span>
          </div>
        </div>
      )}
      <div className={status?.active ? "pt-10" : ""}>
        {children}
      </div>
    </>
  );
}
