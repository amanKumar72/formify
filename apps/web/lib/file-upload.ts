export type UploadedFileValue = {
  url: string;
  publicId: string;
  filename: string;
  resourceType: string;
  mimeType?: string;
};

export type SubmittedFormField = {
  labelKey: string;
  value: string | UploadedFileValue;
};

export const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Unable to read file"));
    };
    reader.onerror = () => reject(reader.error ?? new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
