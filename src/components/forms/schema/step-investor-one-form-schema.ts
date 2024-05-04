import { z } from "zod";

export const StepInvestorOneFormSchema = z.object({
  type: z.enum(["individual"], { message: "Type is required" }),
  tax_status: z.enum(["resident_individual", "nri"], {message: "Tax Status is required"}),
  name: z.string().min(1, { message: "Name is required" }),
  date_of_birth: z.date({ message: "Date of birth is required" }),
  gender: z.enum(["male", "female", "transgender"], {
    message: "Gender is required",
  }),
  occupation: z.enum(
    [
      "business",
      "professional",
      "retired",
      "house_wife",
      "student",
      "public_sector_service",
      "private_sector_service",
      "government_service",
      "others",
      "agriculture",
      "doctor",
      "forex_dealer",
      "service",
    ],
    { message: "Occupation is required" }
  ),
  pan: z
    .string()
    .min(10, { message: "Pan number should have minimum 10 characters" })
    .max(10, { message: "Pan number should be 10 characters" })
    .regex(new RegExp("[A-Z]{5}[0-9]{4}[A-Z]{1}"), {
      message: "Invalid Pan number",
    }),
  country_of_birth: z
    .string()
    .max(2, { message: "Country of birth is required" }),
  place_of_birth: z.string().max(60, { message: "Place of birth is required" }),
  use_default_tax_residences: z.boolean().default(false),
  source_of_wealth: z.enum(
    [
      "salary",
      "business",
      "gift",
      "ancestral_property",
      "rental_income",
      "prize_money",
      "royalty",
      "others",
    ],
    { message: "Source of wealth is required" }
  ),
  income_slab: z.enum(
    [
      "upto_1lakh",
      "above_1lakh_upto_5lakh",
      "above_5lakh_upto_10lakh",
      "above_10lakh_upto_25lakh",
      "above_25lakh_upto_1cr",
      "above_1cr",
    ],
    { message: "Income slab is required" }
  ),
  pep_details: z.enum(["pep_exposed", "pep_related", "not_applicable"], {
    message: "PEP details is required",
  }),
});
