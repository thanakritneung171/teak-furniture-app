import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { colors } from '../theme/tokens';
import { PrimaryButton, T } from '../components/ui';
import { Choice, Field } from '../components/Field';
import { createUser, getStages } from '../api/meta';
import { Nav } from '../navigation/types';

const ROLES = [
  { value: 'WORKER', label: 'พนักงาน' },
  { value: 'SUPERVISOR', label: 'หัวหน้า' },
  { value: 'ADMIN', label: 'ผู้ดูแล' },
];

export default function CreateEmployeeScreen() {
  const nav = useNavigation<Nav>();
  const qc = useQueryClient();
  const { data: stages } = useQuery({ queryKey: ['stages'], queryFn: getStages });

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('WORKER');
  const [stationId, setStationId] = useState('');

  const stationOptions = (stages ?? [])
    .filter((s: any) => !s.isTerminal)
    .map((s: any) => ({ value: s.id, label: s.label }));

  const m = useMutation({
    mutationFn: () =>
      createUser({
        name,
        phone,
        password,
        role,
        stationId: role === 'WORKER' ? stationId || undefined : undefined,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      nav.goBack();
    },
  });

  const valid = name.trim() && phone.trim() && password.length >= 4 && (role !== 'WORKER' || stationId);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.page }} edges={['bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
          <Field label="ชื่อ *" value={name} onChangeText={setName} placeholder="สมชาย" />
          <Field label="เบอร์โทร (ใช้ login) *" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="0810000009" />
          <Field label="รหัสผ่าน *" value={password} onChangeText={setPassword} placeholder="อย่างน้อย 4 ตัว" />
          <Choice label="สิทธิ์" options={ROLES} value={role} onChange={setRole} />
          {role === 'WORKER' ? (
            <Choice label="แผนก (stage ที่รับผิดชอบ) *" options={stationOptions} value={stationId} onChange={setStationId} />
          ) : null}
          {m.isError ? (
            <T c={colors.danger} size={13} style={{ marginBottom: 12 }}>
              บันทึกไม่สำเร็จ (เบอร์อาจซ้ำ)
            </T>
          ) : null}
          <PrimaryButton label="เพิ่มพนักงาน" onPress={() => m.mutate()} loading={m.isPending} disabled={!valid} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
