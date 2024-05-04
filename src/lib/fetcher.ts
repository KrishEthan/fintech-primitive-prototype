"use client";

import {
  AccessTokenKey,
  ClientId,
  ClientSecret,
  FintechPrimitiveUrl,
  GrantType,
  TenantKey,
} from "@/constants/strings";
import { Cookies } from "react-cookie";

interface IFetcherParams {
  url: string;
  init: RequestInit;
  error: string;
}

async function fetcher({ url, init, error }: IFetcherParams) {
  try {
    const accessToken = new Cookies().get(AccessTokenKey);


    const response = await fetch(url, {
      ...init,
      headers: {
        accept: "application/json",
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
        ...init.headers,
      },
    });
    let json;
    try {
      json = await response.json();
    } catch (error) {
      json = {};
    }

    if (response.ok) {
      return json;
    }

    throw new Error(json.error || Object.values(json).join(", "));
  } catch (error) {
    console.error(error);
  }
}

function formatBody<ExtraArgs>(
  arg: ExtraArgs,
  payload?: Record<string, string>
) {
  if (arg) {
    return JSON.stringify(arg);
  }
  if (payload) {
    return JSON.stringify(payload);
  }
  return undefined;
}

export function postAuthFetcher(baseURL: string) {
  const body = new URLSearchParams({
    client_id: ClientId,
    client_secret: ClientSecret,
    grant_type: GrantType,
  });

  return <ExtraArgs>(
    key: string | [string, Record<string, string>],
    options?: Readonly<{ arg: ExtraArgs }>
  ) => {
    const isArray = Array.isArray(key);
    return fetcher({
      url: baseURL + (isArray ? key[0] : key),
      init: {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/x-www-form-urlencoded",
        },
        body,
      },
      error: "An error occurred while posting the data.",
    });
  };
}

export function postKycFetcher(baseURL: string) {
  const tenant = new Cookies().get(TenantKey);
  return <ExtraArgs>(
    key: string | [string, Record<string, string>],
    options?: Readonly<{ arg: ExtraArgs }>
  ) => {
    const isArray = Array.isArray(key);
    return fetcher({
      url: baseURL + (isArray ? key[0] : key),
      init: {
        method: "POST",
        headers: {
          "x-tenant-id": tenant,
          "content-type": "application/json",
        },
        body: formatBody(options?.arg, isArray ? key[1] : undefined),
      },
      error: "An error occurred while posting the data.",
    });
  };
}

export function postFormFetcher(baseURL: string) {
  return <ExtraArgs>(key: string, options?: Readonly<{ arg: ExtraArgs }>) => {
    const formData = new FormData();
    Object.entries(options?.arg as Record<string, string | File>).forEach(
      ([_key, value]) => {
        formData.append(_key, value);
      }
    );
    return fetcher({
      url: baseURL + key,
      init: {
        method: "POST",
        body: formData,
      },
      error: "An error occurred while posting the data.",
    });
  };
}

export function patchKycFetcher(baseURL: string) {
  return <ExtraArgs>(key: string, options?: Readonly<{ arg: ExtraArgs }>) =>
    fetcher({
      url: baseURL + key,
      init: {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: options ? JSON.stringify(options.arg) : undefined,
      },
      error: "An error occurred while modifying the data.",
    });
}

export function postInvestorFetcher(baseURL: string) {
  const tenant = new Cookies().get(TenantKey);
  return <ExtraArgs>(
    key: string | [string, Record<string, string>],
    options?: Readonly<{ arg: ExtraArgs }>
  ) => {
    const isArray = Array.isArray(key);
    return fetcher({
      url: baseURL + (isArray ? key[0] : key),
      init: {
        method: "POST",
        headers: {
          "x-tenant-id": tenant,
          "content-type": "application/json",
        },
        body: formatBody(options?.arg, isArray ? key[1] : undefined),
      },
      error: "An error occurred while posting the data.",
    });
  };
}
