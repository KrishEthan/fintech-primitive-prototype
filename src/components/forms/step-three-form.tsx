import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";

const FormSchema = z.object({
  line_1: z.string(),
  line_2: z.string(),
  line_3: z.string(),
  city: z.string(),
  pincode: z.string(),
  proof_type: z.string(),
  proof_number: z.string(),
  proof_issue_date: z.string(),
  proof_expiry_date: z.string(),
});

export default function StepThreeForm() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      line_1: "",
      line_2: "",
      line_3: "",
      city: "",
      pincode: "",
      proof_type: "",
      proof_number: "",
      proof_issue_date: "",
      proof_expiry_date: "",
    },
  });
  async function onSubmit(data: z.infer<typeof FormSchema>) {}

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4"
      >
        <FormField
          control={form.control}
          name="line_1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Line 1</FormLabel>
              <FormControl>
                <Input placeholder="Line 1" {...field} />
              </FormControl>
              {form.formState.errors.line_1 && (
                <FormMessage>
                  {form.formState.errors.line_1.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="line_2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Line 2</FormLabel>
              <FormControl>
                <Input placeholder="Line 2" {...field} />
              </FormControl>
              {form.formState.errors.line_2 && (
                <FormMessage>
                  {form.formState.errors.line_2.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="line_3"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Line 3</FormLabel>
              <FormControl>
                <Input placeholder="Line 3" {...field} />
              </FormControl>
              {form.formState.errors.line_3 && (
                <FormMessage>
                  {form.formState.errors.line_3.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="City" {...field} />
              </FormControl>
              {form.formState.errors.city && (
                <FormMessage>{form.formState.errors.city.message}</FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pincode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pincode</FormLabel>
              <FormControl>
                <Input placeholder="Pincode" {...field} />
              </FormControl>
              {form.formState.errors.pincode && (
                <FormMessage>
                  {form.formState.errors.pincode.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="proof_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proof Type</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Proof Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="voter_id">Voter ID</SelectItem>
                      <SelectItem value="driving_license">
                        Driving License
                      </SelectItem>
                      <SelectItem value="aadhaar">Aadhaar</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="proof_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proof Number</FormLabel>
              <FormControl>
                <Input placeholder="Proof Number" {...field} />
              </FormControl>
              {form.formState.errors.proof_number && (
                <FormMessage>
                  {form.formState.errors.proof_number.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="proof_issue_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Proof Issue Date</FormLabel>
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
                        format(field.value, "yyyy-MM-dd")
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
                    captionLayout="dropdown-buttons" //Also: dropdown | buttons
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="proof_expiry_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Proof Expiry Date</FormLabel>
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
                        format(field.value, "yyyy-MM-dd")
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
                    captionLayout="dropdown-buttons" //Also: dropdown | buttons
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
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
