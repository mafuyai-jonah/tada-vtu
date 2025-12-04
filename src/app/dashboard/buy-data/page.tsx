"use client";

import { useState } from "react";
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
import { NETWORKS, DATA_PLANS } from "@/lib/constants";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { useTransactionPin } from "@/hooks/useTransactionPin";
import { CreatePinModal } from "@/components/create-pin-modal";
import { VerifyPinModal } from "@/components/verify-pin-modal";
import type { NetworkProvider } from "@/types";

const DATA_TYPES = [
  { value: "sme", label: "SME", description: "Cheapest rates" },
  { value: "gifting", label: "Gifting", description: "Standard data" },
  { value: "corporate", label: "Corporate", description: "Business plans" },
];

export default function BuyDataPage() {
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

  const [selectedNetwork, setSelectedNetwork] = useState<NetworkProvider | "">(
    "",
  );
  const [selectedType, setSelectedType] = useState("sme");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const availablePlans = selectedNetwork
    ? DATA_PLANS[selectedNetwork as NetworkProvider]?.filter(
        (plan) => plan.type === selectedType,
      ) || []
    : [];
  const selectedPlanDetails = availablePlans.find(
    (plan) => plan.id === selectedPlan,
  );

  // Execute the actual purchase after PIN verification
  const executePurchase = async () => {
    if (!selectedPlanDetails) return;

    setIsProcessing(true);

    try {
      const response = await fetch("/api/inlomax/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          network: selectedNetwork,
          phone: phoneNumber,
          planId: selectedPlan,
          type: selectedType,
          amount: selectedPlanDetails.price,
          planName: selectedPlanDetails.size,
          userId: user?.id,
        }),
      });

      const result = await response.json();

      if (result.status) {
        // Refresh user data to get updated balance
        await refreshUser();
        toast.success("Data purchase successful!", {
          description: `${selectedPlanDetails.size} ${selectedNetwork} data sent to ${phoneNumber}`,
        });
        setPhoneNumber("");
        setSelectedPlan("");
        setSelectedNetwork("");
      } else {
        toast.error(result.message || "Purchase failed");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.error("Purchase error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedNetwork ||
      !phoneNumber ||
      !selectedPlan ||
      !selectedPlanDetails
    ) {
      toast.error("Please fill all fields");
      return;
    }

    // Check wallet balance
    if (!user || (user.balance || 0) < selectedPlanDetails.price) {
      toast.error("Insufficient balance", {
        description: `You need ₦${selectedPlanDetails.price.toLocaleString()} but have ₦${(user?.balance || 0).toLocaleString()}`,
      });
      return;
    }

    // Require PIN verification before purchase
    requirePin(executePurchase);
  };

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
              Buy Data
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-6 max-w-2xl">
        <Card className="border-border">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <IonIcon name="wifi" size="24px" color="#22c55e" />
                </div>
                <div>
                  <CardTitle className="text-xl">Buy Data</CardTitle>
                  <CardDescription>
                    Affordable data plans for all networks
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
            {/* Service Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl mb-6">
              <Link
                href="/dashboard/buy-airtime"
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-muted-foreground hover:text-foreground transition-all"
              >
                <IonIcon name="call-outline" size="18px" />
                Airtime
              </Link>
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-background text-foreground shadow-sm font-medium transition-all cursor-default"
              >
                <IonIcon name="wifi" size="18px" className="text-green-500" />
                Data
              </button>
            </div>

            <form onSubmit={handlePurchase} className="space-y-6">
              {/* Network Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Select Network</Label>
                <div className="grid grid-cols-4 gap-2">
                  {NETWORKS.map((network) => (
                    <button
                      key={network.value}
                      type="button"
                      onClick={() => {
                        setSelectedNetwork(network.value as NetworkProvider);
                        setSelectedPlan("");
                      }}
                      className={`p-3 rounded-xl border-2 transition-smooth ${
                        selectedNetwork === network.value
                          ? "border-green-500 bg-green-500/10"
                          : "border-border hover:border-green-500/50"
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-semibold text-sm text-foreground">
                          {network.label}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Type Selection */}
              {selectedNetwork && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Select Type</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {DATA_TYPES.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => {
                          setSelectedType(type.value);
                          setSelectedPlan("");
                        }}
                        className={`p-3 rounded-xl border-2 transition-smooth ${
                          selectedType === type.value
                            ? "border-green-500 bg-green-500/10"
                            : "border-border hover:border-green-500/50"
                        }`}
                      >
                        <div className="text-center">
                          <div className="font-semibold text-sm text-foreground">
                            {type.label}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {type.description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </Label>
                <div className="relative">
                  <IonIcon
                    name="call-outline"
                    size="18px"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="08012345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10 bg-background border-border"
                    required
                  />
                </div>
              </div>

              {/* Data Plans */}
              {selectedNetwork && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Select Data Plan
                  </Label>
                  {availablePlans.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <IonIcon
                        name="cloud-offline-outline"
                        size="32px"
                        className="mx-auto mb-2"
                      />
                      <p>
                        No {selectedType} plans available for {selectedNetwork}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {availablePlans.map((plan) => (
                        <button
                          key={plan.id}
                          type="button"
                          onClick={() => setSelectedPlan(plan.id)}
                          className={`p-3 rounded-xl border-2 transition-smooth text-left relative ${
                            selectedPlan === plan.id
                              ? "border-green-500 bg-green-500/10"
                              : "border-border hover:border-green-500/50"
                          }`}
                        >
                          {selectedPlan === plan.id && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <IonIcon
                                name="checkmark"
                                size="12px"
                                color="white"
                              />
                            </div>
                          )}
                          <div className="font-bold text-foreground">
                            {plan.size}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {plan.validity}
                          </div>
                          <div className="font-semibold text-green-500 mt-1">
                            ₦{plan.price}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Summary */}
              {selectedNetwork && selectedPlanDetails && phoneNumber && (
                <div className="bg-muted/50 p-4 rounded-xl space-y-3">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <IonIcon
                      name="receipt-outline"
                      size="18px"
                      color="#22c55e"
                    />
                    Purchase Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Network</span>
                      <span className="font-medium text-foreground">
                        {selectedNetwork}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <span className="font-medium text-foreground capitalize">
                        {selectedType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Phone Number
                      </span>
                      <span className="font-medium text-foreground">
                        {phoneNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Data Plan</span>
                      <span className="font-medium text-foreground">
                        {selectedPlanDetails.size}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Validity</span>
                      <span className="font-medium text-foreground">
                        {selectedPlanDetails.validity}
                      </span>
                    </div>
                    <div className="border-t border-border pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-foreground">
                          Total
                        </span>
                        <span className="font-bold text-green-500 text-lg">
                          ₦{selectedPlanDetails.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold h-12 transition-smooth"
                disabled={
                  !selectedNetwork ||
                  !phoneNumber ||
                  !selectedPlan ||
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
                    <IonIcon name="cart-outline" size="20px" />
                    Buy Data
                  </div>
                )}
              </Button>

              {/* Save Beneficiary */}
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-border bg-background"
                />
                Save as beneficiary for quick access
              </label>
            </form>
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
        title="Authorize Purchase"
        description={`Enter PIN to buy ${selectedPlanDetails?.size || ""} ${selectedNetwork} data`}
      />
    </div>
  );
}
