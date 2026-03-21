import { useParams, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  Github, ArrowLeft, Loader2, AlertTriangle,
  ShieldAlert, ShieldCheck, Code2, ChevronDown, ChevronUp, Copy, Check,
} from "lucide-react";
import { useState } from "react";
import { useGetJulesScan, type JulesFinding } from "@/hooks/use-jules";
import { Navbar } from "@/components/layout/Navbar";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50",
  high: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800/50",
  low: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50",
};

const SEVERITY_BORDER: Record<string, string> = {
  critical: "border-l-red-500",
  high: "border-l-orange-500",
  medium: "border-l-yellow-500",
  low: "border-l-green-500",
};

const RISK_BG: Record<string, string> = {
  critical: "bg-red-600",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-green-600",
};

export default function DeepScanResult() {
  const { id } = useParams<{ id: string }>();
  const { data: analysis, isLoading } = useGetJulesScan(id || "");
  const { t } = useLanguage();

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container max-w-4xl mx-auto px-4 py-10">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-6 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("deepResult.backBtn")}
            </Button>
          </Link>

          {isLoading && !analysis ? (
            <LoadingState message={t("deepResult.loadingMsg")} />
          ) : !analysis ? (
            <ErrorState message={t("deepResult.notFound")} />
          ) : analysis.status === "pending" || analysis.status === "running" ? (
            <PendingState
              repoOwner={analysis.repoOwner}
              repoName={analysis.repoName}
              progressMessage={analysis.progressMessage}
            />
          ) : analysis.status === "failed" ? (
            <ErrorState message={analysis.errorMessage ?? t("deepResult.errorTitle")} />
          ) : (
            <ResultView analysis={analysis} />
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}

function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <AlertTriangle className="w-12 h-12 text-destructive" />
      <h2 className="text-xl font-bold text-destructive">{t("deepResult.errorTitle")}</h2>
      <p className="text-muted-foreground max-w-md">{message}</p>
      <Link href="/deep-scan">
        <Button variant="outline" className="mt-2">{t("deepResult.retryBtn")}</Button>
      </Link>
    </div>
  );
}

