// เครื่องมือซิงค์งานออฟไลน์: กดตอนไม่มีเน็ต → เก็บคิว → กลับมาออนไลน์ค่อยส่ง (idempotent)
import { timerStart, timerStop, completeStage } from '../api/tasks';
import { uid } from '../lib/uid';
import { isOnline, onOnline } from './net';
import {
  ActionKind,
  QueuedAction,
  enqueue,
  loadQueue,
  queueSize,
  removeById,
} from './queue';

// lastSyncAt: bump ทุกครั้งที่มี action ซิงค์สำเร็จ — ให้ UI รู้ว่าควร refetch สถานะจริง
type SyncState = { pending: number; syncing: boolean; lastSyncAt: number };
let state: SyncState = { pending: 0, syncing: false, lastSyncAt: 0 };
const listeners = new Set<(s: SyncState) => void>();

function emit() {
  for (const l of listeners) l(state);
}
export function subscribeSync(cb: (s: SyncState) => void): () => void {
  listeners.add(cb);
  cb(state);
  return () => listeners.delete(cb);
}
export function getSyncState(): SyncState {
  return state;
}

async function refreshPending() {
  state = { ...state, pending: await queueSize() };
  emit();
}

// ส่ง action หนึ่งชิ้นไป API (พร้อม clientId + at) — คืน true ถ้าสำเร็จ/ถูกทิ้ง (เอาออกจากคิวได้)
async function sendOne(a: QueuedAction): Promise<boolean> {
  const opts = { clientId: a.id, at: a.at };
  try {
    if (a.kind === 'timer-start') await timerStart(a.taskId, opts);
    else if (a.kind === 'timer-stop') await timerStop(a.taskId, a.note, opts);
    else await completeStage(a.taskId, a.note, opts);
    return true;
  } catch (err: any) {
    const status = err?.response?.status;
    if (status === undefined) return false; // network error → เก็บไว้ retry
    if (status >= 500) return false; // เซิร์ฟเวอร์ล่ม → retry
    // 4xx = conflict จริง (เช่น งานจบ stage ไปแล้ว) — ทิ้งเพื่อไม่ให้คิวตัน
    return true;
  }
}

// ระบายคิว FIFO — หยุดทันทีที่ส่งไม่ผ่านเพราะเน็ต (เก็บลำดับ start→stop→complete)
export async function flush(): Promise<void> {
  if (state.syncing) return;
  if (!isOnline()) return;
  state = { ...state, syncing: true };
  emit();
  let synced = 0;
  try {
    let items = await loadQueue();
    while (items.length > 0) {
      if (!isOnline()) break;
      const head = items[0];
      const ok = await sendOne(head);
      if (!ok) break; // network/5xx → ค่อยลองใหม่รอบหน้า
      items = await removeById(head.id);
      synced++;
    }
  } finally {
    state = {
      pending: await queueSize(),
      syncing: false,
      lastSyncAt: synced > 0 ? Date.now() : state.lastSyncAt,
    };
    emit();
  }
}

// กด action หนึ่งครั้ง → เข้าคิวเสมอ (durable) แล้วพยายามส่งทันที
// คืน { synced } เพื่อให้ UI รู้ว่าควร refetch (true) หรือคงสถานะ optimistic ไว้ (false)
export async function performTaskAction(
  kind: ActionKind,
  taskId: string,
  note?: string,
): Promise<{ synced: boolean; clientId: string }> {
  const action: QueuedAction = {
    id: uid(),
    kind,
    taskId,
    note,
    at: new Date().toISOString(),
    createdAt: Date.now(),
  };
  await enqueue(action);
  await refreshPending();
  await flush();
  const stillQueued = (await loadQueue()).some((a) => a.id === action.id);
  return { synced: !stillQueued, clientId: action.id };
}

let started = false;
// เรียกครั้งเดียวตอนแอปเริ่ม — ตั้ง listener online + retry เป็นระยะ
export function initSync(): () => void {
  if (started) return () => {};
  started = true;
  refreshPending();
  const offOnline = onOnline(() => flush());
  const iv = setInterval(() => {
    if (state.pending > 0) flush();
  }, 20000);
  flush();
  return () => {
    offOnline();
    clearInterval(iv);
    started = false;
  };
}
