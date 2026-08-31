import React from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { colors, radius } from '../theme/tokens';
import { Card, EmptyNote, Loading, T } from '../components/ui';
import { getOrders } from '../api/orders';
import { thDate } from '../lib/format';
import { Nav } from '../navigation/types';

export default function OrdersScreen() {
  const nav = useNavigation<Nav>();
  const { data, isLoading, refetch, isRefetching } = useQuery({ queryKey: ['orders'], queryFn: getOrders });
  if (isLoading) return <Loading />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.page }} edges={['top']}>
      <View style={styles.head}>
        <T w="bold" size={24} c={colors.textStrong}>
          ออเดอร์
        </T>
        <Pressable onPress={() => nav.navigate('CreateOrder')} style={styles.addBtn}>
          <T c={colors.gold300} w="semibold" size={13}>
            + สร้างออเดอร์
          </T>
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingTop: 8 }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => { refetch(); }} tintColor={colors.forest700} />
        }
      >
        {data && data.length ? (
          data.map((o: any) => (
            <Pressable key={o.id} onPress={() => nav.navigate('OrderDetail', { id: o.id })}>
              <Card style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <T w="semibold" size={16} c={colors.textStrong}>
                    {o.orderNumber}
                  </T>
                  <T size={14} c={colors.forest700} w="semibold">
                    {o.totalPrice ? `฿${Number(o.totalPrice).toLocaleString('th-TH')}` : ''}
                  </T>
                </View>
                <T size={13} c={colors.textMuted}>
                  {o.customer?.name ?? '—'} · {o.products.length} รายการ
                </T>
                <View style={styles.foot}>
                  <T size={12} c={colors.textMuted}>
                    สินค้า {o.products.reduce((a: number, p: any) => a + p.quantity, 0)} ชิ้น
                  </T>
                  <T size={12} c={colors.textMuted}>
                    กำหนดส่ง {thDate(o.dueDate)}
                  </T>
                </View>
              </Card>
            </Pressable>
          ))
        ) : (
          <EmptyNote text="ยังไม่มีออเดอร์" />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  head: {
    padding: 20,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addBtn: {
    backgroundColor: colors.forest900,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  foot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.line100,
  },
});
