import { useQueryClient } from "@tanstack/react-query";
import { 
  useCreateScan, 
  useInitDomainVerification, 
  useConfirmDomainVerification,
  useSendScanReport,
  getListScansQueryKey,
  getGetScanQueryKey
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

// Wrapper hooks to add cache invalidation and toast notifications
export function useSaffeCreateScan() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useCreateScan({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListScansQueryKey() });
        toast({
          title: "Scan Started",
          description: "We are currently analyzing your application.",
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Failed to start scan",
          description: error.error || "An unexpected error occurred.",
        });
      }
    }
  });
}

export function useSaffeInitVerification() {
  const { toast } = useToast();

  return useInitDomainVerification({
    mutation: {
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: error.error || "Could not initialize domain verification.",
        });
      }
    }
  });
}

export function useSaffeConfirmVerification() {
  const { toast } = useToast();

  return useConfirmDomainVerification({
    mutation: {
      onSuccess: (data) => {
        if (data.verified) {
          toast({
            title: "Domain Verified",
            description: "You have successfully verified ownership of this domain.",
          });
        }
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Confirmation Failed",
          description: error.error || "Could not confirm domain ownership. Make sure the meta tag is correctly placed.",
        });
      }
    }
  });
}

export function useSaffeSendReport() {
  const { toast } = useToast();

  return useSendScanReport({
    mutation: {
      onSuccess: () => {
        toast({
          title: "Email Sent",
          description: "The security report has been sent successfully.",
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Failed to send email",
          description: error.error || "An unexpected error occurred.",
        });
      }
    }
  });
}
