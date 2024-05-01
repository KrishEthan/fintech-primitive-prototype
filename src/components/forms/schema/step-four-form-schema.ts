import { z } from "zod";

// identity_proof, signature, photo
const MAX_UPLOAD_SIZE = 1024 * 1024 * 10;
const ACCEPTED_FILE_TYPES = ["image/png", "image/jpeg", "image/jpg"];
const ACCEPTED_VIDEO_FILE_TYPES = ["video/mp4", "video/mp4"];

export const StepFourFormSchema = z.object({
  identity_proof: z
    .instanceof(File)
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, "File size must be less than 3MB")
    .refine((file) => {
      if (!file) return true;
      return ACCEPTED_FILE_TYPES.includes(file.type);
    }, "File must be a PNG"),
  signature: z
    .instanceof(File)
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, "File size must be less than 3MB")
    .refine((file) => {
      if (!file) return true;
      return ACCEPTED_FILE_TYPES.includes(file.type);
    }, "File must be a PNG"),
  photo: z
    .instanceof(File)
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, "File size must be less than 3MB")
    .refine((file) => {
      if (!file) return true;
      return ACCEPTED_FILE_TYPES.includes(file.type);
    }, "File must be a PNG"),
  ipv_video: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, "File size must be less than 3MB")
    .refine((file) => {
      if (!file) return true;
      return ACCEPTED_VIDEO_FILE_TYPES.includes(file.type);
    }, "File must be a PNG"),
});
