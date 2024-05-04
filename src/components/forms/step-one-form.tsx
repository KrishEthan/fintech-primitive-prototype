"use client";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { StepOneFormSchema } from "./schema/step-one-form-schema";
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
import { Input } from "@/components/ui/input";
import { StepperStore, useStepperStore } from "@/store/StepperStore";
import { IGeolocation, IKycRequest, IKycResponse } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "../ui/calendar";
import dayjs from "dayjs";
import { useKycRequestMutation } from "@/hooks/useMutations";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useCookies } from "react-cookie";
import useSearchParams from "@/lib/useSearchParams";
import { CurrentStepId, KycIdKey } from "@/constants/strings";
import { useToast } from "../ui/use-toast";

function useKycRequest() {
  const { toast } = useToast();
  const { updateSearchParams } = useSearchParams();
  const [{ kyc_id, current_step_id }, setCookie] = useCookies([
    "kyc_id",
    "current_step_id",
  ]);
  const { trigger, isMutating } = useKycRequestMutation<
    IKycRequest,
    IKycResponse
  >(`/kyc_requests`, {
    onSuccess(data) {
      if (data.error.errors.length > 0) {
        const errors = data.error.errors.join(", ");
        toast({
          title: "Error",
          description: errors,
          variant: "destructive",
        });
        return;
      }
      const { id } = data;
      updateSearchParams({ step: 2 });
      setCookie(KycIdKey, id);
      setCookie(CurrentStepId, 2);
    },
  });
  return { trigger, isMutating };
}

export default function StepOneForm() {
  const [geolocation, setGeolocation] = useState<IGeolocation>({
    latitude: 0,
    longitude: 0,
  });
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { setStepperStore } = useStepperStore();
  const { trigger, isMutating } = useKycRequest();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setGeolocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }, []);

  const form = useForm<z.infer<typeof StepOneFormSchema>>({
    resolver: zodResolver(StepOneFormSchema),
    defaultValues: {
      name: "",
      pan: "",
      email: "",
      aadhaar_number: "",
      mobile: "",
      date_of_birth: undefined,
      father_name: "",
      mother_name: "",
      spouse_name: "",
      gender: "",
      marital_status: "",
      residential_status: "",
      occupation_type: "",
      country_of_birth: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  async function onSubmit(data: z.infer<typeof StepOneFormSchema>) {
    try {
      const isd = data.mobile.split(" ")[0];
      const number = data.mobile.split(" ")[1];
      const date_of_birth = dayjs(data.date_of_birth).format("YYYY-MM-DD");
      const payload = {
        ...data,
        mobile: {
          isd,
          number,
        },
        geolocation: {
          latitude: geolocation.latitude,
          longitude: geolocation.longitude,
        },
        date_of_birth,
      } as StepperStore;
      await trigger(payload);
      setStepperStore(payload);
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
                <Input
                  placeholder="Last 4 digit of aadhaar number"
                  {...field}
                />
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
              <FormMessage />
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
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="india">India</SelectItem>
                      <SelectItem value="usa">USA</SelectItem>
                      <SelectItem value="uk">UK</SelectItem>
                      <SelectItem value="uae">UAE</SelectItem>
                      <SelectItem value="canada">Canada</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
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
                <Input placeholder="+91 1234567890" {...field} />
              </FormControl>
              {form.formState.errors.mobile && (
                <FormMessage>
                  {form.formState.errors.mobile.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="father_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Father Name</FormLabel>
              <FormControl>
                <Input placeholder="Father's Name" {...field} />
              </FormControl>
              {form.formState.errors.father_name && (
                <FormMessage>
                  {form.formState.errors.father_name.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mother_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mother Name</FormLabel>
              <FormControl>
                <Input placeholder="Mother's Name" {...field} />
              </FormControl>
              {form.formState.errors.mother_name && (
                <FormMessage>
                  {form.formState.errors.mother_name.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="spouse_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Spouse Name</FormLabel>
              <FormControl>
                <Input placeholder="Spouse's Name (optional)" {...field} />
              </FormControl>
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
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="transgender">Transgender</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="marital_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marital Status</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Marital Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="unmarried">Un-Married</SelectItem>
                    <SelectItem value="others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="residential_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Residential Status</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Residential Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="resident_individual">
                      Resident Individual
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="occupation_type"
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
                      <SelectValue placeholder="Select Occupation Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="self_employed">Self Employed</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                    <SelectItem value="housewife">Housewife</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="public_sector">Public Sector</SelectItem>
                    <SelectItem value="private_sector">
                      Private Sector
                    </SelectItem>
                    <SelectItem value="government_sector">
                      Government Sector
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
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
