'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IonIcon } from "@/components/ion-icon";
import Link from "next/link";
import { toast } from "sonner";

type KYCLevel = 'none' | 'tier1' | 'tier2' | 'tier3' | 'tier4';

const KYC_TIERS = [
  {
    level: 'tier1',
    name: 'Tier 1',
    description: 'Basic verification',
    limit: '₦50,000/day',
    requirements: ['Full Name', 'Phone Number', 'Email'],
  },
  {
    level: 'tier2',
    name: 'Tier 2',
    description: 'NIN verification',
    limit: '₦200,000/day',
    requirements: ['NIN (National ID Number)', 'Date of Birth'],
  },
  {
    level: 'tier3',
    name: 'Tier 3',
    description: 'BVN verification',
    limit: '₦500,000/day',
    requirements: ['BVN (Bank Verification Number)', 'Address'],
  },
  {
    level: 'tier4',
    name: 'Tier 4',
    description: 'Full verification',
    limit: 'Unlimited',
    requirements: ['Valid ID Card Upload', 'Selfie Verification'],
  },
];

export default function KYCPage() {
  const [currentLevel, setCurrentLevel] = useState<KYCLevel>('tier1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nin: '',
    dob: '',
    bvn: '',
    address: '',
    idType: '',
  });

  const handleTier2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nin || !formData.dob) {
      toast.error("Please fill all required fields");
      return;
    }
    
    if (formData.nin.length !== 11) {
      toast.error("NIN must be 11 digits");
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("NIN verification submitted!", {
        description: "We'll verify your details within 24 hours"
      });
      setIsSubmitting(false);
      setCurrentLevel('tier2');
      setFormData({ ...formData, nin: '', dob: '' });
    }, 2000);
  };

  const handleTier3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bvn || !formData.address) {
      toast.error("Please fill all required fields");
      return;
    }
    
    if (formData.bvn.length !== 11) {
      toast.error("BVN must be 11 digits");
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("BVN verification submitted!", {
        description: "We'll verify your details within 24 hours"
      });
      setIsSubmitting(false);
      setCurrentLevel('tier3');
      setFormData({ ...formData, bvn: '', address: '' });
    }, 2000);
  };

  const getStatusColor = (level: string) => {
    const tierIndex = KYC_TIERS.findIndex(t => t.level === level);
    const currentIndex = KYC_TIERS.findIndex(t => t.level === currentLevel);
    
    if (tierIndex <= currentIndex) return 'text-green-500';
    return 'text-muted-foreground';
  };

  const getStatusIcon = (level: string) => {
    const tierIndex = KYC_TIERS.findIndex(t => t.level === level);
    const currentIndex = KYC_TIERS.findIndex(t => t.level === currentLevel);
    
    if (tierIndex <= currentIndex) return 'checkmark-circle';
    return 'ellipse-outline';
  };

  const getNextTier = () => {
    const currentIndex = KYC_TIERS.findIndex(t => t.level === currentLevel);
    return KYC_TIERS[currentIndex + 1]?.level || null;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/dashboard/settings" className="p-2 -ml-2 hover:bg-muted rounded-lg transition-smooth">
              <IonIcon name="arrow-back-outline" size="20px" />
            </Link>
            <h1 className="text-lg font-semibold text-foreground ml-2">KYC Verification</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-6 max-w-2xl space-y-6">
        {/* Current Status */}
        <Card className="border-border overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <IonIcon name="shield-checkmark" size="24px" color="white" />
              </div>
              <div>
                <p className="text-green-100 text-sm">Current Level</p>
                <h2 className="text-xl font-bold text-white">
                  {currentLevel === 'none' ? 'Not Verified' : KYC_TIERS.find(t => t.level === currentLevel)?.name}
                </h2>
              </div>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Daily Transaction Limit</span>
              <span className="font-semibold text-foreground">
                {KYC_TIERS.find(t => t.level === currentLevel)?.limit || '₦10,000/day'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* KYC Tiers */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Verification Levels</h2>
          
          {KYC_TIERS.map((tier, index) => {
            const isCompleted = KYC_TIERS.findIndex(t => t.level === currentLevel) >= index;
            const isCurrent = tier.level === currentLevel;
            const isNext = getNextTier() === tier.level;
            
            return (
              <Card 
                key={tier.level} 
                className={`border-border transition-smooth ${
                  isCurrent ? 'border-green-500/50 bg-green-500/5' : ''
                } ${isNext ? 'border-yellow-500/50' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      isCompleted ? 'bg-green-500/10' : 'bg-muted'
                    }`}>
                      <IonIcon 
                        name={getStatusIcon(tier.level)} 
                        size="24px" 
                        color={isCompleted ? '#22c55e' : undefined}
                        className={!isCompleted ? 'text-muted-foreground' : ''}
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{tier.name}</h3>
                          <p className="text-sm text-muted-foreground">{tier.description}</p>
                        </div>
                        <span className={`text-sm font-medium ${
                          isCompleted ? 'text-green-500' : isNext ? 'text-yellow-500' : 'text-muted-foreground'
                        }`}>
                          {isCompleted ? 'Completed' : isNext ? 'Next' : 'Locked'}
                        </span>
                      </div>
                      
                      <div className="mt-3 space-y-1">
                        <p className="text-xs text-muted-foreground font-medium">Requirements:</p>
                        <div className="flex flex-wrap gap-2">
                          {tier.requirements.map((req, i) => (
                            <span 
                              key={i} 
                              className={`text-xs px-2 py-1 rounded-full ${
                                isCompleted 
                                  ? 'bg-green-500/10 text-green-500' 
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-2 text-xs text-muted-foreground">
                        Limit: <span className="font-medium text-foreground">{tier.limit}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>


        {/* Tier 2 - NIN Verification */}
        {currentLevel === 'tier1' && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <IonIcon name="arrow-up-circle-outline" size="20px" color="#22c55e" />
                Upgrade to Tier 2
              </CardTitle>
              <CardDescription>Verify your NIN to increase your daily limit to ₦200,000</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTier2Submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nin" className="text-sm font-medium">NIN (National Identification Number)</Label>
                  <Input
                    id="nin"
                    type="text"
                    placeholder="Enter your 11-digit NIN"
                    value={formData.nin}
                    onChange={(e) => setFormData({ ...formData, nin: e.target.value.replace(/\D/g, '').slice(0, 11) })}
                    className="bg-background border-border font-mono"
                    maxLength={11}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Dial *346# on your phone to get your NIN</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dob" className="text-sm font-medium">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="bg-background border-border"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Must match the date on your NIN</p>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold h-11"
                  disabled={isSubmitting || formData.nin.length !== 11}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Verifying NIN...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <IonIcon name="shield-checkmark-outline" size="18px" />
                      Verify NIN
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Tier 3 - BVN Verification */}
        {currentLevel === 'tier2' && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <IonIcon name="arrow-up-circle-outline" size="20px" color="#22c55e" />
                Upgrade to Tier 3
              </CardTitle>
              <CardDescription>Add your BVN for higher limits up to ₦500,000/day</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTier3Submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bvn" className="text-sm font-medium">BVN (Bank Verification Number)</Label>
                  <Input
                    id="bvn"
                    type="text"
                    placeholder="Enter your 11-digit BVN"
                    value={formData.bvn}
                    onChange={(e) => setFormData({ ...formData, bvn: e.target.value.replace(/\D/g, '').slice(0, 11) })}
                    className="bg-background border-border font-mono"
                    maxLength={11}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Dial *565*0# to get your BVN</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">Residential Address</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Enter your full address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="bg-background border-border"
                    required
                  />
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <div className="flex gap-2">
                    <IonIcon name="lock-closed" size="18px" color="#3b82f6" className="shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-400">
                      Your BVN is securely encrypted and only used for verification. We never store or share your banking details.
                    </p>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold h-11"
                  disabled={isSubmitting || formData.bvn.length !== 11}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Verifying BVN...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <IonIcon name="shield-checkmark-outline" size="18px" />
                      Verify BVN
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Tier 4 - Full Verification */}
        {currentLevel === 'tier3' && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <IonIcon name="arrow-up-circle-outline" size="20px" color="#22c55e" />
                Upgrade to Tier 4
              </CardTitle>
              <CardDescription>Upload documents for unlimited transactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">ID Type</Label>
                <select 
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground"
                  value={formData.idType}
                  onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                >
                  <option value="">Select ID Type</option>
                  <option value="nin_slip">NIN Slip</option>
                  <option value="passport">International Passport</option>
                  <option value="drivers">Driver's License</option>
                  <option value="voters">Voter's Card</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Upload ID Document</Label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-green-500/50 transition-smooth cursor-pointer">
                  <IonIcon name="cloud-upload-outline" size="32px" className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Selfie with ID</Label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-green-500/50 transition-smooth cursor-pointer">
                  <IonIcon name="camera-outline" size="32px" className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Take a selfie holding your ID</p>
                </div>
              </div>
              
              <Button
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold h-11"
                onClick={() => toast.info("Document upload coming soon!")}
              >
                <IonIcon name="cloud-upload-outline" size="18px" className="mr-2" />
                Upload Documents
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Fully Verified */}
        {currentLevel === 'tier4' && (
          <Card className="border-green-500/50 bg-green-500/5">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <IonIcon name="checkmark-circle" size="40px" color="#22c55e" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Fully Verified!</h3>
              <p className="text-muted-foreground">
                Congratulations! You have unlimited transaction limits.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="border-border bg-blue-500/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <IonIcon name="information-circle" size="20px" color="#3b82f6" className="shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground mb-1">Why verify your account?</p>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Higher daily transaction limits</li>
                  <li>• Access to all features</li>
                  <li>• Faster withdrawals</li>
                  <li>• Enhanced account security</li>
                  <li>• Priority customer support</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
