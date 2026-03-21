import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, ShieldAlert, ArrowRight, Loader2, Link2 } from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useSaffeInitVerification, useSaffeConfirmVerification, useSaffeCreateScan } from "@/hooks/use-scans";
import { useLanguage } from "@/contexts/LanguageContext";

type Step = "input" | "verify" | "scanning";

type UrlFormData = { url: string };

export default function NewScan() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();

  const [step, setStep] = useState<Step>("input");
  const [domainData, setDomainData] = useState<{ domain: string; token: string; metaTag: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const initVerification = useSaffeInitVerification();
  const confirmVerification = useSaffeConfirmVerification();
  const createScan = useSaffeCreateScan();

  const urlSchema = z.object({
    url: z.string().url(t("validation.invalidUrl")),
  });

  const form = useForm<UrlFormData>({
    resolver: zodResolver(urlSchema),
    defaultValues: { url: "" },
  });

  async function onUrlSubmit(values: UrlFormData) {
    try {
      const res = await initVerification.mutateAsync({ data: { url: values.url } });

      if (res.alreadyVerified) {
        startScan(values.url);
      } else {
        setDomainData({
          domain: res.domain,
          token: res.token,
          metaTag: res.metaTag,
        });
        setStep("verify");
      }
    } catch (e) {
      // Error handled by hook toast
    }
  }

  async function onVerifyConfirm() {
    if (!domainData) return;

    try {
      const res = await confirmVerification.mutateAsync({ data: { domain: domainData.domain } });
      if (res.verified) {
        startScan(form.getValues("url"));
      }
    } catch (e) {
      // Error handled by hook toast
    }
  }

  async function startScan(url: string) {
    setStep("scanning");
    try {
      const res = await createScan.mutateAsync({ data: { url } });
      setLocation(`/scan/${res.scanId}`);
    } catch (e) {
      setStep(domainData ? "verify" : "input");
    }
  }

  const copyToClipboard = () => {
    if (!domainData) return;
    navigator.clipboard.writeText(domainData.metaTag);
    setCopied(true);
    toast({ description: t("newScan.metaTagCopied") });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />

        <main className="flex-1 container max-w-3xl mx-auto px-4 py-12 md:py-20 flex flex-col items-center justify-center">

          <div className="w-full text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              {t("newScan.pageTitle")}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t("newScan.pageSubtitle")}
            </p>
          </div>

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
                        <Link2 className="w-5 h-5 text-primary" />
                        {t("newScan.inputTitle")}
                      </CardTitle>
                      <CardDescription>
                        {t("newScan.inputDesc")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onUrlSubmit)} className="space-y-6">
                          <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="sr-only">URL</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("newScan.urlPlaceholder")}
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
                              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t("newScan.preparing")}</>
                            ) : (
                              <>{t("newScan.continue")} <ArrowRight className="ml-2 h-5 w-5" /></>
                            )}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {step === "verify" && domainData && (
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
                        <ShieldAlert className="w-5 h-5 text-accent" />
                        {t("newScan.verifyTitle")}
                      </CardTitle>
                      <CardDescription>
                        {t("newScan.verifyDesc1")} <strong className="text-foreground">{domainData.domain}</strong> {t("newScan.verifyDesc2")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="bg-muted/50 p-4 rounded-xl border border-border">
                        <p className="text-sm font-medium mb-3">
                          {t("newScan.verifyStep1")} <code className="bg-muted px-1.5 py-0.5 rounded text-xs">&lt;head&gt;</code> {t("newScan.verifyStep1b")}
                        </p>
                        <div className="relative group">
                          <pre className="bg-zinc-950 text-zinc-50 p-4 rounded-lg text-sm overflow-x-auto border border-zinc-800">
                            <code>{domainData.metaTag}</code>
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
                        <p className="text-sm font-medium">{t("newScan.verifyStep2")}</p>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          variant="outline"
                          size="lg"
                          className="flex-1"
                          onClick={() => setStep("input")}
                          disabled={confirmVerification.isPending}
                        >
                          {t("newScan.back")}
                        </Button>
                        <Button
                          size="lg"
                          className="flex-[2] shadow-lg hover-elevate active-elevate-2"
                          onClick={onVerifyConfirm}
                          disabled={confirmVerification.isPending}
                        >
                          {confirmVerification.isPending ? (
                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t("newScan.verifying")}</>
                          ) : (
                            <>{t("newScan.verifyBtn")}</>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {step === "scanning" && (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                    <ShieldAlert className="absolute inset-0 m-auto w-10 h-10 text-primary animate-pulse" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{t("newScan.scanningTitle")}</h2>
                  <p className="text-muted-foreground">{t("newScan.scanningDesc")}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
