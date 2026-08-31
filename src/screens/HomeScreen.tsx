import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { colors, radius } from '../theme/tokens';
import { EmptyNote, Loading, T } from '../components/ui';
import { TaskCardView } from '../components/TaskCard';
import { getMyWork } from '../api/tasks';
import { useAuth } from '../store/auth';
import { Nav } from '../navigation/types';

function Count({ n, label, color }: { n: number; label: string; color: string }) {
  return (
    <View style={styles.count}>
      <T w="bold" size={28} c={color}>
        {n}
      </T>
      <T size={12} c={colors.textMuted}>
        {label}
      </T>
    </View>
  );
}

export default function HomeScreen() {
  const nav = useNavigation<Nav>();
  const { user } = useAuth();
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['my-work'],
    queryFn: getMyWork,
  });

  if (isLoading || !data) return <Loading />;
  const open = (id: string) => nav.navigate('TaskDetail', { id });
  const todo = data.waiting.filter((t) => t.priority !== 'URGENT');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.page }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => {
              refetch();
            }}
            tintColor={colors.forest700}
          />
        }
      >
        <T size={13} c={colors.textMuted}>
          สวัสดี
        </T>
        <T w="bold" size={26} c={colors.textStrong}>
          {user?.name}
        </T>
        <T size={13} c={colors.textMuted} style={{ marginTop: 2 }}>
          {user?.station
            ? `แผนก${user.station.label}`
            : user?.role === 'ADMIN'
              ? 'ผู้ดูแลระบบ'
              : 'หัวหน้าฝ่ายผลิต'}
        </T>

        <View style={styles.counts}>
          <Count n={data.counts.inProgress} label="กำลังทำ" color={colors.forest700} />
          <Count n={data.counts.waiting} label="รอทำ" color={colors.warn} />
          <Count n={data.counts.done} label="เสร็จวันนี้" color={colors.success} />
        </View>

        {data.urgent.length > 0 && (
          <>
            <T w="semibold" size={16} c={colors.danger} style={styles.section}>
              🔴 งานด่วน
            </T>
            {data.urgent.map((t) => (
              <TaskCardView key={t.id} task={t} onPress={() => open(t.id)} />
            ))}
          </>
        )}

        {data.inProgress.length > 0 && (
          <>
            <T w="semibold" size={16} c={colors.textStrong} style={styles.section}>
              กำลังทำ
            </T>
            {data.inProgress.map((t) => (
              <TaskCardView key={t.id} task={t} onPress={() => open(t.id)} />
            ))}
          </>
        )}

        <T w="semibold" size={16} c={colors.textStrong} style={styles.section}>
          งานที่ต้องทำ
        </T>
        {todo.length ? (
          todo.map((t) => <TaskCardView key={t.id} task={t} onPress={() => open(t.id)} />)
        ) : (
          <EmptyNote text="ไม่มีงานรอทำ" />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  counts: { flexDirection: 'row', gap: 12, marginTop: 20, marginBottom: 8 },
  count: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
    alignItems: 'center',
  },
  section: { marginTop: 22, marginBottom: 12 },
});
