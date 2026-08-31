import { api } from './client';

// อัปโหลดรูป (multipart) → { url }
export const uploadImage = (asset: { uri: string; fileName?: string; type?: string }) => {
  const fd = new FormData();
  fd.append('file', {
    uri: asset.uri,
    name: asset.fileName || 'photo.jpg',
    type: asset.type || 'image/jpeg',
  } as any);
  return api
    .post('/uploads', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((r) => r.data as { url: string });
};

export const attachImage = (body: {
  ownerType: 'ORDER' | 'PRODUCT' | 'TASK';
  ownerId: string;
  url: string;
  isPrimary?: boolean;
}) => api.post('/images', body).then((r) => r.data);
