import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './src/store/auth';
import RootNavigator from './src/navigation/RootNavigator';
import { initSync, subscribeSync } from './src/offline/sync';

const queryClient = new QueryClient({
  // refetchOnReconnect: false — กันการ refetch ชนกับการ flush คิวตอนกลับมาออนไลน์
  // (เราจะ refetch เองหลังคิวซิงค์เสร็จ ผ่าน lastSyncAt ด้านล่าง)
  defaultOptions: { queries: { retry: 1, staleTime: 5000, refetchOnReconnect: false } },
});

export default function App() {
  // ตั้งตัวซิงค์งานออฟไลน์ (กลับมาออนไลน์แล้วส่งคิวที่ค้าง)
  useEffect(() => initSync(), []);

  // เมื่อคิวออฟไลน์ซิงค์เสร็จ → ดึงข้อมูลจริงจากเซิร์ฟเวอร์มาแทนสถานะ optimistic
  useEffect(() => {
    let last = 0;
    return subscribeSync((s) => {
      if (s.lastSyncAt && s.lastSyncAt !== last) {
        last = s.lastSyncAt;
        queryClient.invalidateQueries();
      }
    });
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StatusBar barStyle="dark-content" />
          <RootNavigator />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
