import { z } from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 10;
const ACCEPTED_FILE_TYPES = ["image/png", "image/jpeg", "image/jpg"];

export const StepTwoFormSchema = z.object({
  account_holder_name: z.string(),
  account_number: z.string(),
  ifsc_code: z.string(),
  proof: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, "File size must be less than 3MB")
    .refine((file) => {
      if (!file) return true;
      return ACCEPTED_FILE_TYPES.includes(file.type);
    }, "File must be a PNG"),
});
