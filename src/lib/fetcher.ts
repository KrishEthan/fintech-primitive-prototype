"use client";

import {
  AccessTokenKey,
  ClientId,
  ClientSecret,
  FintechPrimitiveUrl,
  GrantType,
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

async function fetchKyc() {
  const payload = {};
  const access_token = new Cookies().get(AccessTokenKey);
  const response = await fetch(`${FintechPrimitiveUrl}/kyc_requests`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "x-tenant-id": "ethanai",
      "content-type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  return data;
}