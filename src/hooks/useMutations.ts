"use client";

import {
  FintechPrimitiveUrl,
  FintechPrimitiveUrlV2,
} from "@/constants/strings";
import {
  patchKycFetcher,
  postAuthFetcher,
  postFormFetcher,
  postKycFetcher,
} from "@/lib/fetcher";
import useSWRMutation, { SWRMutationConfiguration } from "swr/mutation";

export default function useMutation<ExtraArgs, Data>(
  key: string,
  fetcher: (_key: string, _options?: { arg: ExtraArgs }) => Promise<Data>,
  config?: SWRMutationConfiguration<Data, Error, string, ExtraArgs>
) {
  return useSWRMutation<Data, Error, string, ExtraArgs>(key, fetcher, {
    onError(error) {
      console.error(error);
    },
    throwOnError: false,
    ...config,
  });
}

export function useAuthServerMutation<ExtraArgs, Data>(
  key: string,
  config?: SWRMutationConfiguration<Data, Error, string, ExtraArgs>
) {
  return useMutation<ExtraArgs, Data>(
    key,
    postAuthFetcher(FintechPrimitiveUrlV2),
    config
  );
}

export function useKycRequestMutation<ExtraArgs, Data>(
  key: string,
  config?: SWRMutationConfiguration<Data, Error, string, ExtraArgs>
) {
  return useMutation<ExtraArgs, Data>(
    key,
    postKycFetcher(FintechPrimitiveUrlV2),
    config
  );
}

export function useKycRequestFileMutation<ExtraArgs, Data>(
  key: string,
  config?: SWRMutationConfiguration<Data, Error, string, ExtraArgs>
) {
  return useMutation<ExtraArgs, Data>(
    key,
    postFormFetcher(FintechPrimitiveUrl),
    config
  );
}

export function useKycRequestPatchMutation<Data>(
  key: string,
  config?: SWRMutationConfiguration<Data, Error, string>
) {
  return useMutation<unknown, Data>(
    key,
    patchKycFetcher(FintechPrimitiveUrlV2),
    config
  );
}
