import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Android emulator reaches the host machine at 10.0.2.2; iOS sim uses localhost.
// For a physical device, set your machine's LAN IP here.
export const API_ORIGIN =
  Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';
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
