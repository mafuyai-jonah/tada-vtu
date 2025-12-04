"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IonIcon } from "@/components/ion-icon";
import Link from "next/link";
import { toast } from "sonner";
import { CABLE_PROVIDERS, CABLE_PLANS } from "@/lib/constants";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { useTransactionPin } from "@/hooks/useTransactionPin";
import { CreatePinModal } from "@/components/create-pin-modal";
import { VerifyPinModal } from "@/components/verify-pin-modal";

type CableProvider = keyof typeof CABLE_PLANS;

export default function CableTVPage() {
  const { user, refreshUser } = useSupabaseUser();
  const { userPin, showCreatePin, setShowCreatePin, showVerifyPin, setShowVerifyPin, requirePin, onPinCreated, onPinVerified } = useTransactionPin();

  const [selectedProvider, setSelectedProvider] = useState<CableProvider | "">("");
  const [smartCardNumber, setSmartCardNumber] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const availablePlans = selectedProvider ? CABLE_PLANS[selectedProvider] || [] : [];
  const selectedPlanDetails = availablePlans.find((plan) => plan.id === selectedPlan);

  const verifySmartCard = async () => {
    if (!selectedProvider || !smartCardNumber || smartCardNumber.length < 10) return;

    setIsVerifying(true);
    try {
      const response = await fetch("/api/inlomax/cable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", provider: selectedProvider, smartCardNumber }),
      });
      const result = await response.json();
      if (result.status) {
        setCustomerName(result.data?.customerName || "Customer");
        toast.success("Smart card verified!");
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
    if (!selectedPlanDetails) return;
    setIsProcessing(true);

    try {
      const response = await fetch("/api/inlomax/cable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: selectedProvider,
          smartCardNumber,
          planId: selectedPlanDetails.id,
          amount: selectedPlanDetails.price,
          planName: selectedPlanDetails.name,
          userId: user?.id,
        }),
      });

      const result = await response.json();
      if (result.status) {
        await refreshUser();
        toast.success("Cable subscription successful!", {
          description: `${selectedPlanDetails.name} activated for ${smartCardNumber}`,
        });
        setSmartCardNumber("");
        setSelectedPlan("");
        setCustomerName("");
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
    if (!selectedProvider || !smartCardNumber || !selectedPlan || !selectedPlanDetails) {
      toast.error("Please fill all fields");
      return;
    }
    if (!user || (user.balance || 0) < selectedPlanDetails.price) {
      toast.error("Insufficient balance");
      return;
    }
    requirePin(executePurchase);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/dashboard" className="p-2 -ml-2 hover:bg-muted rounded-lg transition-smooth lg:hidden">
              <IonIcon name="arrow-back-outline" size="20px" />
            </Link>
            <h1 className="text-lg font-semibold text-foreground ml-2 lg:ml-0">Cable TV</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-6 max-w-2xl">
        <Card className="border-border">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <IonIcon name="tv" size="24px" color="#a855f7" />
                </div>
                <div>
                  <CardTitle className="text-xl">Cable TV Subscription</CardTitle>
                  <CardDescription>DSTV, GOTV, Startimes & more</CardDescription>
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
              {/* Provider Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Select Provider</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CABLE_PROVIDERS.map((provider) => (
                    <button
                      key={provider.value}
                      type="button"
                      onClick={() => { setSelectedProvider(provider.value as CableProvider); setSelectedPlan(""); setCustomerName(""); }}
                      className={`p-3 rounded-xl border-2 transition-smooth ${selectedProvider === provider.value ? "border-purple-500 bg-purple-500/10" : "border-border hover:border-purple-500/50"}`}
                    >
                      <div className="text-center">
                        <IonIcon name={provider.icon as "tv" | "play-circle"} size="24px" className={selectedProvider === provider.value ? "text-purple-500" : "text-muted-foreground"} />
                        <div className="font-semibold text-sm text-foreground mt-1">{provider.label}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Smart Card Number */}
              <div className="space-y-2">
                <Label htmlFor="smartcard" className="text-sm font-medium">Smart Card / IUC Number</Label>
                <div className="relative">
                  <IonIcon name="card-outline" size="18px" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="smartcard"
                    type="text"
                    placeholder="Enter smart card number"
                    value={smartCardNumber}
                    onChange={(e) => setSmartCardNumber(e.target.value)}
                    onBlur={verifySmartCard}
                    className="pl-10 bg-background border-border"
                    required
                  />
                  {isVerifying && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />}
                </div>
                {customerName && <p className="text-sm text-green-500 flex items-center gap-1"><IonIcon name="checkmark-circle" size="16px" /> {customerName}</p>}
              </div>

              {/* Plan Selection */}
              {selectedProvider && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Select Plan</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {availablePlans.map((plan) => (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setSelectedPlan(plan.id)}
                        className={`p-3 rounded-xl border-2 transition-smooth text-left ${selectedPlan === plan.id ? "border-purple-500 bg-purple-500/10" : "border-border hover:border-purple-500/50"}`}
                      >
                        <div className="font-semibold text-foreground">{plan.name}</div>
                        <div className="font-bold text-purple-500 mt-1">₦{plan.price.toLocaleString()}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary */}
              {selectedProvider && selectedPlanDetails && smartCardNumber && (
                <div className="bg-muted/50 p-4 rounded-xl space-y-2 text-sm">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <IonIcon name="receipt-outline" size="18px" color="#a855f7" /> Summary
                  </h3>
                  <div className="flex justify-between"><span className="text-muted-foreground">Provider</span><span className="font-medium">{selectedProvider.toUpperCase()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Smart Card</span><span className="font-medium">{smartCardNumber}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Plan</span><span className="font-medium">{selectedPlanDetails.name}</span></div>
                  <div className="border-t border-border pt-2 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-purple-500 text-lg">₦{selectedPlanDetails.price.toLocaleString()}</span>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold h-12" disabled={!selectedProvider || !smartCardNumber || !selectedPlan || isProcessing}>
                {isProcessing ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Processing...</> : <><IonIcon name="tv-outline" size="20px" className="mr-2" />Subscribe Now</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <CreatePinModal userId={user?.id || ""} isOpen={showCreatePin} onClose={() => setShowCreatePin(false)} onSuccess={onPinCreated} canSkip={false} />
      <VerifyPinModal userPin={userPin} isOpen={showVerifyPin} onClose={() => setShowVerifyPin(false)} onVerified={onPinVerified} title="Authorize Subscription" description={`Enter PIN to subscribe to ${selectedPlanDetails?.name || ""}`} />
    </div>
  );
}
