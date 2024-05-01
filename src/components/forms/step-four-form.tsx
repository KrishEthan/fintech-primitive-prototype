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
import { AccessTokenKey } from "@/constants/strings";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 10;
const ACCEPTED_FILE_TYPES = ["image/png", "image/jpeg", "image/jpg"];

const FormSchema = z.object({
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

export default function StepFourForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      proof: undefined,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const formData = new FormData();
      formData.append("file", data.proof as File);
      const accessToken = new Cookies().get(AccessTokenKey);
      const response = await fetch("https://s.finprim.com/files", {
        method: "POST",
        headers: {
          "x-tenant-id": "ethanai",
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });
      const responseData = await response.json();
      console.log("File uploaded successfully:", responseData);
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
