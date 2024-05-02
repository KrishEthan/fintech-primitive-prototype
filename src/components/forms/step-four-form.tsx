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
import { Button } from "../ui/button";
import { Cookies } from "react-cookie";
import { ReloadIcon } from "@radix-ui/react-icons";
import { StepFourFormSchema } from "./schema/step-four-form-schema";
import useSearchParams from "@/lib/useSearchParams";
import { useKycRequestPatchMutation } from "@/hooks/useMutations";
import { useUploadFile } from "@/hooks/useUploadFile";
import { IKycResponse } from "@/types";
import { useToast } from "../ui/use-toast";
import { CurrentStepId } from "@/constants/strings";

const URLs = {
  patch: "/kyc_requests/{kyc_id}",
};

const useKycPatchRequest = () => {
  const { toast } = useToast();
  const { updateSearchParams } = useSearchParams();
  const kyc_id = new Cookies().get("kyc_id");
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
            variant: "destructive",
          });

          return;
        }
        updateSearchParams({ step: undefined });
        new Cookies().remove(CurrentStepId);
      },
    }
  );
  return { trigger, isMutating };
};

export default function StepFourForm() {
  const { fileTrigger, isFileMutating } = useUploadFile();
  const { trigger, isMutating } = useKycPatchRequest();
  const form = useForm<z.infer<typeof StepFourFormSchema>>({
    resolver: zodResolver(StepFourFormSchema),
    defaultValues: {
      identity_proof: undefined,
      signature: undefined,
      photo: undefined,
      ipv_video: undefined,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  async function onSubmit(data: z.infer<typeof StepFourFormSchema>) {
    try {
      const response_1 = await fileTrigger({
        file: data.identity_proof,
      });
      const response_2 = await fileTrigger({
        file: data.signature,
      });
      const response_3 = await fileTrigger({
        file: data.photo,
      });
      const response_4 = await fileTrigger({
        file: data.ipv_video,
      });
      const payload = {
        identity_proof: response_1?.id,
        signature: response_2?.id,
        photo: response_3?.id,
        ipv_video: response_4?.id,
      };

      await trigger(payload);
      console.log("File uploaded successfully:", data);
    } catch (error) {
      console.error("File upload failed:", error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-rows-2 gap-4"
      >
        <FormField
          control={form.control}
          name="identity_proof"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Identity Proof</FormLabel>
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
                {form.formState.errors.identity_proof?.message}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="signature"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Signature</FormLabel>
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
                {form.formState.errors.signature?.message}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo</FormLabel>
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
              <FormMessage>{form.formState.errors.photo?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ipv_video"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept={"video/mp4, video/webm"}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    field.onChange(file);
                  }}
                />
              </FormControl>
              <FormMessage>{form.formState.errors.photo?.message}</FormMessage>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="row-span-2"
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
