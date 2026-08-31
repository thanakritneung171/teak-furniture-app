import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { colors, radius, stageColor } from '../theme/tokens';
import { Loading, T } from '../components/ui';
import { getBoard } from '../api/tasks';
import { Nav } from '../navigation/types';

export default function BoardScreen() {
  const nav = useNavigation<Nav>();
  const { data, isLoading } = useQuery({ queryKey: ['board'], queryFn: getBoard });
  if (isLoading) return <Loading />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.page }} edges={['top']}>
      <View style={{ padding: 20, paddingBottom: 8 }}>
        <T w="bold" size={24} c={colors.textStrong}>
          Task Board
        </T>
      </View>
      <ScrollView horizontal contentContainerStyle={{ padding: 16, gap: 12 }} showsHorizontalScrollIndicator={false}>
        {data?.map((col) => (
          <View key={col.stage.code} style={styles.col}>
            <View style={styles.colHead}>
              <View
                style={[styles.colDot, { backgroundColor: stageColor[col.stage.code] ?? colors.forest700 }]}
              />
              <T w="semibold" size={14} c={colors.textStrong} style={{ flex: 1 }}>
                {col.stage.label}
              </T>
              <T size={13} c={colors.textMuted}>
                {col.tasks.length}
              </T>
            </View>
            {col.tasks.map((t) => (
              <Pressable
                key={t.id}
                onPress={() => nav.navigate('TaskDetail', { id: t.id })}
                style={styles.miniCard}
              >
                <T w="semibold" size={13} c={colors.textStrong} numberOfLines={1}>
                  {t.productName}
                </T>
                <T size={11} c={colors.textMuted}>
                  {t.orderNumber} · {t.quantity}
                </T>
                {t.priority === 'URGENT' ? (
                  <T size={11} c={colors.danger} style={{ marginTop: 4 }}>
                    ● ด่วน
                  </T>
                ) : null}
              </Pressable>
            ))}
            {col.tasks.length === 0 ? (
              <T size={12} c={colors.textMuted} style={{ paddingVertical: 8 }}>
                —
              </T>
            ) : null}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  col: { width: 220 },
  colHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  colDot: { width: 10, height: 10, borderRadius: 5 },
  miniCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 10,
  },
});
