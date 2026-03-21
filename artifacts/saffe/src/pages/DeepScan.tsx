import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ArrowRight, Shield, Code2, Lock, AlertTriangle } from "lucide-react";
import { useCreateJulesScan } from "@/hooks/use-jules";
import { Navbar } from "@/components/layout/Navbar";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { GitHubScanAnimation } from "@/components/animations/GitHubScanAnimation";

export default function DeepScan() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <DeepScanForm />
        </main>
      </div>
    </ProtectedRoute>
  );
}

function DeepScanForm() {
  const [repoUrl, setRepoUrl] = useState("");
  const [, navigate] = useLocation();
  const createScan = useCreateJulesScan();
  const { t } = useLanguage();

  const checks = [
    { icon: Lock, key: "deepScan.check1" },
    { icon: AlertTriangle, key: "deepScan.check2" },
    { icon: Shield, key: "deepScan.check3" },
    { icon: Code2, key: "deepScan.check4" },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    const result = await createScan.mutateAsync(repoUrl.trim());
    navigate(`/deep-scan/${result.id}`);
  }

  return (
    <div className="w-full max-w-2xl">
      <AnimatePresence mode="wait">
        {createScan.isPending ? (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-2">
              <h2 className="text-2xl font-bold mb-1">{t("deepScan.initiating")}</h2>
              <p className="text-muted-foreground text-sm">{t("deepScan.footerNote")}</p>
            </div>
            <GitHubScanAnimation />
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                <Github className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl font-display font-bold text-foreground mb-3">
                {t("deepScan.title")}
              </h1>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                {t("deepScan.subtitle")}
              </p>
            </div>

            <Card className="shadow-lg border-border/60">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="repoUrl" className="text-sm font-semibold">
                      {t("deepScan.repoLabel")}
                    </Label>
                    <div className="relative">
                      <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="repoUrl"
                        type="url"
                        placeholder={t("deepScan.repoPlaceholder")}
                        className="pl-10 h-12 text-base"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        required
                        disabled={createScan.isPending}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t("deepScan.publicOnly")}
                    </p>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 rounded-xl font-semibold text-base"
                    disabled={createScan.isPending || !repoUrl.trim()}
                  >
                    <>
                      {t("deepScan.analyzeBtn")}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {checks.map(({ icon: Icon, key }) => (
                <div
                  key={key}
                  className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50 text-sm text-muted-foreground"
                >
                  <Icon className="w-4 h-4 text-primary shrink-0" />
                  <span>{t(key)}</span>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-muted-foreground mt-6">
              {t("deepScan.footerNote")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
