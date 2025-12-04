"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IonIcon } from "@/components/ion-icon";
import { LogoInline } from "@/components/logo";
import Link from "next/link";
import { getTimeBasedGreeting } from "@/hooks/useGreeting";
import {
  useSupabaseUser,
  useSupabaseTransactions,
} from "@/hooks/useSupabaseUser";
import { Typewriter } from "@/components/typewriter";
import { LoadingScreen } from "@/components/loading-screen";
import { toast } from "sonner";
import { getSupabase } from "@/lib/supabase/client";

const GREETING_MESSAGES = [
  "What would you like to do today?",
  "Ready to top up your airtime?",
  "Need some data? We've got you covered!",
  "Fast, reliable VTU services at your fingertips.",
  "Save more with our amazing discounts!",
  "Your one-stop shop for all recharges.",
  "Instant delivery, zero stress!",
  "Top up anytime, anywhere.",
  "Enjoy seamless transactions today!",
  "The best rates in town, guaranteed!",
  "Stay connected with TADA VTU.",
  "Quick, easy, and affordable.",
];

export default function DashboardPage() {
  const { user, loading: userLoading } = useSupabaseUser();
  const { transactions: recentTransactions, loading: transactionsLoading } =
    useSupabaseTransactions(5);
  const [hideBalance, setHideBalance] = useState(false);
  const [referralCount, setReferralCount] = useState(0);
  const [allTransactions, setAllTransactions] = useState<
    typeof recentTransactions
  >([]);

  // Load hide balance preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("hideBalance");
    if (saved === "true") setHideBalance(true);
  }, []);

  // Fetch all transactions for this month and referral count
  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      const supabase = getSupabase();

      // Get start of current month
      const now = new Date();
      const startOfMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
      ).toISOString();

      // Fetch this month's transactions
      const { data: monthTxns } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", startOfMonth)
        .order("created_at", { ascending: false });

      if (monthTxns) {
        setAllTransactions(monthTxns);
      }

      // Fetch referral count
      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("referred_by", user.id);

      setReferralCount(count || 0);
    };

    fetchData();
  }, [user?.id]);

  // Calculate monthly stats from transactions
  const monthlyStats = useMemo(() => {
    const stats = {
      totalSpent: 0,
      airtimeSpent: 0,
      dataSpent: 0,
      dataGB: 0,
    };

    allTransactions.forEach((txn) => {
      if (txn.amount < 0) {
        const amount = Math.abs(txn.amount);
        stats.totalSpent += amount;

        if (txn.type === "airtime") {
          stats.airtimeSpent += amount;
        } else if (txn.type === "data") {
          stats.dataSpent += amount;
          // Estimate GB from description (e.g., "MTN 2GB Data")
          const gbMatch = txn.description?.match(/(\d+(?:\.\d+)?)\s*GB/i);
          if (gbMatch) {
            stats.dataGB += parseFloat(gbMatch[1]);
          }
        }
      }
    });

    return stats;
  }, [allTransactions]);

  // Calculate referral earnings (₦100 per referral)
  const referralEarnings = referralCount * 100;

  const toggleHideBalance = () => {
    const newValue = !hideBalance;
    setHideBalance(newValue);
    localStorage.setItem("hideBalance", String(newValue));
  };

  const timeGreeting = user
    ? getTimeBasedGreeting((user.full_name || "User").split(" ")[0])
    : "Welcome";

  const copyReferralCode = () => {
    if (user?.referral_code) {
      navigator.clipboard.writeText(user.referral_code);
      toast.success("Referral code copied!", {
        description: "Share it with friends to earn rewards",
      });
    }
  };

  // Only show loading on first load when we don't have user data yet
  if (userLoading && !user) {
    return <LoadingScreen message="Loading your dashboard..." />;
  }

  // If not loading but no user, show error (auth guard should handle redirect)
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-border">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto">
              <IonIcon
                name="alert-circle-outline"
                size="32px"
                color="#eab308"
              />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Session expired
            </h2>
            <p className="text-muted-foreground">
              Please log in again to continue.
            </p>
            <Link href="/login">
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                Go to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const services = [
    { name: "Airtime", icon: "call-outline", href: "/dashboard/buy-airtime" },
    { name: "Data", icon: "wifi-outline", href: "/dashboard/buy-data" },
    { name: "Cable TV", icon: "tv-outline", href: "/dashboard/cable-tv" },
    {
      name: "Electricity",
      icon: "flash-outline",
      href: "/dashboard/electricity",
    },
    { name: "Betting", icon: "football-outline", href: "/dashboard/betting" },
    {
      name: "Rewards",
      icon: "gift-outline",
      href: "/dashboard/rewards",
      badge: "NEW",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <LogoInline size="md" />
            </Link>

            <div className="flex items-center gap-1">
              <Link href="/dashboard/notifications">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-muted transition-smooth"
                >
                  <IonIcon name="notifications-outline" size="22px" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full pulse-green"></span>
                </Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-muted transition-smooth"
                >
                  <IonIcon name="settings-outline" size="22px" />
                </Button>
              </Link>
              <Link
                href="/dashboard/profile"
                className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center ml-1 hover:from-green-500/30 hover:to-emerald-500/30 transition-smooth ring-2 ring-green-500/20"
              >
                <span className="text-green-500 font-semibold text-sm">
                  {(user.full_name || "U")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Greeting */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground animate-fade-in">
            {timeGreeting}
          </h1>
          <p className="text-muted-foreground h-6">
            <Typewriter
              texts={GREETING_MESSAGES}
              typingSpeed={50}
              deletingSpeed={25}
              pauseDuration={5000}
            />
          </p>
        </div>

        {/* Wallet Card */}
        <Card className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 border-0 overflow-hidden shadow-xl shadow-green-500/20 hover-lift animate-slide-up glow-green">
          <CardContent className="p-6 relative">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <div className="relative">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-green-100 text-sm font-medium flex items-center gap-2">
                    <IonIcon name="wallet-outline" size="16px" />
                    Available Balance
                    <button
                      onClick={toggleHideBalance}
                      className="ml-1 p-1 hover:bg-white/10 rounded-full transition-smooth"
                      title={hideBalance ? "Show balance" : "Hide balance"}
                    >
                      <IonIcon
                        name={hideBalance ? "eye-off-outline" : "eye-outline"}
                        size="16px"
                        color="white"
                      />
                    </button>
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    {hideBalance
                      ? "₦••••••"
                      : `₦${(user.balance || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`}
                  </h2>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <IonIcon name="card-outline" size="24px" color="white" />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Link
                  href="/dashboard/fund-wallet"
                  className="flex-1 sm:flex-none"
                >
                  <Button
                    size="sm"
                    className="w-full bg-white text-green-600 hover:bg-white/90 gap-2 font-semibold shadow-lg transition-smooth"
                  >
                    <IonIcon name="add-circle-outline" size="18px" />
                    Add Money
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 flex-1 sm:flex-none gap-2 font-medium transition-smooth"
                  onClick={() => toast.info("Withdraw feature coming soon!")}
                >
                  <IonIcon name="arrow-up-circle-outline" size="18px" />
                  Withdraw
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Quick Services
            </h2>
            <Link
              href="/dashboard/services"
              className="text-sm text-green-500 hover:text-green-400 flex items-center gap-1 font-medium transition-smooth"
            >
              View all <IonIcon name="chevron-forward" size="16px" />
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {services.map((service, index) => (
              <Link key={service.name} href={service.href}>
                <Card
                  className={`border-border hover:border-green-500/50 transition-smooth cursor-pointer group card-hover bg-card animate-scale-in stagger-${index + 1} relative overflow-hidden`}
                >
                  {"badge" in service && service.badge && (
                    <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-bold rounded-full">
                      {service.badge}
                    </span>
                  )}
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-smooth ${
                        "badge" in service
                          ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20 group-hover:from-amber-500 group-hover:to-orange-500"
                          : "bg-green-500/10 group-hover:bg-green-500"
                      }`}
                    >
                      <IonIcon
                        name={service.icon}
                        size="24px"
                        color={"badge" in service ? "#f59e0b" : "#22c55e"}
                        className="group-hover:!text-white"
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground">
                      {service.name}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Transactions - Takes 3 columns */}
          <Card
            className="lg:col-span-3 border-border animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Recent Transactions
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Your latest activities
                  </CardDescription>
                </div>
                <Link href="/dashboard/transactions">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-green-500 hover:text-green-400 hover:bg-green-500/10 font-medium transition-smooth"
                  >
                    See all
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {transactionsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : recentTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <IonIcon
                      name="receipt-outline"
                      size="32px"
                      className="text-muted-foreground"
                    />
                  </div>
                  <p className="text-foreground font-medium">
                    No transactions yet
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your transactions will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {recentTransactions.map((transaction, index) => {
                    const date = new Date(transaction.created_at);
                    const formattedDate = date.toLocaleDateString("en-NG", {
                      month: "short",
                      day: "numeric",
                    });
                    return (
                      <div
                        key={transaction.id}
                        className={`flex items-center justify-between py-3 px-3 -mx-3 rounded-xl hover:bg-muted/50 transition-smooth ${
                          index !== recentTransactions.length - 1
                            ? "border-b border-border/50"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              transaction.amount > 0
                                ? "bg-green-500/10"
                                : "bg-muted"
                            }`}
                          >
                            {transaction.amount > 0 ? (
                              <IonIcon
                                name="arrow-down"
                                size="20px"
                                color="#22c55e"
                              />
                            ) : (
                              <IonIcon
                                name="arrow-up"
                                size="20px"
                                className="text-muted-foreground"
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm text-foreground truncate">
                              {transaction.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formattedDate}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <p
                            className={`font-semibold text-sm ${
                              transaction.amount > 0
                                ? "text-green-500"
                                : "text-foreground"
                            }`}
                          >
                            {transaction.amount > 0 ? "+" : ""}₦
                            {Math.abs(transaction.amount).toLocaleString()}
                          </p>
                          {transaction.network && (
                            <p className="text-xs text-muted-foreground">
                              {transaction.network}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right Sidebar - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Monthly Stats */}
            <Card
              className="border-border animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">
                  This Month
                </CardTitle>
                <CardDescription className="text-sm">
                  Spending summary
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="flex items-center justify-between p-3 -mx-3 rounded-xl hover:bg-muted/50 transition-smooth">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                      <IonIcon name="trending-up" size="20px" color="#22c55e" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Total Spent
                    </span>
                  </div>
                  <span className="font-semibold text-foreground">
                    ₦{monthlyStats.totalSpent.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 -mx-3 rounded-xl hover:bg-muted/50 transition-smooth">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                      <IonIcon name="wifi" size="20px" color="#22c55e" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Data Purchased
                    </span>
                  </div>
                  <span className="font-semibold text-foreground">
                    {monthlyStats.dataGB > 0
                      ? `${monthlyStats.dataGB}GB`
                      : "0GB"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 -mx-3 rounded-xl hover:bg-muted/50 transition-smooth">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                      <IonIcon name="call" size="20px" color="#22c55e" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Airtime
                    </span>
                  </div>
                  <span className="font-semibold text-foreground">
                    ₦{monthlyStats.airtimeSpent.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Referral Card */}
            <Card
              className="border-border animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <IonIcon name="gift" size="16px" color="white" />
                  </div>
                  Refer & Earn
                </CardTitle>
                <CardDescription className="text-sm">
                  Invite friends, earn ₦100 per referral
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Your Referrals
                  </span>
                  <span className="font-semibold text-foreground">
                    {referralCount} {referralCount === 1 ? "friend" : "friends"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Earnings
                  </span>
                  <span className="font-semibold text-green-500">
                    ₦{referralEarnings.toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold transition-smooth"
                    size="sm"
                    onClick={copyReferralCode}
                  >
                    <IonIcon name="copy-outline" size="16px" className="mr-2" />
                    Copy Code
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-500/30 text-green-500 hover:bg-green-500/10 transition-smooth"
                    asChild
                  >
                    <Link href="/dashboard/referrals">
                      <IonIcon name="share-social-outline" size="16px" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
