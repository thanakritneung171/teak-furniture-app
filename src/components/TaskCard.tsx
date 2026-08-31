import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, stageColor } from '../theme/tokens';
import { Badge, T } from './ui';
import { TaskCard as TaskCardType } from '../api/tasks';
import { hms, isOverdue, thDate } from '../lib/format';

function Chip({ text }: { text: string }) {
  return (
    <View style={styles.chip}>
      <T size={11} c={colors.textBody}>
        {text}
      </T>
    </View>
  );
}

export function TaskCardView({ task, onPress }: { task: TaskCardType; onPress?: () => void }) {
  const overdue = isOverdue(task.dueDate) && task.stage.code !== 'SHIPPED';
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}>
      <View style={styles.topRow}>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <T w="semibold" size={16} c={colors.textStrong}>
            {task.productName}
          </T>
          <T size={12} c={colors.textMuted}>
            {task.orderNumber} · จำนวน {task.quantity}
          </T>
        </View>
        {task.priority === 'URGENT' ? <Badge label="ด่วน" bg={colors.danger} /> : null}
      </View>

      <View style={styles.tags}>
        <Badge label={task.stage.label} bg={stageColor[task.stage.code] ?? colors.forest700} />
        {task.color ? <Chip text={task.color} /> : null}
        {task.region ? <Chip text={task.region} /> : null}
        {task.frameSource ? (
          <Chip text={task.frameSource === 'IN_HOUSE' ? 'ผลิตเอง' : 'รับโครง'} />
        ) : null}
      </View>

      <View style={styles.bottomRow}>
        <T
          size={13}
          w={task.running ? 'semibold' : 'regular'}
          c={task.running ? colors.forest700 : colors.textMuted}
        >
          {task.running ? `⏱ ${hms(task.elapsedSec ?? 0)}` : '⏱ ยังไม่ได้เริ่ม'}
        </T>
        <T size={12} c={overdue ? colors.danger : colors.textMuted}>
          {overdue ? 'เกินกำหนด · ' : 'กำหนด '}
          {thDate(task.dueDate)}
        </T>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },
  topRow: { flexDirection: 'row', alignItems: 'flex-start' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  chip: {
    backgroundColor: colors.forestTint,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.line100,
  },
});
