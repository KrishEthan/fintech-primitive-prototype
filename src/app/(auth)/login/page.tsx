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

const BASE_URL = "https://s.finprim.com/v2";

interface IAuthResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_expires_in: number;
}

async function fetchAuth({ tenant }: { tenant: string }) {
  const body = new URLSearchParams({
    client_id: "ethanai_test_ebaca52f60c73aecddf14f57b5dcb129",
    client_secret: "ouRkwPvTDkupXnG7zetnJlyxFwdpvwOx",
    grant_type: "client_credentials",
  });

  const response = await fetch(`${BASE_URL}/auth/${tenant}/token`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const data = (await response.json()) as IAuthResponse;
  return data;
}

export default function LoginPage() {
  const { toast } = useToast();
  const { replace } = useRouter();
  const [tenant, setTenant] = useState("");
  const [loading, setLoading] = useState(false);
  const [{ access_token }, setCookie] = useCookies(["access_token"]);
  const login = async () => {
    try {
      setLoading(true);
      const data: IAuthResponse = await fetchAuth({ tenant });
      setLoading(false);
      if (data && access_token !== data.access_token) {
        setCookie("access_token", data.access_token, {
          expires: new Date(Date.now() + data.expires_in * 1000),
        });
        toast({
          title: "Login is successful",
          description: "Session is limited to 30 mins",
        });
        replace("/");
      }
    } catch (error) {
      console.error(error);
    }
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
          <Button onClick={login} disabled={loading}>
            {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
