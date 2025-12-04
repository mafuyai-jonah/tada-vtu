"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IonIcon } from "@/components/ion-icon";
import Link from "next/link";
import { toast } from "sonner";
import { ELECTRICITY_PROVIDERS } from "@/lib/constants";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { useTransactionPin } from "@/hooks/useTransactionPin";
import { CreatePinModal } from "@/components/create-pin-modal";
import { VerifyPinModal } from "@/components/verify-pin-modal";

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 20000, 50000];

export default function ElectricityPage() {
  const { user, refreshUser } = useSupabaseUser();
  const { userPin, showCreatePin, setShowCreatePin, showVerifyPin, setShowVerifyPin, requirePin, onPinCreated, onPinVerified } = useTransactionPin();

  const [selectedDisco, setSelectedDisco] = useState("");
  const [meterNumber, setMeterNumber] = useState("");
  const [meterType, setMeterType] = useState<"prepaid" | "postpaid">("prepaid");
  const [amount, setAmount] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [token, setToken] = useState("");

  const verifyMeter = async () => {
    if (!selectedDisco || !meterNumber || meterNumber.length < 6) return;

    setIsVerifying(true);
    try {
      const response = await fetch("/api/inlomax/electricity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", disco: selectedDisco, meterNumber, meterType }),
      });
      const result = await response.json();
      if (result.status) {
        setCustomerName(result.data?.customerName || "Customer");
        toast.success("Meter verified!");
      } else {
        setCustomerName("");
        toast.error(result.message || "Verification failed");
      }
    } catch {
      toast.error("Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const executePurchase = async () => {
    const numAmount = parseInt(amount);
    setIsProcessing(true);

    try {
      const response = await fetch("/api/inlomax/electricity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          disco: selectedDisco,
          meterNumber,
          meterType,
          amount: numAmount,
          userId: user?.id,
        }),
      });

      const result = await response.json();
      if (result.status) {
        await refreshUser();
        if (result.data?.token) {
          setToken(result.data.token);
        }
        toast.success("Electricity purchase successful!", {
          description: `₦${numAmount.toLocaleString()} electricity token purchased`,
        });
      } else {
        toast.error(result.message || "Purchase failed");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseInt(amount);

    if (!selectedDisco || !meterNumber || !amount) {
      toast.error("Please fill all fields");
      return;
    }
    if (numAmount < 500 || numAmount > 500000) {
      toast.error("Amount must be between ₦500 and ₦500,000");
      return;
    }
    if (!user || (user.balance || 0) < numAmount) {
      toast.error("Insufficient balance");
      return;
    }
    requirePin(executePurchase);
  };

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    toast.success("Token copied to clipboard!");
  };

  const resetForm = () => {
    setToken("");
    setMeterNumber("");
    setAmount("");
    setCustomerName("");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/dashboard" className="p-2 -ml-2 hover:bg-muted rounded-lg transition-smooth lg:hidden">
              <IonIcon name="arrow-back-outline" size="20px" />
            </Link>
            <h1 className="text-lg font-semibold text-foreground ml-2 lg:ml-0">Electricity</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-6 max-w-2xl">
        {/* Token Display */}
        {token && (
          <Card className="border-green-500 bg-green-500/10 mb-6">
            <CardContent className="p-6 text-center">
              <IonIcon name="checkmark-circle" size="48px" color="#22c55e" />
              <h3 className="text-lg font-semibold text-foreground mt-2">Purchase Successful!</h3>
              <p className="text-muted-foreground text-sm mb-4">Your electricity token:</p>
              <div className="bg-background p-4 rounded-xl border border-border">
                <p className="text-2xl font-mono font-bold text-green-500 tracking-wider">{token}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={copyToken} variant="outline" className="flex-1">
                  <IonIcon name="copy-outline" size="18px" className="mr-2" /> Copy Token
                </Button>
                <Button onClick={resetForm} className="flex-1 bg-green-500 hover:bg-green-600">
                  <IonIcon name="add-outline" size="18px" className="mr-2" /> New Purchase
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!token && (
          <Card className="border-border">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                    <IonIcon name="flash" size="24px" color="#eab308" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Buy Electricity</CardTitle>
                    <CardDescription>Prepaid & Postpaid meter tokens</CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Balance</p>
                  <p className="font-bold text-green-500">₦{(user?.balance || 0).toLocaleString()}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handlePurchase} className="space-y-6">
                {/* DISCO Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Select Distribution Company</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                    {ELECTRICITY_PROVIDERS.map((disco) => (
                      <button
                        key={disco.value}
                        type="button"
                        onClick={() => { setSelectedDisco(disco.value); setCustomerName(""); }}
                        className={`p-3 rounded-xl border-2 transition-smooth text-left ${selectedDisco === disco.value ? "border-yellow-500 bg-yellow-500/10" : "border-border hover:border-yellow-500/50"}`}
                      >
                        <IonIcon name="flash" size="20px" className={selectedDisco === disco.value ? "text-yellow-500" : "text-muted-foreground"} />
                        <div className="font-medium text-xs text-foreground mt-1 line-clamp-2">{disco.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Meter Type */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Meter Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["prepaid", "postpaid"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setMeterType(type)}
                        className={`p-3 rounded-xl border-2 transition-smooth capitalize ${meterType === type ? "border-yellow-500 bg-yellow-500/10" : "border-border hover:border-yellow-500/50"}`}
                      >
                        <div className="font-semibold text-foreground">{type}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Meter Number */}
                <div className="space-y-2">
                  <Label htmlFor="meter" className="text-sm font-medium">Meter Number</Label>
                  <div className="relative">
                    <IonIcon name="speedometer-outline" size="18px" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="meter"
                      type="text"
                      placeholder="Enter meter number"
                      value={meterNumber}
                      onChange={(e) => setMeterNumber(e.target.value)}
                      onBlur={verifyMeter}
                      className="pl-10 bg-background border-border"
                      required
                    />
                    {isVerifying && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />}
                  </div>
                  {customerName && <p className="text-sm text-green-500 flex items-center gap-1"><IonIcon name="checkmark-circle" size="16px" /> {customerName}</p>}
                </div>

                {/* Amount */}
                <div className="space-y-3">
                  <Label htmlFor="amount" className="text-sm font-medium">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₦</span>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-8 bg-background border-border text-lg font-semibold"
                      min="500"
                      max="500000"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Min: ₦500 • Max: ₦500,000</p>
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
                        className={`px-4 py-2 rounded-lg border transition-smooth text-sm font-medium ${amount === value.toString() ? "border-yellow-500 bg-yellow-500/10 text-yellow-500" : "border-border hover:border-yellow-500/50 text-foreground"}`}
                      >
                        ₦{value.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                {selectedDisco && meterNumber && amount && parseInt(amount) >= 500 && (
                  <div className="bg-muted/50 p-4 rounded-xl space-y-2 text-sm">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <IonIcon name="receipt-outline" size="18px" color="#eab308" /> Summary
                    </h3>
                    <div className="flex justify-between"><span className="text-muted-foreground">DISCO</span><span className="font-medium">{ELECTRICITY_PROVIDERS.find(d => d.value === selectedDisco)?.label}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Meter</span><span className="font-medium">{meterNumber}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium capitalize">{meterType}</span></div>
                    <div className="border-t border-border pt-2 flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-yellow-500 text-lg">₦{parseInt(amount).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold h-12" disabled={!selectedDisco || !meterNumber || !amount || parseInt(amount) < 500 || isProcessing}>
                  {isProcessing ? <><div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />Processing...</> : <><IonIcon name="flash-outline" size="20px" className="mr-2" />Buy Electricity</>}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </main>

      <CreatePinModal userId={user?.id || ""} isOpen={showCreatePin} onClose={() => setShowCreatePin(false)} onSuccess={onPinCreated} canSkip={false} />
      <VerifyPinModal userPin={userPin} isOpen={showVerifyPin} onClose={() => setShowVerifyPin(false)} onVerified={onPinVerified} title="Authorize Purchase" description={`Enter PIN to buy ₦${amount} electricity`} />
    </div>
  );
}
