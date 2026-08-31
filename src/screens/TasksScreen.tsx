import React, { useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { colors, radius } from '../theme/tokens';
import { EmptyNote, Loading, T } from '../components/ui';
import { TaskCardView } from '../components/TaskCard';
import { getTasks } from '../api/tasks';
import { useAuth } from '../store/auth';
import { isOverdue } from '../lib/format';
import { Nav } from '../navigation/types';

const FILTERS = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'waiting', label: 'รอทำ' },
  { key: 'inprogress', label: 'กำลังทำ' },
  { key: 'urgent', label: 'ด่วน' },
  { key: 'delayed', label: 'ล่าช้า' },
];

export default function TasksScreen() {
  const nav = useNavigation<Nav>();
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const stage = user?.role === 'WORKER' ? user.station?.code : undefined;

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['tasks', stage],
    queryFn: () => getTasks(stage ? { stage } : undefined),
  });

  const list = useMemo(() => {
    const tasks = data ?? [];
    switch (filter) {
      case 'waiting':
        return tasks.filter((t) => !t.running);
      case 'inprogress':
        return tasks.filter((t) => t.running);
      case 'urgent':
        return tasks.filter((t) => t.priority === 'URGENT');
      case 'delayed':
        return tasks.filter((t) => isOverdue(t.dueDate) && t.stage.code !== 'SHIPPED');
      default:
        return tasks;
    }
  }, [data, filter]);

  if (isLoading) return <Loading />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.page }} edges={['top']}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
        <T w="bold" size={24} c={colors.textStrong}>
          งานของฉัน
        </T>
      </View>
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {FILTERS.map((f) => (
            <Pressable
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[styles.chip, filter === f.key && styles.chipActive]}
            >
              <T
                size={13}
                w={filter === f.key ? 'semibold' : 'regular'}
                c={filter === f.key ? colors.white : colors.textBody}
              >
                {f.label}
              </T>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingTop: 8, paddingBottom: 40 }}
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
        {list.length ? (
          list.map((t) => (
            <TaskCardView key={t.id} task={t} onPress={() => nav.navigate('TaskDetail', { id: t.id })} />
          ))
        ) : (
          <EmptyNote text="ไม่มีงานในหมวดนี้" />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  filters: { paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.forest900, borderColor: colors.forest900 },
});
