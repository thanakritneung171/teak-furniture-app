import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { launchImageLibrary } from 'react-native-image-picker';
import { colors, radius } from '../theme/tokens';
import { PrimaryButton, T } from '../components/ui';
import { Choice, Field } from '../components/Field';
import { addProduct } from '../api/orders';
import { attachImage, uploadImage } from '../api/uploads';
import { imageUri } from '../api/client';
import { Nav, RootStackParamList } from '../navigation/types';

const REGIONS = ['เหนือ', 'กลาง', 'อีสาน', 'ใต้'].map((v) => ({ value: v, label: v }));
const COLORS = ['Natural', 'Walnut', 'Dark Brown', 'Black'].map((v) => ({ value: v, label: v }));
const FRAME = [
  { value: 'IN_HOUSE', label: 'ผลิตเอง' },
  { value: 'OUTSOURCED', label: 'รับโครง' },
];
const PRIORITY = [
  { value: 'NORMAL', label: 'ปกติ' },
  { value: 'URGENT', label: 'ด่วน' },
];

export default function AddProductScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<RouteProp<RootStackParamList, 'AddProduct'>>();
  const { orderId } = route.params;
  const qc = useQueryClient();

  const [name, setName] = useState('');
  const [productType, setProductType] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [details, setDetails] = useState('');
  const [region, setRegion] = useState('');
  const [color, setColor] = useState('');
  const [frameSource, setFrameSource] = useState('');
  const [priority, setPriority] = useState('NORMAL');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const pick = async () => {
    const res = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });
    const a = res.assets?.[0];
    if (!a?.uri) return;
    setUploading(true);
    try {
      const up = await uploadImage({ uri: a.uri, fileName: a.fileName, type: a.type });
      setImages((x) => [...x, up.url]);
    } finally {
      setUploading(false);
    }
  };

  const m = useMutation({
    mutationFn: async () => {
      const r = await addProduct(orderId, {
        name,
        productType: productType || undefined,
        quantity: quantity ? Number(quantity) : 1,
        details: details || undefined,
        region: region || undefined,
        color: color || undefined,
        frameSource: frameSource || undefined,
        priority,
      });
      for (let i = 0; i < images.length; i += 1) {
        await attachImage({ ownerType: 'PRODUCT', ownerId: r.product.id, url: images[i], isPrimary: i === 0 });
      }
      return r;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['order', orderId] });
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: ['board'] });
      nav.goBack();
    },
  });

  const valid = name.trim().length > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.page }} edges={['bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
          <T size={13} c={colors.textMuted} style={{ marginBottom: 16 }}>
            เพิ่มสินค้าเข้า {route.params.orderNumber ?? 'Order'} — ระบบจะสร้างงานผลิต (Task) ให้อัตโนมัติที่ขั้น “ขึ้นแบบ”
          </T>
          <Field label="ชื่อสินค้า *" value={name} onChangeText={setName} placeholder="เก้าอี้ไม้สักมีแขน" />
          <Field label="ประเภทสินค้า" value={productType} onChangeText={setProductType} placeholder="เก้าอี้ / โต๊ะ / ตู้" />
          <Field label="จำนวน" value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
          <Choice label="ภาค" options={REGIONS} value={region} onChange={setRegion} />
          <Choice label="สี" options={COLORS} value={color} onChange={setColor} />
          <Choice label="แหล่งโครง" options={FRAME} value={frameSource} onChange={setFrameSource} />
          <Choice label="ความสำคัญ" options={PRIORITY} value={priority} onChange={setPriority} />
          <Field label="รายละเอียด" value={details} onChangeText={setDetails} multiline />

          <T size={12} c={colors.forest700} w="semibold" style={{ marginBottom: 8 }}>
            รูปสินค้า
          </T>
          <View style={styles.imgRow}>
            {images.map((u) => (
              <Image key={u} source={{ uri: imageUri(u) }} style={styles.thumb} />
            ))}
            <Pressable onPress={pick} style={styles.addImg} disabled={uploading}>
              <T size={22} c={colors.forest700}>
                {uploading ? '…' : '+'}
              </T>
            </Pressable>
          </View>

          {m.isError ? (
            <T c={colors.danger} size={13} style={{ marginBottom: 12 }}>
              บันทึกไม่สำเร็จ ลองอีกครั้ง
            </T>
          ) : null}
          <PrimaryButton label="เพิ่มสินค้า + สร้างงาน" onPress={() => m.mutate()} loading={m.isPending} disabled={!valid} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imgRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  thumb: { width: 72, height: 72, borderRadius: radius.md, backgroundColor: colors.sand200 },
  addImg: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
