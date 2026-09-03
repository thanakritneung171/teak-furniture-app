import { useEffect, useState } from 'react';
import { getSyncState, subscribeSync } from './sync';
import { isOnline as netOnline, onOnline } from './net';

// สถานะคิวออฟไลน์ (pending/syncing) สำหรับโชว์แบนเนอร์
export function useSyncState() {
  const [s, setS] = useState(getSyncState());
  useEffect(() => subscribeSync(setS), []);
  return s;
}

// ติดตามสถานะออนไลน์/ออฟไลน์แบบ reactive
export function useOnline(): boolean {
  const [online, setOnline] = useState(netOnline());
  useEffect(() => {
    const g: any = globalThis as any;
    const off = onOnline(() => setOnline(true));
    const goOffline = () => setOnline(false);
    if (typeof g.addEventListener === 'function') g.addEventListener('offline', goOffline);
    return () => {
      off();
      if (typeof g.removeEventListener === 'function') g.removeEventListener('offline', goOffline);
    };
  }, []);
  return online;
}
