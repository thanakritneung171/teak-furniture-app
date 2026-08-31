import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { colors } from '../theme/tokens';
import { EmptyNote, Loading, T } from '../components/ui';
import { getHistory } from '../api/tasks';
import { thDateTime } from '../lib/format';
import { RootStackParamList } from '../navigation/types';

const ACTION_LABEL: Record<string, string> = {
  CREATE: 'สร้างงาน',
  STATUS_CHANGE: 'เปลี่ยนสถานะ',
  TIMER_START: 'เริ่มจับเวลา',
  TIMER_STOP: 'หยุดจับเวลา',
  ASSIGN: 'มอบหมายงาน',
  NOTE: 'หมายเหตุ',
};

export default function HistoryScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'History'>>();
  const { id } = route.params;
  const { data, isLoading } = useQuery({ queryKey: ['history', id], queryFn: () => getHistory(id) });
  if (isLoading) return <Loading />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.page }} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {data && data.length ? (
          data.map((h) => (
            <View key={h.id} style={styles.row}>
              <View style={styles.dot} />
              <View style={{ flex: 1, paddingBottom: 20 }}>
                <T size={12} c={colors.textMuted}>
                  {thDateTime(h.at)}
                </T>
                <T w="semibold" size={15} c={colors.textStrong} style={{ marginTop: 2 }}>
                  {ACTION_LABEL[h.action] ?? h.action}
                </T>
                {h.detail ? (
                  <T size={13} c={colors.textBody}>
                    {h.detail}
                  </T>
                ) : null}
                <T size={12} c={colors.textMuted} style={{ marginTop: 2 }}>
                  {h.by ?? '—'}
                </T>
                {h.note ? (
                  <T size={12} c={colors.forest700} style={{ marginTop: 2 }}>
                    “{h.note}”
                  </T>
                ) : null}
              </View>
            </View>
          ))
        ) : (
          <EmptyNote text="ยังไม่มีประวัติ" />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 14 },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    backgroundColor: colors.forest700,
    borderWidth: 3,
    borderColor: colors.forestTint,
  },
});
