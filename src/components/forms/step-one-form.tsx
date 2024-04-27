import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { StepperStore, useStepperStore } from "@/store/StepperStore";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";

const FormSchema = z.object({
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
    .min(12, { message: "Aadhaar number should have minimum 12 characters" })
    .max(12, { message: "Aadhaar number should be 12 characters" })
    .regex(new RegExp("^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$")),
  mobile: z.string().min(1, { message: "Mobile number is required" }),
  date_of_birth: z.date(),
});

export default function StepOneForm() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { setStepperStore } = useStepperStore();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pan: "",
      email: "",
      aadhaar_number: "",
      mobile: "",
      date_of_birth: undefined,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const payload = {
        ...data,
        mobile: {
          isd: "+91",
          number: data.mobile,
        },
        date_of_birth: data.date_of_birth.toISOString(),
      } as StepperStore;
      setStepperStore(payload);
      // Make the API Call to fintech premitive kyc request endpoint
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4"
      >
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              {form.formState.errors.email && (
                <FormMessage>{form.formState.errors.email.message}</FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aadhaar_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aadhaar Number</FormLabel>
              <FormControl>
                <Input placeholder="Aadhaar Number" {...field} />
              </FormControl>
              {form.formState.errors.aadhaar_number && (
                <FormMessage>
                  {form.formState.errors.aadhaar_number.message}
                </FormMessage>
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
          name="mobile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile</FormLabel>
              <FormControl>
                <Input placeholder="Mobile" {...field} />
              </FormControl>
              {form.formState.errors.mobile && (
                <FormMessage>
                  {form.formState.errors.mobile.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
