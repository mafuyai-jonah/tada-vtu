'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <Skeleton className="w-16 h-6 hidden sm:block" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <Skeleton className="w-10 h-10 rounded-lg" />
              <Skeleton className="w-10 h-10 rounded-full" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Greeting Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-48" />
        </div>

        {/* Wallet Card Skeleton */}
        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-0">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32 bg-green-500/20" />
                <Skeleton className="h-10 w-48 bg-green-500/20" />
              </div>
              <Skeleton className="w-12 h-12 rounded-xl bg-green-500/20" />
            </div>
            <div className="flex gap-3 mt-6">
              <Skeleton className="h-9 w-28 bg-white/20" />
              <Skeleton className="h-9 w-28 bg-white/10" />
            </div>
          </CardContent>
        </Card>

        {/* Services Skeleton */}
        <div className="space-y-4">
          <div className="flex justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="border-border">
                <CardContent className="p-4 flex flex-col items-center">
                  <Skeleton className="w-12 h-12 rounded-xl mb-3" />
                  <Skeleton className="h-4 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export function TransactionsSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between py-3 px-3">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-5 w-20" />
        </div>
      ))}
    </div>
  );
}
