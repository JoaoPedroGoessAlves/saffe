import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export interface JulesFinding {
  vibePrompt?: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  file?: string;
  line?: number;
  fixSuggestion: string;
}

export interface JulesResult {
  riskLevel: "critical" | "high" | "medium" | "low";
  totalFindings: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  findings: JulesFinding[];
  rawMessage?: string;
}

export interface JulesAnalysis {
  id: string;
  userId: string;
  repoUrl: string;
  repoOwner: string;
  repoName: string;
  status: "pending" | "running" | "completed" | "failed";
  julesSessionId: string | null;
  result: JulesResult | null;
  progressMessage: string | null;
  errorMessage: string | null;
  createdAt: string;
  completedAt: string | null;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function useCreateJulesScan() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (repoUrl: string) =>
      apiFetch<{ id: string; status: string }>("/api/jules-scan", {
        method: "POST",
        body: JSON.stringify({ repoUrl }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jules-scans"] });
    },
    onError: (err: Error) => {
      toast({
        variant: "destructive",
        title: "Erro ao iniciar análise",
        description: err.message,
      });
    },
  });
}

export function useListJulesScans() {
  return useQuery({
    queryKey: ["jules-scans"],
    queryFn: () => apiFetch<{ analyses: JulesAnalysis[] }>("/api/jules-scan"),
    select: (data) => data.analyses,
  });
}

export function useGetJulesScan(id: string, enabled = true) {
  return useQuery({
    queryKey: ["jules-scan", id],
    queryFn: () => apiFetch<JulesAnalysis>(`/api/jules-scan/${id}`),
    enabled: !!id && enabled,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return 8000;
      if (data.status === "completed" || data.status === "failed") return false;
      return 8000;
    },
  });
}
