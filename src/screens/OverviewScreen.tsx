import React from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { colors, radius, stageColor } from '../theme/tokens';
import { Card, Loading, PrimaryButton, T } from '../components/ui';
import { getNotifications, getOverview } from '../api/meta';
import { useAuth } from '../store/auth';
import { Nav } from '../navigation/types';

function Kpi({ n, label, color }: { n: number; label: string; color: string }) {
  return (
    <View style={styles.kpi}>
      <T w="bold" size={30} c={color}>{n}</T>
      <T size={12} c={colors.textMuted}>{label}</T>
    </View>
  );
}

export default function OverviewScreen() {
  const nav = useNavigation<Nav>();
  const { user } = useAuth();
  const { data, isLoading, refetch, isRefetching } = useQuery({ queryKey: ['overview'], queryFn: getOverview });
  const { data: nt } = useQuery({ queryKey: ['notifications'], queryFn: getNotifications });
  if (isLoading || !data) return <Loading />;
  const max = Math.max(...data.byStage.map((s: any) => s.count), 1);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.page }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => { refetch(); }} tintColor={colors.forest700} />}
      >
        <View style={styles.head}>
          <View>
            <T size={13} c={colors.textMuted}>ภาพรวมการผลิต</T>
            <T w="bold" size={26} c={colors.textStrong}>Production Overview</T>
          </View>
          <Pressable onPress={() => nav.navigate('Notifications')} style={styles.bell}>
            <T size={20}>🔔</T>
            {nt?.count ? (
              <View style={styles.badge}>
                <T size={10} c={colors.white} w="semibold">{nt.count}</T>
              </View>
            ) : null}
          </Pressable>
        </View>

        <View style={styles.grid}>
          <Kpi n={data.total} label="งานทั้งหมด" color={colors.textStrong} />
          <Kpi n={data.inProduction} label="กำลังผลิต" color={colors.forest700} />
          <Kpi n={data.delayed} label="ล่าช้า" color={colors.danger} />
          <Kpi n={data.unassigned} label="ไม่มีผู้รับผิดชอบ" color={colors.warn} />
        </View>

        <T w="semibold" size={16} c={colors.textStrong} style={{ marginTop: 24, marginBottom: 12 }}>
          จำนวนงานตามสถานะ
        </T>
        <Card>
          {data.byStage.map((s: any) => (
            <View key={s.code} style={styles.barRow}>
              <T size={13} c={colors.textBody} style={{ width: 78 }}>{s.label}</T>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${(s.count / max) * 100}%`, backgroundColor: stageColor[s.code] ?? colors.forest700 }]} />
              </View>
              <T size={14} w="semibold" c={colors.textStrong} style={{ width: 28, textAlign: 'right' }}>{s.count}</T>
            </View>
          ))}
        </Card>

        {user?.role === 'ADMIN' ? (
          <PrimaryButton
            label="จัดการพนักงาน"
            onPress={() => nav.navigate('Employees')}
            bg={colors.card}
            fg={colors.forest700}
            style={{ marginTop: 20, borderWidth: 1, borderColor: colors.border }}
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  bell: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 4, right: 4, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 20 },
  kpi: { width: '47%', flexGrow: 1, backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 18 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  track: { flex: 1, height: 12, borderRadius: 6, backgroundColor: colors.line200, overflow: 'hidden' },
  fill: { height: 12, borderRadius: 6, minWidth: 6 },
});
