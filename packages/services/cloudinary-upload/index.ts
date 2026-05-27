import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { z } from "zod";
import { env } from "../env";

const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES: readonly string[] = ["application/pdf"];

const uploadFileInput = z.object({
  dataUrl: z.string().min(1),
  filename: z.string().min(1),
  folder: z.string().min(1),
});

export type UploadFileInput = z.infer<typeof uploadFileInput>;

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const parseDataUrl = (dataUrl: string) => {
  const match = dataUrl.match(/^data:([^;,]+);base64,([A-Za-z0-9+/=\s]+)$/);

  if (!match?.[1] || !match[2]) {
    throw new Error("Invalid file payload");
  }

  return {
    mimeType: match[1],
    base64: match[2].replace(/\s/g, ""),
  };
};

const assertAllowedFile = (mimeType: string, size: number) => {
  if (!mimeType.startsWith("image/") && !ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new Error("Only images and PDF files are supported");
  }

  if (size > MAX_UPLOAD_SIZE_BYTES) {
    throw new Error("File size must be 5MB or less");
  }
};

class CloudinaryUploadService {
  public async uploadFile(input: UploadFileInput) {
    const { dataUrl, filename, folder } = await uploadFileInput.parseAsync(input);
    const { mimeType, base64 } = parseDataUrl(dataUrl);
    const size = Buffer.byteLength(base64, "base64");

    assertAllowedFile(mimeType, size);

    const uploadResult: UploadApiResponse = await cloudinary.uploader.upload(dataUrl, {
      folder,
      resource_type: "auto",
      use_filename: true,
      unique_filename: true,
    });

    return {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      resourceType: uploadResult.resource_type,
      originalFilename: uploadResult.original_filename || filename,
    };
  }
}

export default CloudinaryUploadService;
