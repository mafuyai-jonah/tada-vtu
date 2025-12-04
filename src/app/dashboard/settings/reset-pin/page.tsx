'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IonIcon } from '@/components/ion-icon';
import Link from 'next/link';
import { toast } from 'sonner';
import { getSupabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export default function ResetPinPage() {
  const { user, profile, refreshProfile } = useAuth();
  const [step, setStep] = useState<'request' | 'verify' | 'newpin'>('request');
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  const handleRequestReset = async () => {
    setIsLoading(true);
    try {
      // Generate a 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otpCode);
      
      // In production, send this via email using Supabase Edge Functions or a backend
      // For now, we'll show it in a toast (demo purposes only!)
      console.log('OTP Code:', otpCode);
      
      // Simulate sending email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Verification code sent!', {
        description: `Check your email: ${profile?.email}`,
      });
      
      // For demo: show the OTP (remove in production!)
      toast.info(`Demo OTP: ${otpCode}`, { duration: 10000 });
      
      setStep('verify');
    } catch (error) {
      console.error('Error requesting reset:', error);
      toast.error('Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      setStep('newpin');
      toast.success('Code verified!');
    } else {
      toast.error('Invalid verification code');
    }
  };

  const handleSetNewPin = async () => {
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      toast.error('PIN must be 4 digits');
      return;
    }

    if (newPin !== confirmPin) {
      toast.error('PINs do not match');
      return;
    }

    if (!user?.id) {
      toast.error('User not found. Please login again.');
      return;
    }

    setIsLoading(true);
    try {
      const supabase = getSupabase();
      // Use same hash function as other PIN pages
      const hashedPin = btoa(newPin + 'tada_salt_2024');
      
      const { error } = await supabase
        .from('profiles')
        .update({ pin: hashedPin })
        .eq('id', user.id);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      await refreshProfile();
      toast.success('PIN reset successfully!');
      
      // Small delay before redirect to show success message
      setTimeout(() => {
        window.location.href = '/dashboard/settings';
      }, 1000);
    } catch (error) {
      console.error('Error resetting PIN:', error);
      toast.error('Failed to reset PIN. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/dashboard/settings" className="p-2 -ml-2 hover:bg-muted rounded-lg">
              <IonIcon name="arrow-back-outline" size="20px" />
            </Link>
            <h1 className="text-lg font-semibold text-foreground ml-2">Reset Transaction PIN</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-6 max-w-md">
        {step === 'request' && (
          <Card className="border-border">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <IonIcon name="key-outline" size="32px" color="#eab308" />
              </div>
              <CardTitle>Forgot Your PIN?</CardTitle>
              <CardDescription>
                We'll send a verification code to your email to reset your PIN
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{profile?.email}</p>
              </div>
              <Button
                onClick={handleRequestReset}
                disabled={isLoading}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                {isLoading ? 'Sending...' : 'Send Verification Code'}
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'verify' && (
          <Card className="border-border">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <IonIcon name="mail-outline" size="32px" color="#3b82f6" />
              </div>
              <CardTitle>Enter Verification Code</CardTitle>
              <CardDescription>
                Enter the 6-digit code sent to {profile?.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="text-center text-2xl tracking-widest"
              />
              <Button
                onClick={handleVerifyOtp}
                disabled={otp.length !== 6}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                Verify Code
              </Button>
              <Button variant="ghost" onClick={() => setStep('request')} className="w-full">
                Resend Code
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'newpin' && (
          <Card className="border-border">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <IonIcon name="lock-closed" size="32px" color="#22c55e" />
              </div>
              <CardTitle>Set New PIN</CardTitle>
              <CardDescription>
                Create a new 4-digit transaction PIN
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>New PIN</Label>
                <Input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="••••"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  className="text-center text-2xl tracking-widest"
                />
              </div>
              <div className="space-y-2">
                <Label>Confirm PIN</Label>
                <Input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="••••"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  className="text-center text-2xl tracking-widest"
                />
              </div>
              <Button
                onClick={handleSetNewPin}
                disabled={isLoading || newPin.length !== 4 || confirmPin.length !== 4}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                {isLoading ? 'Saving...' : 'Set New PIN'}
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
