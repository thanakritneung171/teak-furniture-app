// สร้าง id สุ่มไว้ทำ idempotency key ของ action ออฟไลน์
// ใช้ crypto.randomUUID ถ้ามี (เว็บ/RN ใหม่) ไม่งั้น fallback แบบง่าย
export function uid(): string {
  const g: any = globalThis as any;
  if (g.crypto?.randomUUID) return g.crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
