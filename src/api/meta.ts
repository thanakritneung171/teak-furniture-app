import { api } from './client';

export const getOverview = (): Promise<any> => api.get('/overview').then((r) => r.data);
export const getNotifications = (): Promise<any> => api.get('/notifications').then((r) => r.data);
export const getStages = (): Promise<any[]> => api.get('/stages').then((r) => r.data);
export const getUsers = (): Promise<any[]> => api.get('/users').then((r) => r.data);
export const createUser = (body: any) => api.post('/users', body).then((r) => r.data);
export const assignTask = (taskId: string, assigneeId: string) =>
  api.patch(`/tasks/${taskId}/assign`, { assigneeId }).then((r) => r.data);
