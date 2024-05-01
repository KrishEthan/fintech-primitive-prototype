import { z } from "zod";

export const StepOneFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  pan: z
    .string()
    .min(10, { message: "Pan number should have minimum 10 characters" })
    .max(10, { message: "Pan number should be 10 characters" })
    .regex(new RegExp("[A-Z]{5}[0-9]{4}[A-Z]{1}"), {
      message: "Invalid Pan number",
    }),
  email: z.string().email({ message: "Invalid email" }),
  aadhaar_number: z
    .string()
    .min(4, { message: "Aadhaar number should have minimum 4 characters" })
    .max(4, { message: "Aadhaar number should be 4 characters" }),
  mobile: z.string().min(1, { message: "Mobile number is required" }),
  date_of_birth: z.date(),
  father_name: z.string().min(1, { message: "Father's name is required" }),
  mother_name: z.string().min(1, { message: "Mother's name is required" }),
  spouse_name: z.string().optional(),
  gender: z.string().min(1, { message: "Gender is required" }),
  marital_status: z.string().min(1, { message: "Marital status is required" }),
  residential_status: z
    .string()
    .min(1, { message: "Residential status is required" }),
  occupation_type: z
    .string()
    .min(1, { message: "Occupation type is required" }),
  country_of_birth: z.string().optional(),
});