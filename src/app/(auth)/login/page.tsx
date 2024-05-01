"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCookies } from "react-cookie";
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useAuthServerMutation } from "@/hooks/useMutations";

interface IAuthResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_expires_in: number;
}

function useAuth({ tenant }: { tenant: string }) {
  const { replace } = useRouter();
  const { toast } = useToast();
  const [{ access_token }, setCookie] = useCookies(["access_token", "tenant"]);
  const { trigger, isMutating } = useAuthServerMutation<unknown, IAuthResponse>(
    `/auth/${tenant}/token`,
    {
      onSuccess(data) {
        if (data.access_token != access_token) {
          setCookie("access_token", data.access_token, {
            expires: new Date(Date.now() + data.expires_in * 1000),
          });
          setCookie("tenant", tenant);
        }
        toast({
          title: "Login Successful",
          description: "You have 30min session",
        });
        replace("/");
      },
      onError(error) {
        toast({
          title: "Login Failed",
          description: error.message,
        });
      },
    }
  );
  return { trigger, isMutating };
}

export default function LoginPage() {
  const [tenant, setTenant] = useState("");
  const { trigger, isMutating } = useAuth({ tenant });

  const login = async () => {
    await trigger();
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Card className="w-1/2">
        <CardHeader className="border-b-2">
          <h2 className="text-2xl font-bold">Authentication</h2>
        </CardHeader>
        <CardContent className="p-4">
          <Input
            placeholder="Tenant Name"
            name="tenant"
            value={tenant}
            onChange={(e) => setTenant(e.target.value)}
          />
        </CardContent>
        <CardFooter className="p-4 flex items-center justify-between border-t-2">
          <Button onClick={login} disabled={isMutating}>
            {isMutating && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
