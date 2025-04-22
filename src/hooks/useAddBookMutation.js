import { useMutation } from "@tanstack/react-query";
import uploadBookFiles from "../app/(app)/components/uploadBookFiles";

export const useAddBookMutation = () => {
  return useMutation({
    mutationFn: uploadBookFiles,
    onSuccess: (data) => {
      console.log("Upload successful:", data);
    },
    onError: (error) => {
      console.error("Upload failed:", error);
    },
  });
};
