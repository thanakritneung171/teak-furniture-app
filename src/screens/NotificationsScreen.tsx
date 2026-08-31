import React from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { colors } from '../theme/tokens';
import { Card, EmptyNote, Loading, T } from '../components/ui';
import { getNotifications } from '../api/meta';
import { thDate } from '../lib/format';
import { Nav } from '../navigation/types';

export default function NotificationsScreen() {
  const nav = useNavigation<Nav>();
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
  });
  if (isLoading || !data) return <Loading />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.page }} edges={['top']}>
      <View style={{ padding: 20, paddingBottom: 8 }}>
        <T w="bold" size={24} c={colors.textStrong}>แจ้งเตือน</T>
      </View>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingTop: 8 }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => { refetch(); }} tintColor={colors.forest700} />}
      >
        {data.items.length ? (
          data.items.map((n: any, i: number) => (
            <Pressable key={i} onPress={() => nav.navigate('TaskDetail', { id: n.taskId })}>
              <Card style={{ marginBottom: 12, flexDirection: 'row', gap: 14, alignItems: 'flex-start' }}>
                <View style={[styles.dot, { backgroundColor: n.type === 'overdue' ? colors.danger : colors.warn }]} />
                <View style={{ flex: 1 }}>
                  <T w="semibold" size={15} c={colors.textStrong}>{n.title}</T>
                  <T size={13} c={colors.textBody}>{n.message}</T>
                  <T size={12} c={colors.textMuted} style={{ marginTop: 2 }}>
                    {n.orderNumber} · กำหนด {thDate(n.dueDate)}
                  </T>
                </View>
              </Card>
            </Pressable>
          ))
        ) : (
          <EmptyNote text="ไม่มีแจ้งเตือน 🎉" />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dot: { width: 12, height: 12, borderRadius: 6, marginTop: 5 },
});
