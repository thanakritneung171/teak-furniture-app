import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { colors, radius, stageColor } from '../theme/tokens';
import { Badge, Card, Loading, PrimaryButton, T } from '../components/ui';
import { getOrder } from '../api/orders';
import { thDate } from '../lib/format';
import { Nav, RootStackParamList } from '../navigation/types';

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, !last && { borderBottomWidth: 1, borderBottomColor: colors.line100 }]}>
      <T size={13} c={colors.textMuted}>{label}</T>
      <T size={14} w="medium" c={colors.textStrong}>{value}</T>
    </View>
  );
}

export default function OrderDetailScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<RouteProp<RootStackParamList, 'OrderDetail'>>();
  const { id } = route.params;
  const { data: o, isLoading } = useQuery({ queryKey: ['order', id], queryFn: () => getOrder(id) });
  if (isLoading || !o) return <Loading />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.page }} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <T w="bold" size={24} c={colors.textStrong}>{o.orderNumber}</T>
        {o.totalPrice ? (
          <T size={16} c={colors.forest700} w="semibold" style={{ marginTop: 2 }}>
            ฿{Number(o.totalPrice).toLocaleString('th-TH')}
          </T>
        ) : null}

        <Card style={{ marginTop: 16, paddingVertical: 0 }}>
          <InfoRow label="ลูกค้า" value={o.customer?.name ?? '—'} />
          <InfoRow label="เบอร์โทร" value={o.customer?.phone ?? '—'} />
          <InfoRow label="วันที่สั่ง" value={thDate(o.orderDate)} />
          <InfoRow label="กำหนดส่ง" value={thDate(o.dueDate)} />
          <InfoRow label="ที่อยู่จัดส่ง" value={o.shippingAddress ?? '—'} last />
        </Card>

        <View style={styles.secHead}>
          <T w="semibold" size={16} c={colors.textStrong}>สินค้าใน Order ({o.products.length})</T>
          <Pressable onPress={() => nav.navigate('AddProduct', { orderId: o.id, orderNumber: o.orderNumber })} style={styles.addBtn}>
            <T c={colors.gold300} w="semibold" size={13}>+ เพิ่มสินค้า</T>
          </Pressable>
        </View>

        {o.products.length ? (
          o.products.map((p: any) => {
            const task = p.tasks?.[0];
            return (
              <Card key={p.id} style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <T w="semibold" size={16} c={colors.textStrong}>{p.name}</T>
                    <T size={13} c={colors.textMuted}>จำนวน {p.quantity}{p.productType ? ` · ${p.productType}` : ''}</T>
                  </View>
                  {task ? <Badge label={task.currentStage.label} bg={stageColor[task.currentStage.code] ?? colors.forest700} /> : null}
                </View>
                {task ? (
                  <PrimaryButton
                    label="ดู Task"
                    onPress={() => nav.navigate('TaskDetail', { id: task.id })}
                    bg={colors.card}
                    fg={colors.forest700}
                    style={{ marginTop: 12, height: 42, borderWidth: 1, borderColor: colors.border }}
                  />
                ) : null}
              </Card>
            );
          })
        ) : (
          <T c={colors.textMuted} style={{ paddingVertical: 12 }}>ยังไม่มีสินค้าใน Order นี้</T>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 },
  secHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 12 },
  addBtn: { backgroundColor: colors.forest900, paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill },
});
