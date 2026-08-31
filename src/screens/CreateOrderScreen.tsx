import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { colors } from '../theme/tokens';
import { PrimaryButton, T } from '../components/ui';
import { Field } from '../components/Field';
import { createOrder } from '../api/orders';
import { Nav } from '../navigation/types';

export default function CreateOrderScreen() {
  const nav = useNavigation<Nav>();
  const qc = useQueryClient();
  const [f, setF] = useState({
    customerName: '',
    customerPhone: '',
    dueDate: '',
    totalPrice: '',
    shippingAddress: '',
    note: '',
  });
  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }));

  const m = useMutation({
    mutationFn: () =>
      createOrder({
        customerName: f.customerName,
        customerPhone: f.customerPhone || undefined,
        dueDate: f.dueDate || undefined,
        totalPrice: f.totalPrice ? Number(f.totalPrice) : undefined,
        shippingAddress: f.shippingAddress || undefined,
        note: f.note || undefined,
      }),
    onSuccess: (order: any) => {
      qc.invalidateQueries({ queryKey: ['orders'] });
      nav.replace('OrderDetail', { id: order.id });
    },
  });

  const valid = f.customerName.trim().length > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.page }} edges={['bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
          <Field label="ชื่อลูกค้า *" value={f.customerName} onChangeText={set('customerName')} placeholder="คุณสมชาย" />
          <Field label="เบอร์โทร" value={f.customerPhone} onChangeText={set('customerPhone')} keyboardType="phone-pad" />
          <Field label="กำหนดส่ง (ปปปป-ดด-วว)" value={f.dueDate} onChangeText={set('dueDate')} placeholder="2026-09-05" />
          <Field label="ราคาทั้ง Order (บาท)" value={f.totalPrice} onChangeText={set('totalPrice')} keyboardType="numeric" />
          <Field label="ที่อยู่จัดส่ง" value={f.shippingAddress} onChangeText={set('shippingAddress')} multiline />
          <Field label="หมายเหตุ" value={f.note} onChangeText={set('note')} multiline />
          {m.isError ? (
            <T c={colors.danger} size={13} style={{ marginBottom: 12 }}>
              บันทึกไม่สำเร็จ ลองอีกครั้ง
            </T>
          ) : null}
          <PrimaryButton label="สร้างออเดอร์" onPress={() => m.mutate()} loading={m.isPending} disabled={!valid} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
