// คิวงานที่กดตอนออฟไลน์ (เก็บถาวรใน AsyncStorage — เว็บใช้ localStorage, เนทีฟใช้ native store)
// FIFO: ซิงค์ตามลำดับที่กด เพื่อให้ start มาก่อน stop/complete เสมอ
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'offline_queue_v1';

export type ActionKind = 'timer-start' | 'timer-stop' | 'complete-stage';

export type QueuedAction = {
  id: string; // clientId — ใช้เป็น idempotency key ฝั่ง API
  kind: ActionKind;
  taskId: string;
  note?: string;
  at: string; // ISO — เวลาจริงที่กดปุ่ม
  createdAt: number;
};

export async function loadQueue(): Promise<QueuedAction[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as QueuedAction[]) : [];
  } catch {
    return [];
  }
}

async function saveQueue(items: QueuedAction[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(items));
}

export async function enqueue(action: QueuedAction): Promise<QueuedAction[]> {
  const items = await loadQueue();
  items.push(action);
  await saveQueue(items);
  return items;
}

export async function removeById(id: string): Promise<QueuedAction[]> {
  const items = (await loadQueue()).filter((a) => a.id !== id);
  await saveQueue(items);
  return items;
}

export async function queueSize(): Promise<number> {
  return (await loadQueue()).length;
}
