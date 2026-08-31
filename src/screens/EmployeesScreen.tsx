import React from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { colors, radius } from '../theme/tokens';
import { Badge, Card, Loading, T } from '../components/ui';
import { getUsers } from '../api/meta';
import { Nav } from '../navigation/types';

const ROLE: Record<string, string> = { ADMIN: 'ผู้ดูแล', SUPERVISOR: 'หัวหน้า', WORKER: 'พนักงาน' };
const ROLE_BG: Record<string, string> = { ADMIN: '#8b5e3c', SUPERVISOR: '#2e4b45', WORKER: '#3f645c' };

export default function EmployeesScreen() {
  const nav = useNavigation<Nav>();
  const { data, isLoading, refetch, isRefetching } = useQuery({ queryKey: ['users'], queryFn: getUsers });
  if (isLoading || !data) return <Loading />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.page }} edges={['bottom']}>
      <View style={styles.head}>
        <T size={13} c={colors.textMuted}>{data.length} คน</T>
        <Pressable onPress={() => nav.navigate('CreateEmployee')} style={styles.addBtn}>
          <T c={colors.gold300} w="semibold" size={13}>+ เพิ่มพนักงาน</T>
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingTop: 8 }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => { refetch(); }} tintColor={colors.forest700} />}
      >
        {data.map((u: any) => (
          <Card key={u.id} style={{ marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={styles.avatar}>
              <T w="bold" size={18} c={colors.gold300}>{u.name?.[0] ?? '?'}</T>
            </View>
            <View style={{ flex: 1 }}>
              <T w="semibold" size={16} c={colors.textStrong}>{u.name}</T>
              <T size={13} c={colors.textMuted}>{u.phone}</T>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 4 }}>
              <Badge label={ROLE[u.role] ?? u.role} bg={ROLE_BG[u.role] ?? colors.forest700} />
              {u.station ? <T size={12} c={colors.textMuted}>{u.station.label}</T> : null}
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  head: { padding: 20, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  addBtn: { backgroundColor: colors.forest900, paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.forest900, alignItems: 'center', justifyContent: 'center' },
});
