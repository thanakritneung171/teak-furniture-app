import React, { useEffect, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { colors, radius, stageColor } from '../theme/tokens';
import { Badge, Loading, PrimaryButton, T } from '../components/ui';
import { completeStage, getTask, timerStart, timerStop } from '../api/tasks';
import { assignTask, getUsers } from '../api/meta';
import { useAuth } from '../store/auth';
import { durationText, hms, thDate, thDateTime } from '../lib/format';
import { Nav, RootStackParamList } from '../navigation/types';

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.infoRow, !last && { borderBottomWidth: 1, borderBottomColor: colors.line100 }]}>
      <T size={13} c={colors.textMuted}>
        {label}
      </T>
      <T size={14} w="medium" c={colors.textStrong}>
        {value}
      </T>
    </View>
  );
}

export default function TaskDetailScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<RouteProp<RootStackParamList, 'TaskDetail'>>();
  const { id } = route.params;
  const qc = useQueryClient();
  const { data: task, isLoading } = useQuery({ queryKey: ['task', id], queryFn: () => getTask(id) });

  const { user } = useAuth();
  const canAssign = user?.role === 'ADMIN' || user?.role === 'SUPERVISOR';
  const [now, setNow] = useState(Date.now());
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [assignVisible, setAssignVisible] = useState(false);
  const [note, setNote] = useState('');
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    enabled: canAssign && assignVisible,
  });

  const running = task?.running ?? null;
  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(iv);
  }, [running?.sessionId]);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['task', id] });
    qc.invalidateQueries({ queryKey: ['my-work'] });
    qc.invalidateQueries({ queryKey: ['tasks'] });
    qc.invalidateQueries({ queryKey: ['board'] });
  };
  const startM = useMutation({ mutationFn: () => timerStart(id), onSuccess: invalidate });
  const stopM = useMutation({ mutationFn: (n?: string) => timerStop(id, n), onSuccess: invalidate });
  const completeM = useMutation({ mutationFn: (n?: string) => completeStage(id, n), onSuccess: invalidate });
  const assignM = useMutation({
    mutationFn: (uid: string) => assignTask(id, uid),
    onSuccess: () => {
      invalidate();
      setAssignVisible(false);
    },
  });

  if (isLoading || !task) return <Loading />;

  const elapsed = running ? Math.floor((now - new Date(running.startTime).getTime()) / 1000) : 0;
  const isTerminal = task.stage.isTerminal;

  const onComplete = async () => {
    await completeM.mutateAsync(note || undefined);
    setConfirmVisible(false);
    setNote('');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.page }} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {task.images?.[0] ? (
          <Image source={{ uri: task.images[0].url }} style={styles.hero} />
        ) : (
          <View style={[styles.hero, styles.heroPlaceholder]} />
        )}

        <View style={{ padding: 20 }}>
          <T size={12} c={colors.accent} w="semibold">
            {task.taskNumber}
          </T>
          <T w="bold" size={24} c={colors.textStrong} style={{ marginTop: 4 }}>
            {task.product.name}
          </T>
          <T size={13} c={colors.textMuted}>
            จำนวน {task.product.quantity} · {task.order.orderNumber}
          </T>

          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
            <Badge label={task.stage.label} bg={stageColor[task.stage.code] ?? colors.forest700} />
            {task.priority === 'URGENT' ? <Badge label="ด่วน" bg={colors.danger} /> : null}
          </View>

          {/* Timer */}
          <View style={styles.timerCard}>
            <T size={12} c={colors.textOnDark} w="semibold">
              {task.stage.label}
            </T>
            <T w="bold" size={46} c={colors.white} style={{ marginVertical: 8, letterSpacing: 1 }}>
              {hms(running ? elapsed : task.totalDurationSec)}
            </T>
            <T size={13} c={running ? colors.success : colors.textOnDark}>
              {running ? '🟢 กำลังทำงาน' : 'รวมเวลาทำงานที่ผ่านมา'}
            </T>
            {!isTerminal ? (
              running ? (
                <PrimaryButton
                  label="หยุด"
                  onPress={() => stopM.mutate(undefined)}
                  loading={stopM.isPending}
                  bg={colors.danger}
                  fg={colors.white}
                  style={{ marginTop: 16, width: '100%' }}
                />
              ) : (
                <PrimaryButton
                  label="เริ่มทำงาน"
                  onPress={() => startM.mutate()}
                  loading={startM.isPending}
                  bg={colors.gold500}
                  fg={colors.forest900}
                  style={{ marginTop: 16, width: '100%' }}
                />
              )
            ) : null}
          </View>

          {!isTerminal ? (
            <PrimaryButton
              label="เสร็จขั้นตอน →"
              onPress={() => setConfirmVisible(true)}
              bg={colors.forest700}
              fg={colors.gold300}
              style={{ marginTop: 12 }}
            />
          ) : null}

          <View style={styles.infoCard}>
            <InfoRow label="ภาค" value={task.region ?? '—'} />
            <InfoRow label="สี" value={task.color ?? '—'} />
            <InfoRow
              label="โครง"
              value={
                task.frameSource === 'IN_HOUSE'
                  ? 'ผลิตเอง'
                  : task.frameSource === 'OUTSOURCED'
                    ? 'รับโครง'
                    : '—'
              }
            />
            <InfoRow label="กำหนดส่ง" value={thDate(task.dueDate)} />
            <InfoRow label="ผู้รับผิดชอบ" value={task.assignee?.name ?? 'ยังไม่มอบหมาย'} last />
          </View>

          {canAssign ? (
            <PrimaryButton
              label="มอบหมายงาน"
              onPress={() => setAssignVisible(true)}
              bg={colors.card}
              fg={colors.forest700}
              style={{ marginTop: 12, height: 46, borderWidth: 1, borderColor: colors.border }}
            />
          ) : null}

          <T w="semibold" size={16} c={colors.textStrong} style={{ marginTop: 24, marginBottom: 14 }}>
            ขั้นตอนการผลิต
          </T>
          <View style={styles.timeline}>
            {task.timeline.map((s: any, i: number) => (
              <View key={s.code} style={styles.tlRow}>
                <View
                  style={[
                    styles.tlDot,
                    s.status === 'done'
                      ? styles.tlDone
                      : s.status === 'current'
                        ? styles.tlCurrent
                        : styles.tlPending,
                  ]}
                >
                  <T size={11} c={s.status === 'pending' ? colors.mute : colors.white}>
                    {s.status === 'done' ? '✓' : s.status === 'current' ? '●' : ''}
                  </T>
                </View>
                <View style={{ flex: 1, paddingBottom: i === task.timeline.length - 1 ? 0 : 18 }}>
                  <T
                    w={s.status === 'current' ? 'semibold' : 'regular'}
                    size={15}
                    c={s.status === 'pending' ? colors.textMuted : colors.textStrong}
                  >
                    {s.label}
                  </T>
                  {s.at ? (
                    <T size={12} c={colors.textMuted}>
                      {thDateTime(s.at)}
                      {s.by ? ` · ${s.by}` : ''}
                    </T>
                  ) : s.status === 'current' ? (
                    <T size={12} c={colors.forest700}>
                      กำลังดำเนินการ
                    </T>
                  ) : null}
                </View>
              </View>
            ))}
          </View>

          <PrimaryButton
            label="ดูประวัติงาน"
            onPress={() => nav.navigate('History', { id, taskNumber: task.taskNumber })}
            bg={colors.card}
            fg={colors.forest700}
            style={{ marginTop: 22, borderWidth: 1, borderColor: colors.border }}
          />
        </View>
      </ScrollView>

      <Modal
        transparent
        visible={confirmVisible}
        animationType="fade"
        onRequestClose={() => setConfirmVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modal}>
            <T w="bold" size={20} c={colors.textStrong}>
              ยืนยันการทำงาน
            </T>
            <T size={13} c={colors.textMuted} style={{ marginTop: 6 }}>
              ขั้นตอน: {task.stage.label}
            </T>
            <T size={13} c={colors.textMuted}>
              เวลาทำงานรวม: {durationText(task.totalDurationSec + (running ? elapsed : 0))}
            </T>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="หมายเหตุ (ถ้ามี)"
              placeholderTextColor={colors.mute}
              style={styles.noteInput}
              multiline
            />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <PrimaryButton
                label="ยกเลิก"
                onPress={() => setConfirmVisible(false)}
                bg={colors.line200}
                fg={colors.textBody}
                style={{ flex: 1 }}
              />
              <PrimaryButton
                label="ยืนยันเสร็จ"
                onPress={onComplete}
                loading={completeM.isPending}
                bg={colors.forest900}
                fg={colors.gold300}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={assignVisible} animationType="fade" onRequestClose={() => setAssignVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modal}>
            <T w="bold" size={20} c={colors.textStrong}>มอบหมายงาน</T>
            <T size={13} c={colors.textMuted} style={{ marginTop: 4, marginBottom: 10 }}>
              เลือกพนักงานที่รับผิดชอบ
            </T>
            <ScrollView style={{ maxHeight: 320 }}>
              {(users ?? [])
                .filter((u: any) => u.role === 'WORKER')
                .map((u: any) => (
                  <Pressable key={u.id} onPress={() => assignM.mutate(u.id)} style={styles.assignRow}>
                    <View>
                      <T w="medium" size={15} c={colors.textStrong}>{u.name}</T>
                      <T size={12} c={colors.textMuted}>{u.station?.label ?? '—'}</T>
                    </View>
                    {task.assignee?.id === u.id ? (
                      <T c={colors.forest700} size={16}>✓</T>
                    ) : null}
                  </Pressable>
                ))}
            </ScrollView>
            <PrimaryButton
              label="ปิด"
              onPress={() => setAssignVisible(false)}
              bg={colors.line200}
              fg={colors.textBody}
              style={{ marginTop: 12 }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hero: { width: '100%', height: 240, backgroundColor: colors.sand200 },
  heroPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  timerCard: {
    marginTop: 20,
    backgroundColor: colors.forest900,
    borderRadius: radius.xl,
    padding: 24,
    alignItems: 'center',
  },
  infoCard: {
    marginTop: 20,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  timeline: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },
  tlRow: { flexDirection: 'row', gap: 14 },
  tlDot: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  tlDone: { backgroundColor: colors.success },
  tlCurrent: { backgroundColor: colors.forest700 },
  tlPending: { backgroundColor: colors.line200 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(21,49,40,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modal: { width: '100%', backgroundColor: colors.card, borderRadius: radius.xl, padding: 24 },
  assignRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.line100,
  },
  noteInput: {
    marginTop: 16,
    minHeight: 70,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    textAlignVertical: 'top',
    color: colors.textStrong,
    fontFamily: 'BaiJamjuree-Regular',
  },
});
