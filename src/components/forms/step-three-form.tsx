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
import { ReloadIcon } from "@radix-ui/react-icons";
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
import { StepThreeFormSchema } from "./schema/step-three-form.schema";
import dayjs from "dayjs";
import { useUploadFile } from "@/hooks/useUploadFile";
import { Cookies, useCookies } from "react-cookie";
import { useKycRequestPatchMutation } from "@/hooks/useMutations";
import useSearchParams from "@/lib/useSearchParams";

const URLs = {
  patch: "/kyc_requests/{kyc_id}",
};

const useKycPatchRequest = () => {
  const { updateSearchParams } = useSearchParams();
  const kyc_id = new Cookies().get("kyc_id");
  const [{ current_step_id }, setCookie] = useCookies(["current_step_id"]);
  const url = URLs.patch.replace("{kyc_id}", kyc_id);
  const { trigger, isMutating } = useKycRequestPatchMutation(url, {
    onSuccess() {
      updateSearchParams({ step: 4 });
      setCookie("current_step_id", 4);
    },
  });
  return { trigger, isMutating };
};

export default function StepThreeForm() {
  const { fileTrigger, isFileMutating } = useUploadFile();
  const { trigger, isMutating } = useKycPatchRequest();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const form = useForm<z.infer<typeof StepThreeFormSchema>>({
    resolver: zodResolver(StepThreeFormSchema),
    defaultValues: {
      line_1: "",
      line_2: "",
      line_3: "",
      city: "",
      pincode: "",
      proof_type: "",
      proof_front: undefined,
      proof_back: undefined,
      proof_number: "",
      proof_issue_date: undefined,
      proof_expiry_date: undefined,
    },
  });
  async function onSubmit(data: z.infer<typeof StepThreeFormSchema>) {
    try {
      const file_response_1 = await fileTrigger({
        file: data.proof_front,
      });
      const file_response_2 = await fileTrigger({
        file: data.proof_back,
      });

      const file_front_id_1 = file_response_1?.id;
      const file_back_id_2 = file_response_2?.id;

      const proof_issue_date = dayjs(data.proof_issue_date).format(
        "YYYY-MM-DD"
      );
      const proof_expiry_date = dayjs(data.proof_expiry_date).format(
        "YYYY-MM-DD"
      );
      const payload = {
        line_1: data.line_1,
        line_2: data.line_2,
        line_3: data.line_3,
        city: data.city,
        pincode: data.pincode,
        country: "in",
        proof_type: data.proof_type,
        proof_number: data.proof_number,
        proof_issue_date,
        proof_expiry_date,
        proof: file_front_id_1,
        proof_back: file_back_id_2,
      };
      await trigger({
        address: {
          ...payload,
        }
      });
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
          name="proof_front"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proof Front</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept={"image/png, image/jpeg, image/jpg"}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    field.onChange(file);
                  }}
                />
              </FormControl>
              <FormMessage>
                {form.formState.errors.proof_front?.message}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="proof_back"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proof Back</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept={"image/png, image/jpeg, image/jpg"}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    field.onChange(file);
                  }}
                />
              </FormControl>
              <FormMessage>
                {form.formState.errors.proof_front?.message}
              </FormMessage>
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
        <Button className="col-span-2" disabled={isFileMutating || isMutating}>
          {(isFileMutating || isMutating) && (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          )}
          Submit
        </Button>
      </form>
    </Form>
  );
}
