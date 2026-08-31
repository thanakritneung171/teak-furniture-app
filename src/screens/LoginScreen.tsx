import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, font, radius } from '../theme/tokens';
import { PrimaryButton, T } from '../components/ui';
import { useAuth } from '../store/auth';

export default function LoginScreen() {
  const { login } = useAuth();
  const [phone, setPhone] = useState('0810000005');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    setLoading(true);
    try {
      await login(phone.trim(), password);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'เข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.wrap}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.inner}
      >
        <View style={styles.brandMark}>
          <View style={[styles.bar, { height: 14 }]} />
          <View style={[styles.bar, { height: 24 }]} />
          <View style={[styles.bar, { height: 18 }]} />
        </View>
        <T w="bold" size={30} c={colors.white}>
          Teak Production
        </T>
        <T size={14} c={colors.textOnDark} style={{ marginTop: 6, marginBottom: 34 }}>
          ระบบผลิตเฟอร์นิเจอร์ไม้สัก
        </T>

        <T size={12} c={colors.gold300} w="semibold" style={styles.label}>
          เบอร์โทร
        </T>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="0810000000"
          placeholderTextColor={colors.mute}
          style={styles.input}
        />

        <T size={12} c={colors.gold300} w="semibold" style={[styles.label, { marginTop: 16 }]}>
          รหัสผ่าน
        </T>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor={colors.mute}
          style={styles.input}
        />

        {error ? (
          <T c={colors.danger} size={13} style={{ marginTop: 14, alignSelf: 'flex-start' }}>
            {error}
          </T>
        ) : null}

        <PrimaryButton
          label="เข้าสู่ระบบ"
          onPress={submit}
          loading={loading}
          bg={colors.gold500}
          fg={colors.forest900}
          style={{ marginTop: 28, width: '100%' }}
        />
        <T size={12} c={colors.textOnDark} style={{ marginTop: 16 }}>
          ตัวอย่าง: 0810000005 (ทำสี) · รหัส password
        </T>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.forest900 },
  inner: { flex: 1, paddingHorizontal: 28, alignItems: 'center', justifyContent: 'center' },
  brandMark: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    marginBottom: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.forest500,
    borderRadius: 6,
  },
  bar: { width: 7, backgroundColor: colors.gold300 },
  label: { alignSelf: 'flex-start', marginBottom: 6 },
  input: {
    width: '100%',
    height: 52,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: colors.forest500,
    paddingHorizontal: 16,
    color: colors.white,
    fontFamily: font.regular,
    fontSize: 16,
  },
});
