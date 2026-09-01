import { api } from './client';

// อัปโหลดรูป (multipart) → { url }. web ส่ง File จริง, native ส่ง {uri,name,type}
export const uploadImage = (asset: { uri: string; fileName?: string; type?: string; file?: any }) => {
  const fd = new FormData();
  if (asset.file) {
    // web: FormData.append(name, Blob, filename) — RN types only allow 2 args
    (fd.append as any)('file', asset.file, asset.fileName || 'photo.jpg');
  } else {
    fd.append('file', {
      uri: asset.uri,
      name: asset.fileName || 'photo.jpg',
      type: asset.type || 'image/jpeg',
    } as any);
  }
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
