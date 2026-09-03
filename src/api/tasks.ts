import { api } from './client';

export type Stage = { code: string; label: string; isTerminal?: boolean };
export type TaskCard = {
  id: string;
  taskNumber: string;
  productName: string;
  productType?: string | null;
  quantity: number;
  orderNumber: string;
  stage: Stage;
  region?: string | null;
  color?: string | null;
  frameSource?: string | null;
  priority: 'NORMAL' | 'URGENT';
  dueDate?: string | null;
  assignee?: { id: string; name: string } | null;
  running: boolean;
  runningSince?: string | null;
  elapsedSec?: number | null;
};

export type MyWork = {
  counts: { inProgress: number; waiting: number; done: number };
  urgent: TaskCard[];
  inProgress: TaskCard[];
  waiting: TaskCard[];
};

export type BoardColumn = { stage: Stage & { sortOrder: number }; tasks: TaskCard[] };

export const getMyWork = (): Promise<MyWork> => api.get('/tasks/my').then((r) => r.data);
export const getBoard = (): Promise<BoardColumn[]> => api.get('/tasks/board').then((r) => r.data);
export const getTasks = (params?: Record<string, string>): Promise<TaskCard[]> =>
  api.get('/tasks', { params }).then((r) => r.data);
export const getTask = (id: string): Promise<any> => api.get(`/tasks/${id}`).then((r) => r.data);
export const getHistory = (id: string): Promise<any[]> =>
  api.get(`/tasks/${id}/history`).then((r) => r.data);
// opts: clientId (idempotency key) + at (เวลาจริงที่กด) — ใช้เวลาซิงค์ action ที่กดตอนออฟไลน์
export type SendOpts = { clientId?: string; at?: string };

export const timerStart = (id: string, opts?: SendOpts) =>
  api.post(`/tasks/${id}/timer/start`, { ...opts }).then((r) => r.data);
export const timerStop = (id: string, note?: string, opts?: SendOpts) =>
  api.post(`/tasks/${id}/timer/stop`, { note, ...opts }).then((r) => r.data);
export const completeStage = (id: string, note?: string, opts?: SendOpts) =>
  api.patch(`/tasks/${id}/complete-stage`, { note, ...opts }).then((r) => r.data);
