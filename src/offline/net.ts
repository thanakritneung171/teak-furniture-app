// ตรวจสถานะออนไลน์/ออฟไลน์
// เว็บ: ใช้ navigator.onLine + event online/offline
// เนทีฟ: ไม่มี NetInfo ในโปรเจกต์นี้ → ถือว่าออนไลน์ไว้ก่อน แล้วอาศัยการ retry จาก error ของ request
const g: any = globalThis as any;

export function isOnline(): boolean {
  if (typeof g.navigator?.onLine === 'boolean') return g.navigator.onLine;
  return true;
}

// เรียก cb เมื่อกลับมาออนไลน์ — คืน function ไว้ยกเลิก listener
export function onOnline(cb: () => void): () => void {
  if (typeof g.addEventListener === 'function') {
    g.addEventListener('online', cb);
    return () => g.removeEventListener('online', cb);
  }
  return () => {};
}
