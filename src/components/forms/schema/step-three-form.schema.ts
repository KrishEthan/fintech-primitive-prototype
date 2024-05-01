import { z } from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 10;
const ACCEPTED_FILE_TYPES = ["image/png", "image/jpeg", "image/jpg"];

export const StepThreeFormSchema = z.object({
  line_1: z.string(),
  line_2: z.string(),
  line_3: z.string(),
  city: z.string(),
  pincode: z.string(),
  proof_type: z.string(),
  proof_front: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, "File size must be less than 3MB")
    .refine((file) => {
      if (!file) return true;
      return ACCEPTED_FILE_TYPES.includes(file.type);
    }, "File must be a PNG"),
  proof_back: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, "File size must be less than 3MB")
    .refine((file) => {
      if (!file) return true;
      return ACCEPTED_FILE_TYPES.includes(file.type);
    }, "File must be a PNG"),
  proof_number: z.string(),
  proof_issue_date: z.date(),
  proof_expiry_date: z.date(),
});
