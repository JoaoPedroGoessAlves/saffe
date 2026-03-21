import { useParams, Link } from "wouter";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { DollarSign, Clock, Code, Github, ArrowLeft, AlertTriangle, Loader2 } from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCostAnalysis } from "@/hooks/use-cost-estimator";
import type { CostAnalysis, LanguageCostBreakdown } from "@workspace/api-client-react";

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

function formatHours(hours: number): string {
  if (hours >= 8760) return `${(hours / 8760).toFixed(1)} years`;
  if (hours >= 720) return `${(hours / 720).toFixed(1)} months`;
  if (hours >= 40) return `${(hours / 40).toFixed(1)} weeks`;
  return `${Math.round(hours)} hours`;
}

function formatLines(lines: number): string {
  if (lines >= 1_000_000) return `${(lines / 1_000_000).toFixed(1)}M`;
  if (lines >= 1_000) return `${(lines / 1_000).toFixed(1)}K`;
  return `${lines}`;
}

export default function CostAnalysisResult() {
  const { analysisId } = useParams<{ analysisId: string }>();
  const { data: analysis, isLoading, error } = useGetCostAnalysis(analysisId!);

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="mb-4 -ml-2 hover:bg-muted">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>

            {isLoading && (
              <div className="space-y-4">
                <Skeleton className="h-10 w-2/3" />
                <Skeleton className="h-5 w-1/3" />
              </div>
            )}

            {!isLoading && analysis && (
              <>
                <div className="flex items-center gap-3 mb-1">
                  <Github className="w-6 h-6 text-primary" />
                  <h1 className="text-3xl font-display font-bold text-foreground truncate">
                    {analysis.repoSlug}
                  </h1>
                </div>
                <p className="text-muted-foreground text-sm">
                  Analyzed on {format(new Date(analysis.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                </p>
              </>
            )}
          </div>

          {isLoading && <LoadingSkeleton />}

          {error && (
            <div className="p-8 text-center border border-destructive/20 bg-destructive/5 rounded-2xl">
              <AlertTriangle className="w-10 h-10 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-destructive mb-2">Failed to load analysis</h3>
              <p className="text-muted-foreground mb-4">We encountered an error retrieving your data.</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          )}

          {!isLoading && analysis && <AnalysisContent analysis={analysis} />}
        </main>
      </div>
    </ProtectedRoute>
  );
}

function AnalysisContent({ analysis }: { analysis: CostAnalysis }) {
  const breakdown = analysis.languageBreakdown as LanguageCostBreakdown[];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card className="border-primary/30 bg-primary/5 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                Estimated Cost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-display font-bold text-primary">
                {formatCurrency(analysis.totalCost)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Based on COCOMO II model</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" />
                Estimated Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-display font-bold text-foreground">
                {formatHours(analysis.totalHours)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                ~{Math.round(analysis.totalHours).toLocaleString()} dev hours total
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Code className="w-4 h-4 text-green-500" />
                Lines of Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-display font-bold text-foreground">
                {formatLines(analysis.totalLines)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {analysis.totalLines.toLocaleString()} total lines (code only)
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Language Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {breakdown.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">No language data available.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-3 pr-4 font-semibold text-muted-foreground">Language</th>
                      <th className="pb-3 pr-4 font-semibold text-muted-foreground text-right">Lines</th>
                      <th className="pb-3 pr-4 font-semibold text-muted-foreground text-right">Complexity</th>
                      <th className="pb-3 pr-4 font-semibold text-muted-foreground text-right">Hours</th>
                      <th className="pb-3 font-semibold text-muted-foreground text-right">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {breakdown.map((lang, index) => (
                      <motion.tr
                        key={lang.language}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.03 }}
                      >
                        <td className="py-3 pr-4 font-medium">{lang.language}</td>
                        <td className="py-3 pr-4 text-right text-muted-foreground">
                          {lang.lines.toLocaleString()}
                        </td>
                        <td className="py-3 pr-4 text-right text-muted-foreground">
                          {Math.round(lang.complexity).toLocaleString()}
                        </td>
                        <td className="py-3 pr-4 text-right text-muted-foreground">
                          {formatHours(lang.estimatedHours)}
                        </td>
                        <td className="py-3 text-right font-semibold text-primary">
                          {formatCurrency(lang.estimatedCost)}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-border">
                      <td className="pt-4 pr-4 font-bold">Total</td>
                      <td className="pt-4 pr-4 text-right font-bold">
                        {analysis.totalLines.toLocaleString()}
                      </td>
                      <td className="pt-4 pr-4"></td>
                      <td className="pt-4 pr-4 text-right font-bold">{formatHours(analysis.totalHours)}</td>
                      <td className="pt-4 text-right font-bold text-primary text-lg">
                        {formatCurrency(analysis.totalCost)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card className="shadow-md bg-muted/30 border-border/50">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Methodology:</strong> Cost estimates are calculated using the COCOMO II model applied per
              language. Lines of code (excluding comments and blanks) are counted using SCC. The hourly rate
              used is $56/hr, based on industry averages. These figures are estimates intended for planning
              purposes only and do not constitute a formal development quote.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-40 mb-2" />
              <Skeleton className="h-3 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
