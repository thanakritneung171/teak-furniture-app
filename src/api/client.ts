import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// process.env.TEAK_API_ORIGIN ถูกแทนที่ด้วยค่าคงที่ตอน build เว็บ (webpack DefinePlugin);
// บนเนทีฟค่านี้เป็น undefined → ใช้ fallback
declare const process: any;

// Android emulator reaches the host machine at 10.0.2.2; iOS sim uses localhost.
// For a physical device, set your machine's LAN IP here.
// เว็บ/PWA: ตั้ง API origin ตอน build ผ่าน env TEAK_API_ORIGIN (เช่น https://api.example.com)
// เช่น: TEAK_API_ORIGIN=https://api.example.com npm run build:web
const WEB_ORIGIN = process.env.TEAK_API_ORIGIN || 'http://localhost:4000';
export const API_ORIGIN =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:4000'
    : Platform.OS === 'web'
      ? WEB_ORIGIN
      : 'http://localhost:4000';
export const API_BASE = `${API_ORIGIN}/api`;

// รูปที่อัปโหลดเก็บเป็น path relative (/uploads/..) — เติม origin; ส่วน url เต็มใช้ตามเดิม
export const imageUri = (url?: string | null): string | undefined =>
  !url ? undefined : url.startsWith('http') ? url : `${API_ORIGIN}${url}`;

export const api = axios.create({ baseURL: API_BASE, timeout: 15000 });

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
