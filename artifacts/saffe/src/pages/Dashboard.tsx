import { Link } from "wouter";
import { format } from "date-fns";
import { useListScans } from "@workspace/api-client-react";
import { useListCostAnalyses } from "@/hooks/use-cost-estimator";
import { useListJulesScans, type JulesAnalysis } from "@/hooks/use-jules";
import { Navbar } from "@/components/layout/Navbar";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { Plus, Search, ArrowRight, Clock, AlertTriangle, DollarSign, Github, Code2 } from "lucide-react";
import { motion } from "framer-motion";
import type { CostAnalysis } from "@workspace/api-client-react";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        
        <main className="flex-1 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">Your Scans</h1>
              <p className="text-muted-foreground mt-1">Review your application security history.</p>
            </div>
            <Link href="/scan/new">
              <Button className="rounded-full shadow-md hover-elevate active-elevate-2">
                <Plus className="w-4 h-4 mr-2" />
                New Security Scan
              </Button>
            </Link>
          </div>

          <ScanList />

          <div className="mt-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-primary" />
                  Dev Cost Estimates
                </h2>
                <p className="text-muted-foreground mt-1">Understand how much it would cost to rebuild your app.</p>
              </div>
              <Link href="/cost-estimator">
                <Button variant="outline" className="rounded-full shadow-sm hover-elevate active-elevate-2">
                  <Github className="w-4 h-4 mr-2" />
                  New Cost Estimate
                </Button>
              </Link>
            </div>
            <CostAnalysisList />
          </div>

          <div className="mt-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
                  <Code2 className="w-6 h-6 text-primary" />
                  Deep Code Scans
                </h2>
                <p className="text-muted-foreground mt-1">Análise de segurança profunda do código-fonte via Jules.</p>
              </div>
              <Link href="/deep-scan">
                <Button variant="outline" className="rounded-full shadow-sm hover-elevate active-elevate-2">
                  <Github className="w-4 h-4 mr-2" />
                  Nova Análise de Código
                </Button>
              </Link>
            </div>
            <JulesScanList />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function ScanList() {
  const { data, isLoading, error } = useListScans();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map(i => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/50">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center border border-destructive/20 bg-destructive/5 rounded-2xl">
        <AlertTriangle className="w-10 h-10 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-destructive mb-2">Failed to load scans</h3>
        <p className="text-muted-foreground mb-4">We encountered an error retrieving your data.</p>
        <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  const scans = data?.scans || [];

  if (scans.length === 0) {
    return (
      <div className="text-center py-20 px-4 border-2 border-dashed border-border rounded-3xl bg-card/50">
        <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">No scans yet</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          You haven't run any security scans on your applications. Start your first scan to discover potential vulnerabilities.
        </p>
        <Link href="/scan/new">
          <Button size="lg" className="rounded-full shadow-lg hover-elevate">
            Start Free Scan
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {scans.map((scan, index) => (
        <motion.div
          key={scan.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="h-full flex flex-col hover:border-primary/50 transition-colors shadow-sm hover:shadow-md group">
            <CardHeader className="pb-3 flex-1">
              <div className="flex justify-between items-start mb-2 gap-4">
                <CardTitle className="text-lg truncate group-hover:text-primary transition-colors" title={scan.url}>
                  {scan.domain}
                </CardTitle>
                <BadgeStatus status={scan.status} />
              </div>
              <CardDescription className="flex items-center gap-1.5 text-xs truncate">
                {scan.url}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {format(new Date(scan.createdAt), "MMM d, yyyy")}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-border/60">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Risk:</span>
                  <SeverityBadge level={scan.riskLevel} />
                </div>
                
                <Link href={`/scan/${scan.id}`}>
                  <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary -mr-2">
                    View Report
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

function BadgeStatus({ status }: { status: string }) {
  if (status === 'completed') {
    return <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50">Done</span>;
  }
  if (status === 'failed') {
    return <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50">Failed</span>;
  }
  return <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 animate-pulse">Running</span>;
}

const JULES_STATUS_LABELS: Record<string, { label: string; className: string }> = {
  completed: { label: "Concluído", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50" },
  failed: { label: "Falhou", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50" },
  running: { label: "Analisando...", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 animate-pulse" },
  pending: { label: "Aguardando", className: "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400 border border-gray-200 dark:border-gray-700/50 animate-pulse" },
};

function JulesScanList() {
  const { data: analyses, isLoading, error } = useListJulesScans();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2].map(i => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center border border-destructive/20 bg-destructive/5 rounded-2xl">
        <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-3" />
        <p className="text-muted-foreground text-sm">Não foi possível carregar as análises.</p>
      </div>
    );
  }

  const list: JulesAnalysis[] = analyses ?? [];

  if (list.length === 0) {
    return (
      <div className="text-center py-14 px-4 border-2 border-dashed border-border rounded-3xl bg-card/50">
        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Code2 className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">Nenhuma análise profunda ainda</h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-6 text-sm">
          Conecte um repositório GitHub e deixe o Jules identificar vulnerabilidades no seu código-fonte.
        </p>
        <Link href="/deep-scan">
          <Button size="sm" className="rounded-full hover-elevate">
            Iniciar Deep Scan
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {list.map((analysis, index) => {
        const statusInfo = JULES_STATUS_LABELS[analysis.status] ?? JULES_STATUS_LABELS.pending;
        const result = analysis.result as { riskLevel?: string; totalFindings?: number } | null;
        return (
          <motion.div
            key={analysis.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="h-full flex flex-col hover:border-primary/50 transition-colors shadow-sm hover:shadow-md group">
              <CardHeader className="pb-3 flex-1">
                <div className="flex items-start gap-2 mb-1 justify-between">
                  <div className="flex items-start gap-2 min-w-0">
                    <Github className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <CardTitle className="text-base truncate group-hover:text-primary transition-colors" title={`${analysis.repoOwner}/${analysis.repoName}`}>
                      {analysis.repoOwner}/{analysis.repoName}
                    </CardTitle>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium shrink-0 ${statusInfo.className}`}>
                    {statusInfo.label}
                  </span>
                </div>
                <CardDescription className="flex items-center gap-1.5 text-xs">
                  <Clock className="w-3 h-3" />
                  {format(new Date(analysis.createdAt), "dd/MM/yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between pt-4 border-t border-border/60">
                  <div className="text-sm text-muted-foreground">
                    {result?.totalFindings != null ? (
                      <span>{result.totalFindings} vulnerabilidade{result.totalFindings !== 1 ? "s" : ""}</span>
                    ) : analysis.status === "running" || analysis.status === "pending" ? (
                      <span className="animate-pulse">Analisando...</span>
                    ) : (
                      <span>—</span>
                    )}
                  </div>
                  <Link href={`/deep-scan/${analysis.id}`}>
                    <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary -mr-2">
                      Ver Resultado
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

function CostAnalysisList() {
  const { data, isLoading, error } = useListCostAnalyses();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2].map(i => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center border border-destructive/20 bg-destructive/5 rounded-2xl">
        <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-3" />
        <p className="text-muted-foreground text-sm">Failed to load cost analyses.</p>
      </div>
    );
  }

  const analyses: CostAnalysis[] = data?.analyses || [];

  if (analyses.length === 0) {
    return (
      <div className="text-center py-14 px-4 border-2 border-dashed border-border rounded-3xl bg-card/50">
        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <DollarSign className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">No cost estimates yet</h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-6 text-sm">
          Connect a GitHub repository to estimate how much it would cost to rebuild your app from scratch.
        </p>
        <Link href="/cost-estimator">
          <Button size="sm" className="rounded-full hover-elevate">
            Get Your First Estimate
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {analyses.map((analysis, index) => (
        <motion.div
          key={analysis.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="h-full flex flex-col hover:border-primary/50 transition-colors shadow-sm hover:shadow-md group">
            <CardHeader className="pb-3 flex-1">
              <div className="flex items-start gap-2 mb-1">
                <Github className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <CardTitle className="text-base truncate group-hover:text-primary transition-colors" title={analysis.repoSlug}>
                  {analysis.repoSlug}
                </CardTitle>
              </div>
              <CardDescription className="flex items-center gap-1.5 text-xs">
                <Clock className="w-3 h-3" />
                {format(new Date(analysis.createdAt), "MMM d, yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between pt-4 border-t border-border/60">
                <div>
                  <p className="text-2xl font-display font-bold text-primary">
                    {formatCurrency(analysis.totalCost)}
                  </p>
                  <p className="text-xs text-muted-foreground">{analysis.totalLines.toLocaleString()} lines of code</p>
                </div>
                <Link href={`/cost-analysis/${analysis.id}`}>
                  <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary -mr-2">
                    View Report
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
