import { api } from './client';

export const getOrders = (): Promise<any[]> => api.get('/orders').then((r) => r.data);
export const getOrder = (id: string): Promise<any> => api.get(`/orders/${id}`).then((r) => r.data);
export const createOrder = (body: any) => api.post('/orders', body).then((r) => r.data);
export const addProduct = (orderId: string, body: any) =>
  api.post(`/orders/${orderId}/products`, body).then((r) => r.data);
