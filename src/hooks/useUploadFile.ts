import { IFileRequest, IFileResponse } from "@/types";
import { useKycRequestFileMutation } from "./useMutations";

const URLs = {
  post: "/files",
};

export const useUploadFile = () => {
  const {
    data: fileData,
    trigger: fileTrigger,
    isMutating: isFileMutating,
  } = useKycRequestFileMutation<IFileRequest, IFileResponse>(URLs.post);

  return { fileData, fileTrigger, isFileMutating };
};
