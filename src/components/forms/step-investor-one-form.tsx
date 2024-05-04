"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { date, z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReloadIcon } from "@radix-ui/react-icons";
import { StepInvestorOneFormSchema } from "./schema/step-investor-one-form-schema";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { Calendar } from "../ui/calendar";
import { CalendarIcon } from "lucide-react";
import { useInvestorPorfileMutation } from "@/hooks/useMutations";

const URLs = {
  post: "/investor_profiles",
};

export default function StepInvestorOneForm() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { trigger, isMutating } = useInvestorPorfileMutation(URLs.post);

  const form = useForm<z.infer<typeof StepInvestorOneFormSchema>>({
    resolver: zodResolver(StepInvestorOneFormSchema),
    defaultValues: {
      type: undefined,
      tax_status: undefined,
      name: "",
      date_of_birth: undefined,
      gender: undefined,
      occupation: undefined,
      pan: "",
      country_of_birth: "",
      place_of_birth: "",
      use_default_tax_residences: false,
      source_of_wealth: undefined,
      income_slab: undefined,
      pep_details: "not_applicable",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  async function onSubmit(data: z.infer<typeof StepInvestorOneFormSchema>) {
    const payload = {
      ...data,
      date_of_birth: dayjs(data.date_of_birth).format("YYYY-MM-DD"),
    };

    await trigger(payload);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4"
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Investor Type</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Investor Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="individual">Individual</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              {form.formState.errors.type && (
                <FormMessage>{form.formState.errors.type.message}</FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tax_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tax Status</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Tax Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="resident_individual">
                        Resident Individual
                      </SelectItem>
                      <SelectItem value="nri">
                        Non Resident Individual
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              {form.formState.errors.tax_status && (
                <FormMessage>
                  {form.formState.errors.tax_status.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              {form.formState.errors.name && (
                <FormMessage>{form.formState.errors.name.message}</FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pan</FormLabel>
              <FormControl>
                <Input placeholder="Pan" {...field} />
              </FormControl>
              {form.formState.errors.pan && (
                <FormMessage>{form.formState.errors.pan.message}</FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date_of_birth"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        dayjs(field.value).format("YYYY-MM-DD")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="single"
                    captionLayout="dropdown-buttons"
                    fromYear={1980}
                    toYear={2024}
                    selected={date}
                    onSelect={(date) => {
                      setDate(date);
                      field.onChange(date);
                    }}
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
              {form.formState.errors.date_of_birth && (
                <FormMessage>
                  {form.formState.errors.date_of_birth.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              {form.formState.errors.gender && (
                <FormMessage>
                  {form.formState.errors.gender.message}{" "}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="occupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Occupation Type</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Occupation" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="self_employed">Self Employed</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                    <SelectItem value="housewife">Housewife</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="public_sector_service">
                      Public Sector Service
                    </SelectItem>
                    <SelectItem value="private_sector_service">
                      Private Sector Service
                    </SelectItem>
                    <SelectItem value="government_sector_service">
                      Government Sector Service
                    </SelectItem>
                    <SelectItem value="others">Others</SelectItem>
                    <SelectItem value="agriculture">Agriculture</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="forex_dealer">Forex Dealer</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              {form.formState.errors.occupation && (
                <FormMessage>
                  {form.formState.errors.occupation.message}{" "}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="source_of_wealth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source of Wealth</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Source of Wealth" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="salary">Salary</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="gift">Gift</SelectItem>
                      <SelectItem value="ancestral_property">
                        Ancestral Property
                      </SelectItem>
                      <SelectItem value="rental_income">
                        Rental Income
                      </SelectItem>
                      <SelectItem value="prize_money">Prize Money</SelectItem>
                      <SelectItem value="royalty">Royalty</SelectItem>
                      <SelectItem value="others">Others</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              {form.formState.errors.source_of_wealth && (
                <FormMessage>
                  {form.formState.errors.source_of_wealth.message}{" "}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="income_slab"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Income Slab</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Income Slab" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="upto_1lakh">Upto 1 Lakh</SelectItem>
                      <SelectItem value="above_1lakh_upto_5lakh">
                        Above 1 Lakh - Upto 5 Lakh
                      </SelectItem>
                      <SelectItem value="above_5lakh_upto_10lakh">
                        Above 5 Lakh - Upto 10 Lakh
                      </SelectItem>
                      <SelectItem value="above_10lakh_upto_25lakh">
                        Above 10 Lakh - Upto 25 Lakh
                      </SelectItem>
                      <SelectItem value="above_25lakh_upto_1cr">
                        Above 25 Lakh - Upto 1 Cr
                      </SelectItem>
                      <SelectItem value="above_1cr">Above 1 Cr</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              {form.formState.errors.income_slab && (
                <FormMessage>
                  {form.formState.errors.income_slab.message}{" "}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pep_details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PEP Details</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select PEP Details" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="pep_exposed">PEP Exposed</SelectItem>
                      <SelectItem value="pep_related">PEP Related</SelectItem>
                      <SelectItem value="not_applicable">
                        Not Applicable
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              {form.formState.errors.pep_details && (
                <FormMessage>
                  {form.formState.errors.pep_details.message}{" "}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country_of_birth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country of Birth</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Country of Birth" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="IN">India</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              {form.formState.errors.country_of_birth && (
                <FormMessage>
                  {form.formState.errors.country_of_birth.message}{" "}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="place_of_birth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Place of Birth</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Place of Birth" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="IN">India</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              {form.formState.errors.place_of_birth && (
                <FormMessage>
                  {form.formState.errors.place_of_birth.message}{" "}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
        <Button className="col-span-2" type="submit" disabled={isMutating}>
          {isMutating && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}
