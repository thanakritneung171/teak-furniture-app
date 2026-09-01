declare const document: any;
declare const URL: any;

export type PickedImage = { uri: string; fileName?: string; type?: string; file?: any };

// web: ใช้ <input type="file"> แทน native picker
export function pickImage(): Promise<PickedImage | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files && input.files[0];
      if (!file) return resolve(null);
      resolve({ uri: URL.createObjectURL(file), fileName: file.name, type: file.type, file });
    };
    input.click();
  });
}
