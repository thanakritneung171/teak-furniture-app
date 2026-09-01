import { launchImageLibrary } from 'react-native-image-picker';

export type PickedImage = { uri: string; fileName?: string; type?: string; file?: any };

// native: ใช้ react-native-image-picker
export async function pickImage(): Promise<PickedImage | null> {
  const res = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });
  const a = res.assets && res.assets[0];
  return a?.uri ? { uri: a.uri, fileName: a.fileName ?? undefined, type: a.type ?? undefined } : null;
}
