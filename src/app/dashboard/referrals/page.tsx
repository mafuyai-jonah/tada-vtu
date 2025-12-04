"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Copy,
  Share2,
  Users,
  DollarSign,
  Gift,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { getSupabase } from "@/lib/supabase/client";

interface Referral {
  id: string;
  full_name: string | null;
  created_at: string;
  balance: number;
}

export default function ReferralsPage() {
  const { user } = useSupabaseUser();
  const [copied, setCopied] = useState(false);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch referrals from database
  useEffect(() => {
    if (!user?.id) return;

    const fetchReferrals = async () => {
      setLoading(true);
      const supabase = getSupabase();
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, created_at, balance')
        .eq('referred_by', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setReferrals(data);
      }
      setLoading(false);
    };

    fetchReferrals();
  }, [user?.id]);

  const referralCode = user?.referral_code || 'LOADING...';
  const referralLink = `https://tadavtu.com/register?ref=${referralCode}`;
  
  // Calculate stats
  const totalReferrals = referrals.length;
  // Active = has made a deposit (balance > 0 or has transactions)
  const activeReferrals = referrals.filter(r => r.balance > 0).length;
  const pendingReferrals = totalReferrals - activeReferrals;
  const totalEarnings = activeReferrals * 100; // ₦100 per active referral
  const pendingEarnings = pendingReferrals * 100;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join TADA VTU",
          text: `Use my referral code ${referralCode} to get started with TADA VTU!`,
          url: referralLink,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-green-600 hover:text-green-700 mb-6 lg:hidden"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Referral Program
          </h1>
          <p className="text-muted-foreground">
            Invite friends and earn ₦100 for each successful referral!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-600 to-emerald-600 border-0 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 mb-1">Total Referrals</p>
                  <p className="text-4xl font-bold">{totalReferrals}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600 to-cyan-600 border-0 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 mb-1">Total Earnings</p>
                  <p className="text-4xl font-bold">₦{totalEarnings}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-pink-600 border-0 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 mb-1">Pending</p>
                  <p className="text-4xl font-bold">₦{pendingEarnings}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Gift className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Link Card */}
        <Card className="mb-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-card-foreground">
              Your Referral Link
            </CardTitle>
            <CardDescription>
              Share this link with friends to earn rewards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1 p-3 bg-card rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-1">
                    Referral Code
                  </p>
                  <p className="font-mono font-bold text-lg text-card-foreground">
                    {referralCode}
                  </p>
                </div>
                <Button
                  onClick={handleCopy}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="flex gap-2">
                <div className="flex-1 p-3 bg-card rounded-lg border border-border overflow-hidden">
                  <p className="text-sm text-card-foreground truncate">
                    {referralLink}
                  </p>
                </div>
                <Button
                  onClick={handleShare}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="mb-8 border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">1</span>
                </div>
                <h3 className="font-semibold text-card-foreground mb-2">
                  Share Your Link
                </h3>
                <p className="text-sm text-muted-foreground">
                  Share your unique referral link with friends and family
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="font-semibold text-card-foreground mb-2">
                  They Sign Up
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your friend creates an account using your referral code
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <h3 className="font-semibold text-card-foreground mb-2">
                  Earn Rewards
                </h3>
                <p className="text-sm text-muted-foreground">
                  Get ₦100 when they make their first deposit
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referral History */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">
              Referral History
            </CardTitle>
            <CardDescription>Track your referrals and earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : referrals.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No referrals yet. Start sharing your link!
                  </p>
                </div>
              ) : (
                referrals.map((referral) => {
                  const isActive = referral.balance > 0;
                  const displayName = referral.full_name || 'Anonymous User';
                  const joinDate = new Date(referral.created_at).toLocaleDateString('en-NG', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  });
                  
                  return (
                    <div
                      key={referral.id}
                      className="flex items-center justify-between p-4 bg-card rounded-lg border border-border"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-semibold">
                            {displayName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-card-foreground">
                            {displayName.split(' ')[0]}{displayName.split(' ')[1] ? ` ${displayName.split(' ')[1].charAt(0)}.` : ''}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Joined {joinDate}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold ${
                            isActive
                              ? "text-green-600"
                              : "text-muted-foreground"
                          }`}
                        >
                          {isActive ? "+₦100" : "Pending"}
                        </p>
                        <span
                          className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                            isActive
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }`}
                        >
                          {isActive ? "Active" : "Pending"}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