function PendingState({
  repoOwner,
  repoName,
  progressMessage,
}: {
  repoOwner: string;
  repoName: string;
  progressMessage: string | null;
}) {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-24 text-center gap-6"
    >
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Code2 className="w-10 h-10 text-primary" />
        </div>
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/30"
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      </div>
      <div>
        <h2 className="text-2xl font-display font-bold mb-2">
          {t("deepResult.pendingTitle")}
        </h2>
        <p className="text-muted-foreground text-lg mb-1">
          <span className="font-semibold text-foreground">{repoOwner}/{repoName}</span>
        </p>
        <p className="text-muted-foreground text-sm">
          {t("deepResult.pendingNote")}
        </p>
      </div>
      {progressMessage && (
        <motion.div
          key={progressMessage}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg bg-muted rounded-xl px-5 py-3 text-sm text-muted-foreground font-mono text-left"
        >
          {progressMessage}
        </motion.div>
      )}
      <div className="flex gap-2 mt-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function ResultView({ analysis }: { analysis: ReturnType<typeof useGetJulesScan>["data"] }) {
  const { t } = useLanguage();
  if (!analysis) return null;
  const result = analysis.result as {
    riskLevel?: string;
    totalFindings?: number;
    criticalCount?: number;
    highCount?: number;
    mediumCount?: number;
    lowCount?: number;
    findings?: JulesFinding[];
    rawMessage?: string;
  } | null;

  const riskLevel = result?.riskLevel ?? "low";
  const findings = result?.findings ?? [];
  const hasStructured = findings.length > 0;

  const severityLabels: Record<string, string> = {
    critical: t("deepResult.criticalLabel"),
    high: t("deepResult.highLabel"),
    medium: t("deepResult.mediumLabel"),
    low: t("deepResult.lowLabel"),
  };

  const totalFindings = result?.totalFindings ?? findings.length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex items-start gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <Github className="w-4 h-4" />
            <a
              href={analysis.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline truncate"
            >
              {analysis.repoOwner}/{analysis.repoName}
            </a>
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            {t("deepResult.securityReport")}
          </h1>
          {analysis.completedAt && (
            <p className="text-sm text-muted-foreground mt-1">
              {t("deepResult.completedAt")} {format(new Date(analysis.completedAt), `dd/MM/yyyy '${t("dateAt")}' HH:mm`)}
            </p>
          )}
        </div>
      </div>

      {hasStructured ? (
        <>
          <div className={`rounded-2xl p-6 text-white ${RISK_BG[riskLevel] ?? "bg-gray-600"}`}>
            <p className="text-sm font-medium uppercase tracking-widest opacity-80 mb-1">
              {t("deepResult.overallRisk")}
            </p>
            <p className="text-4xl font-display font-black">
              {severityLabels[riskLevel] ?? riskLevel}
            </p>
            <p className="text-sm opacity-90 mt-2">
              {totalFindings}{" "}
              {totalFindings !== 1 ? t("deepResult.findings") : t("deepResult.findingsOne")}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { labelKey: "deepResult.criticalLabel", count: result?.criticalCount ?? 0, color: "text-red-600" },
              { labelKey: "deepResult.highLabel", count: result?.highCount ?? 0, color: "text-orange-500" },
              { labelKey: "deepResult.mediumLabel", count: result?.mediumCount ?? 0, color: "text-yellow-600" },
              { labelKey: "deepResult.lowLabel", count: result?.lowCount ?? 0, color: "text-green-600" },
            ].map(({ labelKey, count, color }) => (
              <Card key={labelKey} className="text-center">
                <CardContent className="p-4">
                  <p className={`text-3xl font-display font-bold ${color}`}>{count}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t(labelKey)}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {findings.length === 0 ? (
            <div className="text-center py-16 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-200 dark:border-green-800/30">
              <ShieldCheck className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">
                {t("deepResult.noVulnerabilities")}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t("deepResult.noVulnDesc")}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-display font-bold flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-destructive" />
                {t("deepResult.vulnerabilitiesFound")}
              </h2>
              <AnimatePresence>
                {findings.map((finding, i) => (
                  <FindingCard key={i} finding={finding} index={i} severityLabels={severityLabels} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      ) : (
        <RawOutput message={result?.rawMessage ?? t("deepResult.noResult")} />
      )}

      <div className="pt-4 border-t border-border">
        <Link href="/deep-scan">
          <Button className="rounded-full">
            <Github className="w-4 h-4 mr-2" />
            {t("deepResult.newAnalysis")}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

function FindingCard({
  finding,
  index,
  severityLabels,
}: {
  finding: JulesFinding;
  index: number;
  severityLabels: Record<string, string>;
}) {
  const [expanded, setExpanded] = useState(index === 0);
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();
  const borderColor = SEVERITY_BORDER[finding.severity] ?? "border-l-gray-400";
  const badgeClass = SEVERITY_COLORS[finding.severity] ?? "";

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    if (!finding.vibePrompt) return;
    navigator.clipboard.writeText(finding.vibePrompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Card className={`border-l-4 ${borderColor} shadow-sm`}>
        <CardHeader
          className="pb-3 cursor-pointer select-none"
          onClick={() => setExpanded((v) => !v)}
        >
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-base font-semibold leading-snug">
              {finding.title}
            </CardTitle>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${badgeClass}`}>
                {severityLabels[finding.severity] ?? finding.severity}
              </span>
              {expanded ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </div>
          {finding.file && (
            <p className="text-xs text-muted-foreground font-mono mt-1">
              {finding.file}{finding.line ? `:${finding.line}` : ""}
            </p>
          )}
        </CardHeader>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <CardContent className="pt-0 space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {finding.description}
                </p>
                {finding.fixSuggestion && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 rounded-lg p-3">
                    <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">
                      ✅ {t("deepResult.howToFix")}
                    </p>
                    <p className="text-sm text-green-800 dark:text-green-300 leading-relaxed">
                      {finding.fixSuggestion}
                    </p>
                  </div>
                )}
                {finding.vibePrompt && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                        🤖 {t("deepResult.vibePromptLabel")}
                      </p>
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                      >
                        {copied ? (
                          <><Check className="w-3 h-3" /> {t("deepResult.copied")}</>
                        ) : (
                          <><Copy className="w-3 h-3" /> {t("deepResult.copyPrompt")}</>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-blue-800 dark:text-blue-300 font-mono bg-white dark:bg-blue-950/40 rounded p-2 leading-relaxed whitespace-pre-wrap">
                      {finding.vibePrompt}
                    </p>
                  </div>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

function RawOutput({ message }: { message: string }) {
  const { t } = useLanguage();
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-muted-foreground">{t("deepResult.rawOutput")}</h2>
      <div className="bg-muted rounded-xl p-5 text-sm font-mono whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto">
        {message}
      </div>
    </div>
  );
}
