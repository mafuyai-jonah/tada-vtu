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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IonIcon } from "@/components/ion-icon";
import Link from "next/link";
import { toast } from "sonner";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { useTransactionPin } from "@/hooks/useTransactionPin";
import { CreatePinModal } from "@/components/create-pin-modal";
import { VerifyPinModal } from "@/components/verify-pin-modal";

interface BettingPlatform {
  id: string;
  name: string;
}

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000, 20000];

export default function BettingPage() {
  const { user, refreshUser } = useSupabaseUser();
  const {
    userPin,
    showCreatePin,
    setShowCreatePin,
    showVerifyPin,
    setShowVerifyPin,
    requirePin,
    onPinCreated,
    onPinVerified,
  } = useTransactionPin();

  const [platforms, setPlatforms] = useState<BettingPlatform[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Fetch platforms on mount
  useEffect(() => {
    fetchPlatforms();
  }, []);

  const fetchPlatforms = async () => {
    try {
      const response = await fetch("/api/inlomax/betting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_platforms" }),
      });
      const result = await response.json();
      if (result.status) {
        setPlatforms(result.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch platforms:", error);
    }
  };


  const handleVerifyCustomer = async () => {
    if (!selectedPlatform || !customerId) {
      toast.error("Please select platform and enter customer ID");
      return;
    }

    setIsVerifying(true);
    setIsVerified(false);
    setCustomerName("");

    try {
      const response = await fetch("/api/inlomax/betting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          platform: selectedPlatform,
          customerId,
        }),
      });

      const result = await response.json();

      if (result.status) {
        setCustomerName(result.data?.customerName || "Customer");
        setIsVerified(true);
        toast.success("Customer verified successfully");
      } else {
        toast.error(result.message || "Verification failed");
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.");
      console.error("Verification error:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  const executeFunding = async () => {
    const numAmount = parseInt(amount);

    setIsProcessing(true);
    try {
      const response = await fetch("/api/inlomax/betting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: selectedPlatform,
          customerId,
          amount: numAmount,
          userId: user?.id,
        }),
      });

      const result = await response.json();

      if (result.status) {
        await refreshUser();
        const platformName = platforms.find(p => p.id === selectedPlatform)?.name || selectedPlatform;
        toast.success("Betting account funded!", {
          description: `₦${numAmount.toLocaleString()} sent to ${platformName} - ${customerId}`,
        });
        setCustomerId("");
        setAmount("");
        setSelectedPlatform("");
        setIsVerified(false);
        setCustomerName("");
      } else {
        toast.error(result.message || "Funding failed");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.error("Funding error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFunding = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPlatform || !customerId || !amount) {
      toast.error("Please fill all fields");
      return;
    }

    if (!isVerified) {
      toast.error("Please verify customer ID first");
      return;
    }

    const numAmount = parseInt(amount);
    if (numAmount < 100) {
      toast.error("Minimum amount is ₦100");
      return;
    }

    if (!user || (user.balance || 0) < numAmount) {
      toast.error("Insufficient balance", {
        description: `You need ₦${numAmount.toLocaleString()} but have ₦${(user?.balance || 0).toLocaleString()}`,
      });
      return;
    }

    requirePin(executeFunding);
  };

  const selectedPlatformName = platforms.find(p => p.id === selectedPlatform)?.name || "";


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center h-16">
            <Link
              href="/dashboard"
              className="p-2 -ml-2 hover:bg-muted rounded-lg transition-smooth lg:hidden"
            >
              <IonIcon name="arrow-back-outline" size="20px" />
            </Link>
            <h1 className="text-lg font-semibold text-foreground ml-2 lg:ml-0">
              Betting Wallet
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-6 max-w-2xl">
        <Card className="border-border">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                  <IonIcon name="football" size="24px" color="#f97316" />
                </div>
                <div>
                  <CardTitle className="text-xl">Fund Betting Wallet</CardTitle>
                  <CardDescription>
                    Top up your betting account instantly
                  </CardDescription>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Balance</p>
                <p className="font-bold text-green-500">
                  ₦{(user?.balance || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleFunding} className="space-y-6">
              {/* Platform Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Select Platform</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => {
                        setSelectedPlatform(platform.id);
                        setIsVerified(false);
                        setCustomerName("");
                      }}
                      className={`p-3 rounded-xl border-2 transition-smooth ${
                        selectedPlatform === platform.id
                          ? "border-orange-500 bg-orange-500/10"
                          : "border-border hover:border-orange-500/50"
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-semibold text-sm text-foreground">
                          {platform.name}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer ID */}
              <div className="space-y-2">
                <Label htmlFor="customerId" className="text-sm font-medium">
                  Customer ID / User ID
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <IonIcon
                      name="person-outline"
                      size="18px"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="customerId"
                      type="text"
                      placeholder="Enter your betting ID"
                      value={customerId}
                      onChange={(e) => {
                        setCustomerId(e.target.value);
                        setIsVerified(false);
                        setCustomerName("");
                      }}
                      className="pl-10 bg-background border-border"
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleVerifyCustomer}
                    disabled={!selectedPlatform || !customerId || isVerifying}
                    className="border-orange-500 text-orange-500 hover:bg-orange-500/10"
                  >
                    {isVerifying ? (
                      <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Verify"
                    )}
                  </Button>
                </div>
                {isVerified && customerName && (
                  <div className="flex items-center gap-2 text-sm text-green-500">
                    <IonIcon name="checkmark-circle" size="16px" />
                    <span>Verified: {customerName}</span>
                  </div>
                )}
              </div>


              {/* Amount */}
              <div className="space-y-3">
                <Label htmlFor="amount" className="text-sm font-medium">
                  Amount
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                    ₦
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8 bg-background border-border text-lg font-semibold"
                    min="100"
                    max="1000000"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Min: ₦100 • Max: ₦1,000,000
                </p>
              </div>

              {/* Quick Amounts */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Quick Select</Label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_AMOUNTS.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setAmount(value.toString())}
                      className={`px-4 py-2 rounded-lg border transition-smooth text-sm font-medium ${
                        amount === value.toString()
                          ? "border-orange-500 bg-orange-500/10 text-orange-500"
                          : "border-border hover:border-orange-500/50 text-foreground"
                      }`}
                    >
                      ₦{value.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              {selectedPlatform && isVerified && amount && parseInt(amount) >= 100 && (
                <div className="bg-muted/50 p-4 rounded-xl space-y-3">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <IonIcon name="receipt-outline" size="18px" color="#f97316" />
                    Funding Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Platform</span>
                      <span className="font-medium text-foreground">
                        {selectedPlatformName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Customer ID</span>
                      <span className="font-medium text-foreground">{customerId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Customer Name</span>
                      <span className="font-medium text-foreground">{customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-medium text-foreground">
                        ₦{parseInt(amount).toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t border-border pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-foreground">Total</span>
                        <span className="font-bold text-orange-500 text-lg">
                          ₦{parseInt(amount).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold h-12 transition-smooth"
                disabled={
                  !selectedPlatform ||
                  !customerId ||
                  !isVerified ||
                  !amount ||
                  parseInt(amount) < 100 ||
                  isProcessing
                }
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <IonIcon name="wallet-outline" size="20px" />
                    Fund Account
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border-border bg-orange-500/5 border-orange-500/20 mt-6">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <IonIcon
                name="information-circle"
                size="20px"
                color="#f97316"
                className="shrink-0 mt-0.5"
              />
              <div className="text-sm">
                <p className="font-medium text-foreground mb-1">How it works</p>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Select your betting platform</li>
                  <li>• Enter your customer/user ID</li>
                  <li>• Verify your account</li>
                  <li>• Enter amount and fund instantly</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* PIN Modals */}
      <CreatePinModal
        userId={user?.id || ""}
        isOpen={showCreatePin}
        onClose={() => setShowCreatePin(false)}
        onSuccess={onPinCreated}
        canSkip={false}
      />

      <VerifyPinModal
        userPin={userPin}
        isOpen={showVerifyPin}
        onClose={() => setShowVerifyPin(false)}
        onVerified={onPinVerified}
        title="Authorize Funding"
        description={`Enter PIN to fund ₦${amount} to ${selectedPlatformName}`}
      />
    </div>
  );
}
