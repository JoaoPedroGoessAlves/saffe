import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Github, ArrowRight, Loader2, DollarSign } from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  useSaffeInitGithubVerification,
  useSaffeConfirmGithubVerification,
  useSaffeCreateCostAnalysis,
} from "@/hooks/use-cost-estimator";

const repoUrlSchema = z.object({
  repoUrl: z
    .string()
    .url("Please enter a valid URL")
    .refine((url) => {
      try {
        return new URL(url).hostname === "github.com";
      } catch {
        return false;
      }
    }, "Must be a GitHub repository URL (https://github.com/owner/repo)"),
});

type Step = "input" | "verify" | "analyzing";

export default function CostEstimator() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container max-w-3xl mx-auto px-4 py-12 md:py-20 flex flex-col items-center justify-center">
          <div className="w-full text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Dev Cost Estimator
            </h1>
            <p className="text-muted-foreground text-lg">
              Connect your GitHub repository to get a professional cost estimate for rebuilding your app from scratch.
            </p>
          </div>
          <CostEstimatorWizard />
        </main>
      </div>
    </ProtectedRoute>
  );
}

function CostEstimatorWizard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>("input");
  const [repoData, setRepoData] = useState<{
    repoUrl: string;
    repoSlug: string;
    token: string;
    instructions: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const initVerification = useSaffeInitGithubVerification();
  const confirmVerification = useSaffeConfirmGithubVerification();
  const createAnalysis = useSaffeCreateCostAnalysis();

  const form = useForm<z.infer<typeof repoUrlSchema>>({
    resolver: zodResolver(repoUrlSchema),
    defaultValues: { repoUrl: "" },
  });

  async function onRepoSubmit(values: z.infer<typeof repoUrlSchema>) {
    try {
      const res = await initVerification.mutateAsync({ data: { repoUrl: values.repoUrl } });

      if (res.alreadyVerified) {
        await runAnalysis(res.repoSlug);
      } else {
        setRepoData({
          repoUrl: res.repoUrl,
          repoSlug: res.repoSlug,
          token: res.token,
          instructions: res.instructions,
        });
        setStep("verify");
      }
    } catch {
      // errors handled by hook
    }
  }

  async function onVerifyConfirm() {
    if (!repoData) return;

    try {
      const res = await confirmVerification.mutateAsync({ data: { repoSlug: repoData.repoSlug } });
      if (res.verified) {
        await runAnalysis(repoData.repoSlug);
      } else {
        toast({
          variant: "destructive",
          title: "Not verified yet",
          description: res.message || "File not found. Please add the saffe-verify.txt file and try again.",
        });
      }
    } catch {
      // errors handled by hook
    }
  }

  async function runAnalysis(repoSlug: string) {
    setStep("analyzing");
    try {
      const res = await createAnalysis.mutateAsync({ data: { repoSlug } });
      setLocation(`/cost-analysis/${res.id}`);
    } catch {
      setStep(repoData ? "verify" : "input");
    }
  }

  const copyToClipboard = () => {
    if (!repoData) return;
    navigator.clipboard.writeText(repoData.token);
    setCopied(true);
    toast({ description: "Token copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full relative">
      <AnimatePresence mode="wait">
        {step === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-xl border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Github className="w-5 h-5 text-primary" />
                  Enter GitHub Repository URL
                </CardTitle>
                <CardDescription>
                  Paste the URL of a public GitHub repository you own to estimate its development cost.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onRepoSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="repoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">Repository URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://github.com/username/my-repo"
                              className="h-14 text-lg bg-muted/30 focus-visible:ring-primary/20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-14 text-lg rounded-xl hover-elevate active-elevate-2 shadow-lg shadow-primary/20"
                      disabled={initVerification.isPending}
                    >
                      {initVerification.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Preparing...
                        </>
                      ) : (
                        <>
                          Continue <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === "verify" && repoData && (
          <motion.div
            key="verify"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-xl border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Github className="w-5 h-5 text-accent" />
                  Verify Repository Ownership
                </CardTitle>
                <CardDescription>
                  Prove you own{" "}
                  <strong className="text-foreground font-mono">{repoData.repoSlug}</strong> before
                  we analyze it.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-xl border border-border">
                  <p className="text-sm font-medium mb-3">
                    1. Create a file named{" "}
                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs">saffe-verify.txt</code> at
                    the root of your repository with this exact content:
                  </p>
                  <div className="relative group">
                    <pre className="bg-zinc-950 text-zinc-50 p-4 rounded-lg text-sm overflow-x-auto border border-zinc-800">
                      <code>{repoData.token}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={copyToClipboard}
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-xl border border-border">
                  <p className="text-sm font-medium">
                    2. Commit and push the file to your default branch, then click verify below.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    onClick={() => setStep("input")}
                    disabled={confirmVerification.isPending}
                  >
                    Back
                  </Button>
                  <Button
                    size="lg"
                    className="flex-[2] shadow-lg hover-elevate active-elevate-2"
                    onClick={onVerifyConfirm}
                    disabled={confirmVerification.isPending}
                  >
                    {confirmVerification.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying...
                      </>
                    ) : (
                      <>I added it, Verify Now</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === "analyzing" && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
              <DollarSign className="absolute inset-0 m-auto w-10 h-10 text-primary animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Analyzing Repository</h2>
            <p className="text-muted-foreground">
              Cloning and running code analysis — this may take up to a minute...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
