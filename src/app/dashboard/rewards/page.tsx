'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { IonIcon } from '@/components/ion-icon';
import Link from 'next/link';
import { toast } from 'sonner';

export default function RewardsPage() {
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  const handleJoinBeta = async () => {
    setIsJoining(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setHasJoined(true);
    setIsJoining(false);
    toast.success("You're on the list! 🎉", {
      description: "We'll notify you when Watch & Earn launches.",
    });
  };

  const features = [
    {
      icon: 'play-circle',
      title: 'Watch Short Ads',
      description: '15-30 second clips from top brands',
      color: '#f59e0b',
    },
    {
      icon: 'star',
      title: 'Earn Tada Points',
      description: 'Up to 50 points per video watched',
      color: '#8b5cf6',
    },
    {
      icon: 'gift',
      title: 'Redeem Instantly',
      description: 'Convert points to Airtime or Data',
      color: '#22c55e',
    },
  ];

  const levels = [
    { level: 1, name: 'Starter', points: '0', perks: '1x rewards' },
    { level: 10, name: 'Bronze', points: '1,000', perks: '1.2x rewards' },
    { level: 25, name: 'Silver', points: '5,000', perks: '1.5x rewards' },
    { level: 50, name: 'Gold', points: '15,000', perks: '2x rewards + VIP' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/dashboard" className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors">
              <IonIcon name="arrow-back-outline" size="20px" />
            </Link>
            <h1 className="text-lg font-semibold text-foreground ml-2">Rewards</h1>
            <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full">
              BETA
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-6 max-w-3xl space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 p-8 text-white">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <IonIcon name="play" size="28px" color="white" />
              </div>
              <div className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium">
                Watch & Earn
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              Stop Paying Full Price
            </h1>
            <p className="text-lg text-white/90 mb-6 max-w-md">
              Turn your screen time into airtime. Watch short ads, earn points, get free data.
            </p>
            
            <div className="flex flex-wrap gap-4">
              {hasJoined ? (
                <Button 
                  size="lg" 
                  className="bg-white text-orange-600 hover:bg-white/90 font-bold gap-2"
                  disabled
                >
                  <IonIcon name="checkmark-circle" size="20px" />
                  You're on the List!
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  className="bg-white text-orange-600 hover:bg-white/90 font-bold gap-2"
                  onClick={handleJoinBeta}
                  disabled={isJoining}
                >
                  {isJoining ? (
                    <>
                      <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <IonIcon name="rocket" size="20px" />
                      Get Early Access
                    </>
                  )}
                </Button>
              )}
              <div className="flex items-center gap-2 text-white/80">
                <IonIcon name="people" size="18px" />
                <span className="text-sm">2,847 users waiting</span>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <Card key={index} className="border-border hover:border-green-500/50 transition-colors">
                <CardContent className="p-5">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <IonIcon name={feature.icon} size="24px" color={feature.color} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Earnings Calculator */}
        <Card className="border-border bg-gradient-to-br from-green-500/5 to-emerald-500/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                <IonIcon name="calculator" size="20px" color="#22c55e" />
              </div>
              <h3 className="font-semibold text-foreground">Potential Earnings</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-card rounded-xl border border-border">
                <p className="text-2xl font-bold text-foreground">5</p>
                <p className="text-xs text-muted-foreground">Videos/Day</p>
              </div>
              <div className="p-4 bg-card rounded-xl border border-border">
                <p className="text-2xl font-bold text-green-500">₦150</p>
                <p className="text-xs text-muted-foreground">Daily Earnings</p>
              </div>
              <div className="p-4 bg-card rounded-xl border border-border">
                <p className="text-2xl font-bold text-green-500">₦4,500</p>
                <p className="text-xs text-muted-foreground">Monthly</p>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground text-center mt-4">
              *Based on watching 5 ads daily at 30 points each
            </p>
          </CardContent>
        </Card>

        {/* Level System Preview */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Level Up System</h2>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Preview</span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {levels.map((level, index) => (
              <Card 
                key={index} 
                className={`border-border relative overflow-hidden ${
                  index === 3 ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30' : ''
                }`}
              >
                {index === 3 && (
                  <div className="absolute top-2 right-2">
                    <IonIcon name="diamond" size="16px" color="#f59e0b" />
                  </div>
                )}
                <CardContent className="p-4 text-center">
                  <div className={`w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-gray-200 dark:bg-gray-700' :
                    index === 1 ? 'bg-amber-700/20' :
                    index === 2 ? 'bg-gray-300 dark:bg-gray-600' :
                    'bg-gradient-to-br from-amber-400 to-orange-500'
                  }`}>
                    <span className={`font-bold text-sm ${index === 3 ? 'text-white' : 'text-foreground'}`}>
                      {level.level}
                    </span>
                  </div>
                  <p className="font-semibold text-foreground text-sm">{level.name}</p>
                  <p className="text-xs text-muted-foreground">{level.points} pts</p>
                  <p className="text-xs text-green-500 font-medium mt-1">{level.perks}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <Card className="border-border">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <IonIcon name="help-circle" size="20px" color="#22c55e" />
              Frequently Asked Questions
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="font-medium text-foreground text-sm">When does Watch & Earn launch?</p>
                <p className="text-sm text-muted-foreground mt-1">
                  We're targeting Q1 2025. Early access users will be notified first!
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">How many ads can I watch per day?</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Up to 10 ads daily, with bonus opportunities on weekends.
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">What's the minimum withdrawal?</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Just 500 points (₦50 equivalent). No waiting, instant redemption.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom CTA */}
        <div className="text-center pb-8">
          <p className="text-muted-foreground mb-4">
            Don't miss out on free data. Join the waitlist now.
          </p>
          {!hasJoined && (
            <Button 
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold"
              onClick={handleJoinBeta}
              disabled={isJoining}
            >
              <IonIcon name="notifications" size="18px" className="mr-2" />
              Notify Me When It Launches
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
