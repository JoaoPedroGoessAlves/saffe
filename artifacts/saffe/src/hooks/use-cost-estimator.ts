import { useQueryClient } from "@tanstack/react-query";
import {
  useInitGithubVerification,
  useConfirmGithubVerification,
  useCreateCostAnalysis,
  useListCostAnalyses,
  useGetCostAnalysis,
  getListCostAnalysesQueryKey,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export function useSaffeInitGithubVerification() {
  const { toast } = useToast();

  return useInitGithubVerification({
    mutation: {
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: error.message || "Could not initialize GitHub repository verification.",
        });
      },
    },
  });
}

export function useSaffeConfirmGithubVerification() {
  const { toast } = useToast();

  return useConfirmGithubVerification({
    mutation: {
      onSuccess: (data) => {
        if (data.verified) {
          toast({
            title: "Repository Verified",
            description: "You have successfully verified ownership of this repository.",
          });
        }
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Confirmation Failed",
          description:
            error.message || "Could not confirm repository ownership. Make sure the saffe-verify.txt file is present.",
        });
      },
    },
  });
}

export function useSaffeCreateCostAnalysis() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useCreateCostAnalysis({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListCostAnalysesQueryKey() });
        toast({
          title: "Analysis Complete",
          description: "Your development cost estimate is ready.",
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: error.message || "Failed to run the cost analysis.",
        });
      },
    },
  });
}

export { useListCostAnalyses, useGetCostAnalysis, getListCostAnalysesQueryKey };
