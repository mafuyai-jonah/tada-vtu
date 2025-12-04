'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IonIcon } from "@/components/ion-icon";
import Link from "next/link";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'promo';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Data Purchase Successful',
    message: '2GB MTN data has been sent to 08012345678',
    time: '2 minutes ago',
    read: false,
  },
  {
    id: '2',
    type: 'success',
    title: 'Wallet Funded',
    message: 'Your wallet has been credited with ₦5,000',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    type: 'promo',
    title: '🎉 Special Offer!',
    message: 'Get 10% bonus on all data purchases this weekend. Use code: WEEKEND10',
    time: '3 hours ago',
    read: false,
  },
  {
    id: '4',
    type: 'info',
    title: 'New Feature Available',
    message: 'You can now pay electricity bills directly from your wallet',
    time: 'Yesterday',
    read: true,
  },
  {
    id: '5',
    type: 'warning',
    title: 'Low Wallet Balance',
    message: 'Your wallet balance is below ₦500. Fund now to continue enjoying our services.',
    time: 'Yesterday',
    read: true,
  },
  {
    id: '6',
    type: 'success',
    title: 'Airtime Purchase Successful',
    message: '₦500 airtime sent to 08098765432',
    time: '2 days ago',
    read: true,
  },
  {
    id: '7',
    type: 'info',
    title: 'Referral Bonus',
    message: 'You earned ₦100 from your referral. Keep sharing!',
    time: '3 days ago',
    read: true,
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'success':
      return { name: 'checkmark-circle', color: '#22c55e', bg: 'bg-green-500/10' };
    case 'warning':
      return { name: 'warning', color: '#eab308', bg: 'bg-yellow-500/10' };
    case 'promo':
      return { name: 'gift', color: '#a855f7', bg: 'bg-purple-500/10' };
    default:
      return { name: 'information-circle', color: '#3b82f6', bg: 'bg-blue-500/10' };
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read) 
    : notifications;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success("Notification deleted");
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="p-2 -ml-2 hover:bg-muted rounded-lg transition-smooth">
                <IonIcon name="arrow-back-outline" size="20px" />
              </Link>
              <h1 className="text-lg font-semibold text-foreground ml-2">Notifications</h1>
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-green-500 text-white text-xs font-semibold rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            {notifications.length > 0 && (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                  className="text-green-500 hover:text-green-400 hover:bg-green-500/10"
                >
                  <IonIcon name="checkmark-done-outline" size="18px" className="mr-1" />
                  Mark all read
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-6 max-w-2xl">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
              filter === 'all'
                ? 'bg-green-500 text-white'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
              filter === 'unread'
                ? 'bg-green-500 text-white'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>


        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <Card className="border-border">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <IonIcon name="notifications-off-outline" size="32px" className="text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">No notifications</h3>
              <p className="text-sm text-muted-foreground">
                {filter === 'unread' ? "You're all caught up!" : "You don't have any notifications yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map((notification) => {
              const iconConfig = getNotificationIcon(notification.type);
              
              return (
                <Card 
                  key={notification.id} 
                  className={`border-border transition-smooth hover:border-green-500/30 ${
                    !notification.read ? 'bg-green-500/5 border-green-500/20' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className={`w-10 h-10 ${iconConfig.bg} rounded-xl flex items-center justify-center shrink-0`}>
                        <IonIcon name={iconConfig.name} size="20px" color={iconConfig.color} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-foreground text-sm truncate">
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-green-500 rounded-full shrink-0"></span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {notification.time}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-1 shrink-0">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-green-500/10"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <IonIcon name="checkmark-outline" size="16px" color="#22c55e" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-red-500/10"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <IonIcon name="trash-outline" size="16px" color="#ef4444" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Clear All Button */}
        {notifications.length > 0 && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={clearAll}
              className="border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-500"
            >
              <IonIcon name="trash-outline" size="18px" className="mr-2" />
              Clear All Notifications
            </Button>
          </div>
        )}

        {/* Notification Settings Link */}
        <Card className="border-border mt-6">
          <CardContent className="p-4">
            <Link 
              href="/dashboard/settings" 
              className="flex items-center justify-between hover:bg-muted/50 -m-4 p-4 rounded-xl transition-smooth"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                  <IonIcon name="settings-outline" size="20px" className="text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Notification Settings</p>
                  <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
                </div>
              </div>
              <IonIcon name="chevron-forward-outline" size="20px" className="text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
