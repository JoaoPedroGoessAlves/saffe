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
import { useLanguage } from "@/contexts/LanguageContext";

type RepoFormData = { repoUrl: string };

type Step = "input" | "verify" | "analyzing";

export default function CostEstimator() {
  const { t } = useLanguage();

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container max-w-3xl mx-auto px-4 py-12 md:py-20 flex flex-col items-center justify-center">
          <div className="w-full text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              {t("costEstimator.title")}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t("costEstimator.subtitle")}
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
  const { t } = useLanguage();

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

  const repoUrlSchema = z.object({
    repoUrl: z
      .string()
      .url(t("validation.invalidRepoUrl"))
      .refine((url) => {
        try {
          return new URL(url).hostname === "github.com";
        } catch {
          return false;
        }
      }, t("validation.notGithubUrl")),
  });

  const form = useForm<RepoFormData>({
    resolver: zodResolver(repoUrlSchema),
    defaultValues: { repoUrl: "" },
  });

  async function onRepoSubmit(values: RepoFormData) {
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
          title: t("costEstimator.notVerifiedTitle"),
          description: res.message || t("costEstimator.notVerifiedDesc"),
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
    toast({ description: t("costEstimator.tokenCopied") });
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
                  {t("costEstimator.inputTitle")}
                </CardTitle>
                <CardDescription>
                  {t("costEstimator.inputDesc")}
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
                              placeholder={t("costEstimator.repoPlaceholder")}
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
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t("costEstimator.preparing")}
                        </>
                      ) : (
                        <>
                          {t("costEstimator.continue")} <ArrowRight className="ml-2 h-5 w-5" />
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
                  {t("costEstimator.verifyTitle")}
                </CardTitle>
                <CardDescription>
                  {t("costEstimator.verifyDesc1")}{" "}
                  <strong className="text-foreground font-mono">{repoData.repoSlug}</strong>{" "}
                  {t("costEstimator.verifyDesc2")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-xl border border-border">
                  <p className="text-sm font-medium mb-3">
                    {t("costEstimator.verifyStep1")}{" "}
                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs">saffe-verify.txt</code>{" "}
                    {t("costEstimator.verifyStep1b")}
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
                    {t("costEstimator.verifyStep2")}
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
                    {t("costEstimator.back")}
                  </Button>
                  <Button
                    size="lg"
                    className="flex-[2] shadow-lg hover-elevate active-elevate-2"
                    onClick={onVerifyConfirm}
                    disabled={confirmVerification.isPending}
                  >
                    {confirmVerification.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t("costEstimator.verifying")}
                      </>
                    ) : (
                      <>{t("costEstimator.verifyBtn")}</>
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
            <h2 className="text-2xl font-bold mb-2">{t("costEstimator.analyzingTitle")}</h2>
            <p className="text-muted-foreground">
              {t("costEstimator.analyzingDesc")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
