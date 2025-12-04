'use client';

import { useState, useEffect } from 'react';
import { GREETING_MESSAGES } from '@/lib/constants';

export function useGreeting() {
  const [greeting, setGreeting] = useState(GREETING_MESSAGES[0]);

  useEffect(() => {
    // Rotate greeting every 5 seconds
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * GREETING_MESSAGES.length);
      setGreeting(GREETING_MESSAGES[randomIndex]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return greeting;
}

export function getTimeBasedGreeting(name?: string) {
  const hour = new Date().getHours();
  let timeGreeting = 'Good evening';
  
  if (hour < 12) {
    timeGreeting = 'Good morning';
  } else if (hour < 18) {
    timeGreeting = 'Good afternoon';
  }

  return name ? `${timeGreeting}, ${name}!` : timeGreeting;
}
