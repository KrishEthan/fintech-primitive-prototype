import React, { useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useKycRequestMutation } from "@/hooks/useMutations";
import { Cookies } from "react-cookie";
import { IKycRequestError } from "@/types";
import { useToast } from "../ui/use-toast";

const postback_url = "http://localhost:3000/?step=1";

const URLs = {
  post: "/esigns",
};

interface IEsignRequest {
  kyc_request: string;
  postback_url: string;
}

interface IEsignResponse {
  id: string;
  redirect_url: string;
  error: IKycRequestError;
}

const useKycPostBackURL = () => {
  const { toast } = useToast();
  const { data, trigger, isMutating } = useKycRequestMutation<
    IEsignRequest,
    IEsignResponse
  >(URLs.post, {
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
    },
  });
  return { data, trigger, isMutating };
};

export default function StepFiveForm() {
  const { data, trigger, isMutating } = useKycPostBackURL();

  useEffect(() => {
    const kyc_request = new Cookies().get("kyc_request");
    trigger({ kyc_request, postback_url });
  }, [trigger]);

  const onOpen = () => {
    window.open(data?.redirect_url, "_blank");
  };
  const onCopy = () => {
    navigator.clipboard.writeText(data?.redirect_url ?? "");
  };

  return (
    <div className="flex w-full  items-center space-x-2">
      <Input
        className="flex-1"
        id="url"
        placeholder="Enter a URL"
        type="url"
        value={data?.redirect_url}
        readOnly={true}
      />
      <Button onClick={onOpen} disabled={isMutating}>
        {isMutating ? "Loading..." : "Open"}
      </Button>
      {isMutating && (
        <Button variant="outline" onClick={onCopy}>
          Copy URL
        </Button>
      )}
    </div>
  );
}
