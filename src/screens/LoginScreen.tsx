import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/tokens';
import { T } from '../components/ui';
import { useAuth } from '../store/auth';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

export default function LoginScreen() {
  const { login } = useAuth();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (code: string) => {
    setLoading(true);
    setError('');
    try {
      await login(code);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'PIN ไม่ถูกต้อง');
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  const press = (d: string) => {
    if (loading || pin.length >= 6) return;
    setError('');
    const next = pin + d;
    setPin(next);
    if (next.length === 6) submit(next);
  };
  const del = () => {
    if (loading) return;
    setError('');
    setPin((p) => p.slice(0, -1));
  };

  return (
    <SafeAreaView style={styles.wrap}>
      <View style={styles.top}>
        <View style={styles.brandMark}>
          <View style={[styles.bar, { height: 14 }]} />
          <View style={[styles.bar, { height: 24 }]} />
          <View style={[styles.bar, { height: 18 }]} />
        </View>
        <T w="bold" size={26} c={colors.white}>
          Teak Production
        </T>
        <T size={14} c={colors.textOnDark} style={{ marginTop: 6 }}>
          ใส่ PIN 6 หลักเพื่อเข้าใช้งาน
        </T>

        <View style={styles.dots}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <View
              key={i}
              style={[styles.dot, i < pin.length && styles.dotFilled, !!error && styles.dotError]}
            />
          ))}
        </View>
        <View style={styles.status}>
          {loading ? (
            <ActivityIndicator color={colors.gold300} />
          ) : error ? (
            <T c="#fca5a5" size={13}>
              {error}
            </T>
          ) : null}
        </View>
      </View>

      <View style={styles.pad}>
        {KEYS.map((k, idx) =>
          k === '' ? (
            <View key={idx} style={styles.key} />
          ) : (
            <Pressable
              key={idx}
              onPress={() => (k === 'del' ? del() : press(k))}
              style={({ pressed }) => [styles.key, pressed && styles.keyPressed]}
            >
              <T size={k === 'del' ? 22 : 28} c={colors.white} w="medium">
                {k === 'del' ? '⌫' : k}
              </T>
            </Pressable>
          ),
        )}
      </View>

      <T size={12} c={colors.textOnDark} style={{ textAlign: 'center', marginBottom: 6 }}>
        ตัวอย่าง: 100005 (พนักงานทำสี) · 100001 (หัวหน้า) · 100000 (admin)
      </T>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.forest900, paddingHorizontal: 28, justifyContent: 'space-between' },
  top: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  brandMark: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    marginBottom: 18,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.forest500,
    borderRadius: 6,
  },
  bar: { width: 7, backgroundColor: colors.gold300 },
  dots: { flexDirection: 'row', gap: 16, marginTop: 34 },
  dot: { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: colors.forest500 },
  dotFilled: { backgroundColor: colors.gold300, borderColor: colors.gold300 },
  dotError: { borderColor: '#fca5a5' },
  status: { height: 26, marginTop: 16, justifyContent: 'center' },
  pad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
    marginBottom: 12,
  },
  key: {
    width: '30%',
    aspectRatio: 1.7,
    maxHeight: 72,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyPressed: { backgroundColor: 'rgba(255,255,255,0.08)' },
});
