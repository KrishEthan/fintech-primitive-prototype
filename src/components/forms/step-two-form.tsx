"use client";

import React from "react";
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
import { useKycRequestPatchMutation } from "@/hooks/useMutations";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { StepTwoFormSchema } from "./schema/step-two-form-schema";
import { Cookies, useCookies } from "react-cookie";
import useSearchParams from "@/lib/useSearchParams";
import { useUploadFile } from "@/hooks/useUploadFile";
import { IKycRequest, IKycResponse } from "@/types";
import { useToast } from "../ui/use-toast";
import { CurrentStepId, KycIdKey } from "@/constants/strings";

const URLs = {
  patch: "/kyc_requests/{kyc_id}",
};
const useKycPatchRequest = () => {
  const { toast } = useToast();
  const { updateSearchParams } = useSearchParams();
  const kyc_id = new Cookies().get(KycIdKey);
  const [{ current_step_id }, setCookie] = useCookies(["current_step_id"]);
  const url = URLs.patch.replace("{kyc_id}", kyc_id);
  const { trigger, isMutating } = useKycRequestPatchMutation<IKycResponse>(
    url,
    {
      onSuccess(data) {
        if (data.error.errors.length > 0) {
          const errors = data.error.errors.join(", ");
          toast({
            title: "Error",
            description: errors,
            variant: "destructive"
          });
          return;
        }
        updateSearchParams({ step: 3 });
        setCookie(CurrentStepId, 3);
      },
    }
  );
  return { trigger, isMutating };
};

export default function StepTwoForm() {
  const { trigger, isMutating } = useKycPatchRequest();
  const { fileData, fileTrigger, isFileMutating } = useUploadFile();

  const form = useForm<z.infer<typeof StepTwoFormSchema>>({
    resolver: zodResolver(StepTwoFormSchema),
    defaultValues: {
      account_holder_name: "",
      account_number: "",
      ifsc_code: "",
      proof: undefined,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  async function onSubmit(data: z.infer<typeof StepTwoFormSchema>) {
    try {
      await fileTrigger({
        file: data.proof,
      });

      const payload = {
        bank_account: {
          account_holder_name: data.account_holder_name,
          account_number: data.account_number,
          ifsc_code: data.ifsc_code,
          proof: fileData?.id,
        },
      };

      await trigger(payload);
    } catch (error) {
      console.error("File upload failed:", error);
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
          name="account_holder_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Holder Name</FormLabel>
              <FormControl>
                <Input placeholder="Account Holder Name" {...field} />
              </FormControl>
              <FormMessage>
                {form.formState.errors.account_holder_name?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="account_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Number</FormLabel>
              <FormControl>
                <Input placeholder="Account Number" {...field} />
              </FormControl>
              <FormMessage>
                {form.formState.errors.account_number?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ifsc_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IFSC Code</FormLabel>
              <FormControl>
                <Input placeholder="IFSC Code" {...field} />
              </FormControl>
              <FormMessage>
                {form.formState.errors.ifsc_code?.message}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="proof"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proof</FormLabel>
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
              <FormMessage>{form.formState.errors.proof?.message}</FormMessage>
            </FormItem>
          )}
        />
        <Button
          className="col-span-2"
          type="submit"
          disabled={isFileMutating || isMutating}
        >
          {(isFileMutating || isMutating) && (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          )}
          Submit
        </Button>
      </form>
    </Form>
  );
}
