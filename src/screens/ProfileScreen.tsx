import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius } from '../theme/tokens';
import { PrimaryButton, T } from '../components/ui';
import { useAuth } from '../store/auth';

const ROLE_LABEL: Record<string, string> = {
  ADMIN: 'ผู้ดูแลระบบ',
  SUPERVISOR: 'หัวหน้าฝ่ายผลิต',
  WORKER: 'พนักงาน',
};

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, !last && { borderBottomWidth: 1, borderBottomColor: colors.line100 }]}>
      <T size={13} c={colors.textMuted}>
        {label}
      </T>
      <T size={14} w="medium" c={colors.textStrong}>
        {value}
      </T>
    </View>
  );
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.page }} edges={['top']}>
      <View style={{ padding: 20 }}>
        <View style={styles.avatar}>
          <T w="bold" size={28} c={colors.gold300}>
            {user?.name?.[0] ?? '?'}
          </T>
        </View>
        <T w="bold" size={24} c={colors.textStrong} style={{ marginTop: 16 }}>
          {user?.name}
        </T>
        <T size={14} c={colors.textMuted}>
          {ROLE_LABEL[user?.role ?? ''] ?? user?.role}
          {user?.station ? ` · ${user.station.label}` : ''}
        </T>

        <View style={styles.card}>
          <Row label="เบอร์โทร" value={user?.phone ?? '—'} />
          <Row label="สิทธิ์" value={ROLE_LABEL[user?.role ?? ''] ?? '—'} last={!user?.station} />
          {user?.station ? <Row label="แผนก" value={user.station.label} last /> : null}
        </View>

        <PrimaryButton
          label="ออกจากระบบ"
          onPress={logout}
          bg={colors.card}
          fg={colors.danger}
          style={{ marginTop: 24, borderWidth: 1, borderColor: colors.border }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.forest900,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    marginTop: 24,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
});
