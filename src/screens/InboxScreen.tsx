import React from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { colors } from '../theme/tokens';
import { Card, EmptyNote, Loading, T } from '../components/ui';
import { getInbox, markInboxRead, markInboxReadAll } from '../api/meta';
import { thDateTime } from '../lib/format';
import { Nav } from '../navigation/types';

export default function InboxScreen() {
  const nav = useNavigation<Nav>();
  const qc = useQueryClient();
  const { data, isLoading, refetch, isRefetching } = useQuery({ queryKey: ['inbox'], queryFn: getInbox });
  const readAll = useMutation({
    mutationFn: markInboxReadAll,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inbox'] }),
  });

  const open = async (n: any) => {
    if (!n.read) {
      await markInboxRead(n.id);
      qc.invalidateQueries({ queryKey: ['inbox'] });
    }
    if (n.taskId) nav.navigate('TaskDetail', { id: n.taskId });
  };

  if (isLoading || !data) return <Loading />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.page }} edges={['top']}>
      <View style={styles.head}>
        <T w="bold" size={24} c={colors.textStrong}>แจ้งเตือน</T>
        {data.unread ? (
          <Pressable onPress={() => readAll.mutate()}>
            <T w="semibold" size={13} c={colors.forest700}>อ่านทั้งหมด</T>
          </Pressable>
        ) : null}
      </View>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingTop: 8 }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => { refetch(); }} tintColor={colors.forest700} />}
      >
        {data.items.length ? (
          data.items.map((n: any) => (
            <Pressable key={n.id} onPress={() => open(n)}>
              <Card style={[styles.item, !n.read && { backgroundColor: colors.forestTint }]}>
                <View style={[styles.dot, { backgroundColor: n.read ? colors.line300 : colors.forest700 }]} />
                <View style={{ flex: 1 }}>
                  <T w={n.read ? 'regular' : 'semibold'} size={15} c={colors.textStrong}>{n.title}</T>
                  {n.message ? <T size={13} c={colors.textBody}>{n.message}</T> : null}
                  <T size={12} c={colors.textMuted} style={{ marginTop: 2 }}>{thDateTime(n.createdAt)}</T>
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
  head: { padding: 20, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  item: { marginBottom: 12, flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  dot: { width: 12, height: 12, borderRadius: 6, marginTop: 5 },
});
